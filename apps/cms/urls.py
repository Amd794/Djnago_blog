# !/usr/bin/python3
# -*- coding: utf-8 -*-
# Time    : 2019/10/5 9:59
# Author  : Amd794
# Email   : 2952277346@qq.com
# Github  : https://github.com/Amd794


from django.conf.urls import url

from apps.cms import views

urlpatterns = [
    # 后台首页
    url(r'^$', views.index, name='index'),

    # 文章
    url(r'^articleList/?$', views.ArticleListView.as_view(), name='articleList'),
    url(r'^write_article/?$', views.WriteArticleView.as_view(), name='WriteNewsView'),
    url(r'^edit_article/?$', views.EditArticleView.as_view(), name='edit_article'),
    url(r'^delete_article/$', views.delete_article, name='delete_article'),

    # 标签
    url(r'^article_tag/$', views.article_tag, name='article_tag'),
    url(r'^add_article_tag/$', views.add_article_tag, name='add_article_tag'),
    url(r'^edit_article_tag/$', views.edit_article_tag, name='edit_article_tag'),
    url(r'^delete_article_tag/$', views.delete_article_tag, name='delete_article_tag'),

    # 分类
    url(r'^article_category/$', views.article_category, name='article_category'),
    url(r'^add_article_category/$', views.add_article_category, name='add_article_category'),
    url(r'^edit_article_category/$', views.edit_article_category, name='edit_article_category'),
    url(r'^delete_article_category/$', views.delete_article_category, name='delete_article_category'),

    # 公告
    url(r'^announcement/$', views.AnnouncementListView.as_view(), name='announcement'),
    url(r'^add_announcement/$', views.AddAnnouncementView.as_view(), name='add_announcement'),
    url(r'^edit_announcement/$', views.EditAnnouncementView.as_view(), name='edit_announcement'),
    url(r'^delete_announcement/$', views.deleteAnnouncement, name='delete_announcement'),

    # 轮播图
    url(r'banners/$', views.banners, name='banners'),
    url(r'add_banner/$', views.add_banner, name='add_banner'),
    url(r'banner_list/$', views.banner_list, name='banner_list'),
    url(r'delete_banner/$', views.delete_banner, name='delete_banner'),
    url(r'edit_banner/$', views.edit_banner, name='edit_banner'),

    # 其它
    url(r'^upload_file/$', views.upload_file, name='upload_file'),
    url(r'^qntoken/$', views.qntoken, name='qntoken'),

]
