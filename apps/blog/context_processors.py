# -*- coding: utf-8 -*-

from apps.blog.models import Category, Article, Tag, Comment, Announcement


def sidebar(request):
    announcements = Announcement.objects.all()

    category_list = Category.objects.all()
    # 所有类型

    article_rank = Article.objects.all().order_by('-view')[0:6]
    # 文章排行

    tag_list = Tag.objects.all()
    # 标签

    comment = Comment.objects.all().order_by('-create_time')[0:6]
    # 评论

    return {
        'category_list': category_list,
        'article_rank': article_rank,
        'tag_list': tag_list,
        'comment_list': comment,
        'announcements': announcements,

    }


if __name__ == '__main__':
    pass
