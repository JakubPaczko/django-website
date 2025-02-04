from django.forms import ModelForm
from .models import Comment, User, Post, Community


class CommentForm(ModelForm):
    class Meta:
        model = Comment
        fields = ['content']


class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'image', 'content', 'community']


class RegisterForm(ModelForm):
    class Meta:
        model = User
        fields = ['username',  'email', 'password', 'first_name', 'last_name']


class CommunityForm(ModelForm):
    class Meta:
        model = Community
        fields = ['name', 'icon', 'description']
