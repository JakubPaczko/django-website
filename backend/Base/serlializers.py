from rest_framework import serializers
from Base.models import Post, User, Community, Comment, PostLike, CommentLike
import contextlib


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'password', 'email']
        extra_kwargs = {'password': {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ['id', 'name', 'icon', 'description', 'date', 'admin']


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'avatar', 'email',
            'following', 'followers', 'communities'
        ]


class CommentSerializer(serializers.ModelSerializer):
    # user = UserSerializer()
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'user', 'content', 'post',
            'date', 'is_liked_by_user'
        ]
        extra_kwargs = {'is_liked_by_user': {"read_only": True}}

    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        return obj.likes.filter(user=request.user.id).exists()


class PostDetailsSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    community = CommunitySerializer()
    like_count = serializers.IntegerField(source='get_like_count')
    comment_count = serializers.IntegerField(source='get_comment_count')
    user_like_id = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'image', 'content', 'author', 'community',
            'pub_date', 'like_count', 'comment_count', 'user_like_id'
        ]
        extra_kwargs = {
            'like_count': {"read_only": True},
            'comment_count': {"read_only": True},
            'is_liked_by_user': {"read_only": True},
            'pub_date': {"read_only": True},
        }

    def get_user_like_id(self, obj):
        request = self.context.get('request')
        with contextlib.suppress(PostLike.DoesNotExist):
            return request.user.likes.get(post=obj.id).id


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'image', 'content', 'author', 'community']


class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = ['id', 'user', 'post']


class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ['id', 'user', 'comment']
