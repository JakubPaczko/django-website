from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.forms.models import model_to_dict
from django.contrib.auth import authenticate, login, logout
from datetime import datetime
from Base.forms import CommentForm, PostForm, RegisterForm, CommunityForm
from Base.models import Post, Comment, User, Community, PostLike, CommentLike
from Base.filters import PostFilter, PostCommmentsFilter
from Base.serlializers import PostSerializer, CommunitySerializer, UserSerializer, CommentSerializer, PostLikeSerializer, CommentLikeSerializer
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import json


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
    serializer_class = PostSerializer
    queryset = Post.objects.all().order_by('-pub_date')
    filterset_class = PostFilter

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def is_liked_by_user(self, request, pk=None):
        post = self.get_object()
        user = request.user

        postlike = PostLike.objects.filter(post=post, user=user)

        if postlike.exists():
            return Response({'status': True })
        else:
            return Response({'status': False })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_post_comment(self, request, pk=None):
        post = self.get_object()
        user = request.user
        
        data = request.data
        data['user'] = user.id
        data['post'] = post.id

        # print(data)
        serializer = CommentSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'comment added'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def like_count(self, request, pk=None):
        post = self.get_object()
        likes = PostLike.objects.filter(post=post)
        return Response({'status': likes.__len__() })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_post_like(self, request, pk=None):
        post = self.get_object()
        user = request.user

        data = {
            'user': user.id,
            'post': post.id,
        }

        serializer = PostLikeSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'like added'})
        else:
            like_obj = PostLike.objects.filter(post=post, user=user)
            
            if like_obj.exists():
                like_obj.delete()
                return Response({'status': 'like deleted'})
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommunityViewSet(viewsets.ModelViewSet):
    serializer_class = CommunitySerializer
    queryset = Community.objects.all().order_by('date')

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
    serializer_class = UserSerializer


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
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

class CommunityPostsViewSet(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        community = self.kwargs['community_id']
        return Post.objects.filter(community=community)

@api_view(['GET'])
@permission_classes([AllowAny])
def likes(request):
    return render(PostLike.objects.all())

def board(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

def community(request, pk):
    community = Community.objects.get(pk=pk)
    post_list = Post.objects.filter(community=community).order_by("-pub_date")
    communitylist = Community.objects.order_by("date")

    context = {
        "post_list" : post_list,
        "community_list" : communitylist,

    }

    return render(request, "website_template.html", context)

def follow_user(request, pk):
    try:
        follow_user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return redirect('board')
    
    user = request.user
    followers = user.following.all()

    if user != follow_user:
        if follow_user in followers:
            user.following.remove(follow_user)
        else:
            user.following.add(follow_user)

    return redirect('user_profile', pk=pk)

def like_comment(request, post_pk, comment_pk):
    pass

def user_profile(request, pk, user_activity="posts"):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return redirect('board')
    
    user_posts = Post.objects.filter(author=user)
    user_comments = Comment.objects.filter(user=user)
    followers = request.user.following.all()

    context = {
        'user' : user,
        'is_followed' : False,
        'friend_list' : followers,
    }
    
    if user_activity == 'posts':
        context['post_list'] = user_posts
    elif user_activity == 'comments':
        context['comment_list'] = user_comments

    if user in request.user.following.all():
        context['is_followed'] = True

    return render(request, "user_profile_template.html", context)


def post(request, pk):
    p = Post.objects.get(id=int(pk))
    comments = Comment.objects.filter(post = int(pk)).order_by("-date")
    communitylist = Community.objects.order_by("date")
    form = CommentForm()
    
    if request.method == 'POST':
        form = CommentForm(request.POST)
        form.instance.post = p
        form.instance.date = datetime.now()
        form.instance.user = request.user

        if form.is_valid():
            form.save()
        # if user == None:
    
    context = {
        "post" : p,
        "comments" : comments,
        "form" : form,
        "community_list" : communitylist,
    }

    return render(request, "post_template.html", context)

def create_post(request):
    form = PostForm()

    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        form.instance.pub_date = datetime.now()
        form.instance.author = request.user
        # form.instance.image = request.FILES.get('image')

        if form.is_valid():
            form.save()
            return redirect('board')
        
    context = {
        "form" : form
    }

    return render(request, "create_post.html", context)

def like_post(request, pk):
    post = Post.objects.get(pk=pk)
    user = request.user
    
    try:
        post_like = PostLike.objects.get(user=user, post=post)
        post_like.delete()

    except PostLike.DoesNotExist:

        post_like = PostLike(user=user, post=post)
        post_like.save()

    return redirect('post', pk=pk)


def create_community(request):
    form = CommunityForm()

    if request.method == 'POST':
        form = CommunityForm(request.POST, request.FILES)
        form.instance.date = datetime.now()
        form.instance.admin = request.user

        if form.is_valid():
            form.save()
            return redirect('board')
        
    context = {
        "form" : form
    }

    return render(request, "create_post.html", context)


def user_register(request):
    form = RegisterForm(request.POST)

    if request.method == 'POST':
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('board')
    
    context = {
        "form" : form
    }
    return render(request, "register_template.html", context)

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try: 
            user = User.objects.get(username=username)
        except:
            return HttpResponse('User does not exists')
        
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('board')
        else:
            return HttpResponse('Username or password is wrong')

    context = {

    }

    return render(request, "login_template.html", context)

def user_logout(request):
    logout(request)
    return redirect('board')