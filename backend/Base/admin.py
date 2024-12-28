from django.contrib import admin

from .models import User, Comment, Post, Community, PostLike

admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(Community)
admin.site.register(PostLike)

