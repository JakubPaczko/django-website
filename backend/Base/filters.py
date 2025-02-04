import django_filters
from Base.models import Post, Comment, Community


class PostFilter(django_filters.FilterSet):
    class Meta:
        model = Post
        fields = {
            'author': ['exact'],
            'pub_date': ['lte', 'gte'],
            'title': ['icontains'],
            'community': ['exact']
        }


class CommunityFilter(django_filters.FilterSet):
    class Meta:
        model = Community
        fields = {
            'users': ['exact'],
            'admin': ['exact']
        }


class PostCommmentsFilter(django_filters.FilterSet):
    class Meta:
        model = Comment
        fields = {
            'post': ['exact'],
            'user':['exact'],
        }
