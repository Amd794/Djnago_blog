# !/usr/bin/python3
# -*- coding: utf-8 -*-
# Time    : 2019/9/2 13:48
# Author  : Amd794
# Email   : 2952277346@qq.com
# Github  : https://github.com/Amd794

from django.contrib.auth import get_user_model
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render, reverse, redirect
from django.views.generic import View

from utils import restful
from .forms import LoginForm

User = get_user_model()


class Login_view(View):
    def get(self, request):
        if not request.user.is_authenticated:  # 判断是否已经授权
            return render(request, 'auth.html')
        else:
            return redirect(reverse('cms:index'))

    def post(self, request):
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            remember = form.cleaned_data.get('remember')
            print(username, password, remember)
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    login(request, user)
                    if remember:
                        request.session.set_expiry(None)
                    else:
                        request.session.set_expiry(0)
                    return redirect(reverse('cms:index'))
                else:
                    return restful.unauth(message='你的账号已经被冻结')
            else:
                return restful.params_error(message='账号或密码错误')
        else:
            return restful.params_error(message=form.errors)


def logout_view(request):
    logout(request)
    return redirect(reverse('blogauth:login'))
