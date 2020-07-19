# !/usr/bin/python3
# -*- coding: utf-8 -*-
# Time    : 2019/9/2 13:53
# Author  : Amd794
# Email   : 2952277346@qq.com
# Github  : https://github.com/Amd794


from django import forms


class LoginForm(forms.Form):
    username = forms.CharField(max_length=11, min_length=3)
    password = forms.CharField(max_length=20, min_length=6,
                               error_messages={'max_length': '密码最大不能超过20个字符', 'min_length': '密码最小不能小于6个字符'})
    remember = forms.CharField(required=False)


