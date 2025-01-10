import django_filters
from Base.models import Post, Comment

class PostFilter(django_filters.FilterSet):
    class Meta:
        model = Post
        fields = {
            'author' : ['exact'],
            'pub_date' : ['lte', 'gte'],
            'title' : ['icontains']
        }

class PostCommmentsFilter(django_filters.FilterSet):
    class Meta:
        model = Comment
        fields = {
            'post' : ['exact'],
        }
