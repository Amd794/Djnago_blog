# encoding: utf-8

from rest_framework import serializers

from apps.blog.models import Banner


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'image_url', 'priority', 'link_to','silde_title')
