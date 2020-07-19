import os
from datetime import datetime
from urllib import parse

import qiniu
from django.conf import settings
from django.core.paginator import Paginator
from django.db.models.aggregates import Count
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.utils.timezone import make_aware
from django.views.decorators.http import require_POST, require_GET
from django.views.generic import View

from apps.blog.models import Article, Category, Tag, Announcement, Banner
from apps.blog.serializers import BannerSerializer
from apps.blogauth.decorators import blog_login_required
from apps.cms.forms import EditCategoryForm, EditTagForm, WriteArticleForm, EditArticleForm,AnnouncementForm, EditAnnouncementForm, \
    AddBannerForm, EditBannerForm
from utils import restful


# 博客后台首页
@blog_login_required
def index(request):
    return render(request, 'cms/index.html')


# 文章列表
@method_decorator(blog_login_required, name='dispatch')
class ArticleListView(View):
    def get(self, request):
        # request.GET：获取出来的所有数据，都是字符串类型
        page = int(request.GET.get('p', 1))
        start = request.GET.get('start')
        end = request.GET.get('end')
        title = request.GET.get('title')
        # request.GET.get(参数,默认值)
        # 这个默认值是只有这个参数没有传递的时候才会使用
        # 如果传递了，但是是一个空的字符串，那么也不会使用默认值
        category_id = int(request.GET.get('category', 0) or 0)

        articles = Article.objects.select_related('category', 'author')

        if start or end:
            if start:
                start_date = datetime.strptime(start, '%Y/%m/%d')
            else:
                start_date = datetime(year=2018, month=6, day=1)
            if end:
                end_date = datetime.strptime(end, '%Y/%m/%d')
            else:
                end_date = datetime.today()
            articles = articles.filter(date_time__range=(make_aware(start_date), make_aware(end_date)))

        if title:
            articles = articles.filter(title__icontains=title)

        if category_id:
            articles = articles.filter(category=category_id)

        paginator = Paginator(articles, settings.CMS_PAGE_ARTICLE_COUNT)
        page_obj = paginator.page(page)

        context_data = self.get_pagination_data(paginator, page_obj)

        context = {
            'categories': Category.objects.all(),
            'articles': page_obj.object_list,
            'page_obj': page_obj,
            'paginator': paginator,
            'start': start,
            'end': end,
            'title': title,
            'category_id': category_id,
            'url_query': '&' + parse.urlencode({
                'start': start or '',
                'end': end or '',
                'title': title or '',
                'category': category_id or ''
            })
        }

        context.update(context_data)

        return render(request, 'cms/article_list.html', context=context)

    def get_pagination_data(self, paginator, page_obj, around_count=2):
        current_page = page_obj.number
        num_pages = paginator.num_pages

        left_has_more = False
        right_has_more = False

        if current_page <= around_count + 2:
            left_pages = range(1, current_page)
        else:
            left_has_more = True
            left_pages = range(current_page - around_count, current_page)

        if current_page >= num_pages - around_count - 1:
            right_pages = range(current_page + 1, num_pages + 1)
        else:
            right_has_more = True
            right_pages = range(current_page + 1, current_page + around_count + 1)

        return {
            # left_pages：代表的是当前这页的左边的页的页码
            'left_pages': left_pages,
            # right_pages：代表的是当前这页的右边的页的页码
            'right_pages': right_pages,
            'current_page': current_page,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages
        }


# 编辑文章
@method_decorator(blog_login_required, name='dispatch')
class EditArticleView(View):
    def get(self, request):
        article_id = request.GET.get('article_id')
        article = Article.objects.get(pk=article_id)
        context = {
            'article': article,
            'categories': Category.objects.all(),
            'tags': Tag.objects.all(),
        }
        return render(request, 'cms/article_write.html', context=context)

    def post(self, request):
        form = EditArticleForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data.get('title')
            digest = form.cleaned_data.get('digest')
            tag_id = form.cleaned_data.get('tag')
            picture = form.cleaned_data.get('picture')
            content = form.cleaned_data.get('content')
            category_id = form.cleaned_data.get('category')
            pk = form.cleaned_data.get("pk")
            category = Category.objects.get(pk=category_id)

            if tag_id != 'false':
                tag_id_list = tag_id.split(',')
                new_tag_id = list(map(int, [i for i in tag_id_list if i != '']))
                last_tag_id = [tag.id for tag in Article.objects.get(pk=pk).tag.all()]

                drop_tags = list(set(last_tag_id) ^ set(new_tag_id))

                for drop_tag in drop_tags:
                    tag = Tag.objects.get(pk=drop_tag)
                    # 给文章添加标签  django2以上改为: article.tag_set.remove(xxx)
                    Article.objects.get(pk=pk).tag.remove(tag)

                for add_tag in new_tag_id:
                    tag = Tag.objects.get(pk=add_tag)
                    # 给文章添加标签  django2以上改为: article.tag_set.add(xxx)
                    Article.objects.get(pk=pk).tag.add(tag)
            else:
                print('没有标签被修改')
            Article.objects.filter(pk=pk).update(title=title, digest=digest, picture=picture, content=content,
                                                 category=category)
            return restful.ok()
        else:
            print(form)
            return restful.params_error(message=form.errors)


