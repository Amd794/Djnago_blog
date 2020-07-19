# !/usr/bin/python3
# -*- coding: utf-8 -*-
# Time    : 2019/10/1 23:37
# Author  : Amd794
# Email   : 2952277346@qq.com
# Github  : https://github.com/Amd794


from django import forms

from apps.blog.models import Article, Announcement, Banner


class FormsMixin(object):
    def get_errors(self):
        if hasattr(self, 'errors'):
            errors = self.errors.get_json_data()
            new_errors = {}
            for key, message_dicts in errors.items():
                messages = []
                for message in message_dicts:
                    messages.append(message['message'])
                new_errors[key] = messages
            return new_errors
        else:
            return {}


class EditCategoryForm(forms.Form):
    pk = forms.IntegerField(error_messages={"required": "必须传入分类的id！"})
    name = forms.CharField(max_length=100)


class EditTagForm(forms.Form):
    pk = forms.IntegerField(error_messages={"required": "必须传入标签的id！"})
    name = forms.CharField(max_length=100)  # 注意和前端变量名保持一致


class WriteArticleForm(forms.ModelForm, FormsMixin):
    category = forms.IntegerField()
    tag = forms.CharField()

    class Meta:
        model = Article
        exclude = ['category', 'author', 'date_time', 'comment', 'view', ]


class EditArticleForm(forms.ModelForm):
    category = forms.IntegerField()
    tag = forms.CharField()
    pk = forms.IntegerField()

    class Meta:
        model = Article
        exclude = ['category', 'author', 'date_time', 'comment', 'view', ]  # 排除验证字段


class AnnouncementForm(forms.ModelForm, FormsMixin):
    content = forms.Textarea()

    class Meta:
        model = Announcement
        exclude = ['pub_time', 'fix_time']


class EditAnnouncementForm(forms.ModelForm, FormsMixin):
    pk = forms.CharField()
    content = forms.Textarea()

    class Meta:
        model = Announcement
        exclude = ['pub_time', 'fix_time']


# 轮播图
class AddBannerForm(forms.ModelForm, FormsMixin):
    class Meta:
        model = Banner
        fields = ('priority', 'link_to', 'image_url', 'silde_title')


class EditBannerForm(forms.ModelForm, FormsMixin):
    pk = forms.IntegerField()

    class Meta:
        model = Banner
        fields = ('priority', 'link_to', 'image_url', 'silde_title')
