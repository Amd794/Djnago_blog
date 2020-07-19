# encoding: utf-8

from django.conf import settings
from django.conf.urls import url

from apps.ueditor import views

urlpatterns = [
    url(r"^upload/$", views.UploadView.as_view(), name='upload')
]

if hasattr(settings, "UEDITOR_UPLOAD_PATH"):
    urlpatterns += [
        url(r"^f/<filename>$", views.send_file, name='send_file')
    ]