# 发布文章
@method_decorator(blog_login_required, name='dispatch')
class WriteArticleView(View):
    def get(self, request):
        categories = Category.objects.all()
        tags = Tag.objects.all()
        context = {
            'categories': categories,
            'tags': tags,
        }
        return render(request, 'cms/article_write.html', context=context)

    def post(self, request):
        form = WriteArticleForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data.get('title')
            digest = form.cleaned_data.get('digest')
            tag_id = form.cleaned_data.get('tag')
            picture = form.cleaned_data.get('picture')
            content = form.cleaned_data.get('content')
            category_id = form.cleaned_data.get('category')
            category = Category.objects.get(pk=category_id)

            tag_id_list = tag_id.split(',')
            new_tag_id = list(map(int, [i for i in tag_id_list if i != '']))
            print(request.user)

            Article.objects.create(title=title, digest=digest, picture=picture, content=content, category=category,
                                   author=request.user)

            for add_tag in new_tag_id:
                tag = Tag.objects.get(pk=add_tag)
                # 给文章添加标签  django2以上改为: article.tag_set.add(xxx)
                Article.objects.get(title=title).tag.add(tag)
            return restful.ok()
        else:
            print(form)
            return restful.params_error(message=form.get_errors())


# 删除文章
@require_POST
@blog_login_required
def delete_article(request):
    article_id = request.POST.get('article_id')
    Article.objects.filter(pk=article_id).delete()
    return restful.ok()


# 文章分类
@require_GET
@blog_login_required
def article_category(request):
    # categories = Category.objects.all()

    articles_of_category = Category.objects.annotate(articles_of_category=Count('article'))  # 统计每个分类下的文章
    # print(articles_of_category[0].articles_of_category)
    context = {
        'categories': articles_of_category,
    }
    return render(request, 'cms/article_category.html', context=context)


@require_POST
@blog_login_required
def add_article_category(request):
    name = request.POST.get('name')
    exists = Category.objects.filter(name=name).exists()
    if not exists:
        Category.objects.create(name=name)
        return restful.ok()
    else:
        return restful.params_error(message='该分类已经存在！')


@require_POST
def edit_article_category(request):
    form = EditCategoryForm(request.POST)
    if form.is_valid():
        pk = form.cleaned_data.get('pk')
        name = form.cleaned_data.get('name')
        try:
            Category.objects.filter(pk=pk).update(name=name)
            return restful.ok()
        except:
            return restful.params_error(message='该分类不存在！')
    else:
        return restful.params_error(message=form.get_error())


@require_POST
@blog_login_required
def delete_article_category(request):
    pk = request.POST.get('pk')
    try:
        Category.objects.filter(pk=pk).delete()
        return restful.ok()
    except:
        return restful.unauth(message='该分类不存在！')


# 标签云
@require_GET
@blog_login_required
def article_tag(request):
    # categories = Category.objects.all()

    articles_of_tag = Tag.objects.annotate(articles_of_tag=Count('article'))  # 统计每个分类下的文章
    # print(articles_of_tag[0].articles_of_tag)
    context = {
        'tags': articles_of_tag,
    }
    return render(request, 'cms/article_tag.html', context=context)


@require_POST
@blog_login_required
def add_article_tag(request):
    tag_name = request.POST.get('name')
    exists = Tag.objects.filter(tag_name=tag_name).exists()
    if not exists:
        Tag.objects.create(tag_name=tag_name)
        return restful.ok()
    else:
        return restful.params_error(message='该标签已经存在！')


