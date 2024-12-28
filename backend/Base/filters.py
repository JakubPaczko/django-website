import django_filters
from Base.models import Post

class PostFilter(django_filters.FilterSet):
    class Meta:
        model = Post
        fields = {
            'author' : ['exact'],
            'pub_date' : ['lte', 'gte'],
            'title' : ['icontains']
        }
