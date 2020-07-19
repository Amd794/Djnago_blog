# !/usr/bin/python3
# -*- coding: utf-8 -*-
# Time    : 2020/4/18 15:51
# Author  : Amd794
# Email   : 2952277346@qq.com
# Github  : https://github.com/Amd794


from django.contrib.syndication.views import Feed
from django.shortcuts import reverse

from .models import Article


# https://docs.djangoproject.com/en/1.11/ref/contrib/gis/feeds/
class BlogFeed(Feed):
    # 标题
    title = 'Amd794的个人博客'
    # 描述
    description = '技术分享，记录生活，分享经验, 提供技术分享和作品分享的个人网站'
    # 链接
    link = "/"

    def items(self):
        # 返回所有文章
        return Article.objects.all()

    def item_title(self, item):
        # 返回文章标题
        return item.title

    def item_description(self, item):
        # 返回文章内容
        return item.content

    def item_link(self, item):
        # 返回文章详情页的路由
        return reverse('blog:detail', args=(item.id,))
