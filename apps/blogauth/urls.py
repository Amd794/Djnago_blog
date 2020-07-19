# !/usr/bin/python3
# -*- coding: utf-8 -*-
# Time    : 2019/9/2 14:55
# Author  : Amd794
# Email   : 2952277346@qq.com
# Github  : https://github.com/Amd794


from . import views
from django.conf.urls import url


urlpatterns = [
    url(r'^login/$', views.Login_view.as_view(), name='login'),
    url(r'^logout/$', views.logout_view, name='logout'),
]
