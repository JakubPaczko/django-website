from rest_framework import serializers
from Base.models import Post, User, Community, Comment, PostLike

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'password', 'email']
        extra_kwargs = {'password' : {"write_only": True} }
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ['id', 'name', 'icon', 'description', 'date']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'post']


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    community = CommunitySerializer()
    like_count = serializers.IntegerField(source='get_like_count')
    comment_count = serializers.IntegerField(source='get_comment_count')


    class Meta:
        model = Post
        fields = ['id', 'title', 'image' ,'content', 'author', 'community', 'pub_date', 'like_count', 'comment_count']

class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = ['id', 'user', 'post']