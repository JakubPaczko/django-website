from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.forms.models import model_to_dict
from django.contrib.auth import authenticate, login, logout
from datetime import datetime
from Base.forms import CommentForm, PostForm, RegisterForm, CommunityForm
from Base.models import Post, Comment, User, Community, PostLike, CommentLike
from Base.filters import PostFilter, PostCommmentsFilter, CommunityFilter
from Base.serlializers import PostSerializer, CommunitySerializer, UserSerializer, CommentSerializer, PostLikeSerializer, CommentLikeSerializer, UserDetailsSerializer, PostDetailsSerializer
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class PostViewSet(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    # serializer_class = PostSerializer
    queryset = Post.objects.all().order_by('-pub_date')
    filterset_class = PostFilter

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostSerializer
        else:
            return PostDetailsSerializer
        
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def is_liked_by_user(self, request, pk=None):
        post = self.get_object()
        user = request.user

        postlike = PostLike.objects.filter(post=post, user=user)

        if postlike.exists():
            return Response({'status': True })
        else:
            return Response({'status': False })

    @action(detail=True, methods=['get'])
    def like_count(self, request, pk=None):
        post = self.get_object()
        likes = PostLike.objects.filter(post=post)
        return Response({'status': likes.__len__() })



class CommunityViewSet(viewsets.ModelViewSet):
    serializer_class = CommunitySerializer
    queryset = Community.objects.all().order_by('date')
    filterset_class = CommunityFilter

    # @permission_classes([AllowAny])
    # def create(self, request):
    #     serializer = self.serializer_class(data=request.data)
        
    #     if serializer.is_valid():
    #         serializer.save()
    #         print(request.data)
    #         return Response({'status': 'community added'})
    #     else:
    #         return Response({serializer.errors, request.data},
    #                         status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    # serializer_class = UserSerializer
    # serializers = [UserSerializer, UserDetailsSerializer]
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        else:
            return UserDetailsSerializer


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all().order_by('-date')
    filterset_class = PostCommmentsFilter
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_like(self, request, pk=None):
        comment = self.get_object()
        user = request.user

        data = {
            'user': user.id,
            'comment': comment.id,
        }

        serializer = CommentLikeSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'like added'})
        else:
            like_obj = CommentLike.objects.filter(comment=comment, user=user)
            
            if like_obj.exists():
                like_obj.delete()
                return Response({'status': 'like deleted'})
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommunityPostsViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    
    def get_queryset(self):
        community = self.kwargs['community_id']
        return Post.objects.filter(community=community)

class PostLikeViewSet(viewsets.ModelViewSet):
    serializer_class = PostLikeSerializer
    queryset = PostLike.objects.all()

class CommentLikeViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = CommentLike.objects.all()
