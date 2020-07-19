# encoding: utf-8
from utils import restful
from django.shortcuts import redirect
from django.http import Http404
from functools import wraps


def blog_login_required(func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:  # 判断是否已经授权
            return func(request, *args, **kwargs)
        else:
            if request.is_ajax():
                return restful.unauth(message='请先登录！')
            else:
                return redirect('/?next=>&loginType=none&error=You must be logged in first!!!')

    return wrapper


def blog_superuser_required(viewfunc):
    @wraps(viewfunc)
    def decorator(request, *args, **kwargs):
        if request.user.is_superuser:
            return viewfunc(request, *args, **kwargs)
        else:
            raise Http404

    return decorator