@require_POST
@blog_login_required
def edit_article_tag(request):
    form = EditTagForm(request.POST)
    if form.is_valid():
        pk = form.cleaned_data.get('pk')
        tag_name = form.cleaned_data.get('name')
        try:
            Tag.objects.filter(pk=pk).update(tag_name=tag_name)
            return restful.ok()
        except:
            return restful.params_error(message='该标签不存在！')
    else:
        return restful.params_error(message=form.get_error())


@require_POST
@blog_login_required
def delete_article_tag(request):
    pk = request.POST.get('pk')
    try:
        Tag.objects.filter(pk=pk).delete()
        return restful.ok()
    except:
        return restful.unauth(message='该标签不存在！')


# TODO:公告列表
@method_decorator(blog_login_required, name='dispatch')
class AnnouncementListView(View):
    def get(self, request):
        announcements = Announcement.objects.all()
        context = {
            'announcements': announcements,
        }
        return render(request, 'cms/announcement_list.html', context=context)


# TODO:添加公告
@method_decorator(blog_login_required, name='dispatch')
class AddAnnouncementView(View):
    def get(self, request):
        return render(request, 'cms/announcement_write.html')

    def post(self, request):
        form = AnnouncementForm(request.POST)
        if form.is_valid():
            content = form.cleaned_data.get('content')
            print(content)

            Announcement.objects.create(content=content)
            return restful.ok()
        else:
            print(form)
            return restful.params_error(message='不能为空')


# TODO:编辑公告
@method_decorator(blog_login_required, name='dispatch')
class EditAnnouncementView(View):
    def get(self, request):
        announcement_id = request.GET.get('announcement_id')
        announcement = Announcement.objects.get(pk=announcement_id)
        context = {
            'announcement': announcement,
        }
        return render(request, 'cms/announcement_write.html', context=context)

    def post(self, request):
        form = EditAnnouncementForm(request.POST)
        if form.is_valid():
            content = form.cleaned_data.get('content')
            pk = form.cleaned_data.get('pk')
            print('传递过来的id为:', pk)

            Announcement.objects.filter(pk=pk).update(content=content, )
            return restful.ok()
        else:
            print(form)
            return restful.params_error(message=form.errors)


# TODO:删除公告
@require_POST
@blog_login_required
def deleteAnnouncement(request):
    announcement_id = request.POST.get('announcement_id')
    Announcement.objects.filter(pk=int(announcement_id)).delete()
    return restful.ok()


# TODO:轮播图管理
def banners(request):
    return render(request, 'cms/banners.html')


def banner_list(request):
    banners = Banner.objects.all()
    serialize = BannerSerializer(banners, many=True)
    return restful.result(data=serialize.data)


def add_banner(request):
    form = AddBannerForm(request.POST)
    if form.is_valid():
        priority = form.cleaned_data.get('priority')
        image_url = form.cleaned_data.get('image_url')
        link_to = form.cleaned_data.get('link_to')
        silde_title = form.cleaned_data.get('silde_title')
        banner = Banner.objects.create(priority=priority, image_url=image_url, link_to=link_to, silde_title=silde_title)
        return restful.result(data={"banner_id": banner.pk})
    else:
        return restful.params_error(message=form.get_errors())


def delete_banner(request):
    banner_id = request.POST.get('banner_id')
    Banner.objects.filter(pk=banner_id).delete()
    return restful.ok()


def edit_banner(request):
    form = EditBannerForm(request.POST)
    if form.is_valid():
        pk = form.cleaned_data.get('pk')
        image_url = form.cleaned_data.get('image_url')
        link_to = form.cleaned_data.get('link_to')
        priority = form.cleaned_data.get('priority')
        silde_title = form.cleaned_data.get('silde_title')
        Banner.objects.filter(pk=pk).update(image_url=image_url, link_to=link_to, priority=priority,
                                            silde_title=silde_title)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())


# 上传本地
@require_POST
@blog_login_required
def upload_file(request):
    file = request.FILES.get('file')
    name = file.name
    with open(os.path.join(settings.MEDIA_ROOT, name), 'wb') as fp:
        for chunk in file.chunks():
            fp.write(chunk)
    url = request.build_absolute_uri(settings.MEDIA_URL + name)
    # http://127.0.1:8000/media/abc.jpg
    return restful.result(data={'url': url})


# 上传七牛云
@require_GET
@blog_login_required
def qntoken(request):
    access_key = settings.QINIU_ACCESS_KEY
    secret_key = settings.QINIU_SECRET_KEY

    bucket = settings.QINIU_BUCKET_NAME
    q = qiniu.Auth(access_key, secret_key)

    token = q.upload_token(bucket)

    return restful.result(data={"token": token})
