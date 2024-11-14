from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.shortcuts import render
from datetime import datetime
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from .forms import CommentForm, PostForm, RegisterForm, CommunityForm
from .models import Post, Comment, User, Community, PostLike


def board(request):
    #zrobic lazy loading
    #limit offset pagination
    #django rest
    post_list = Post.objects.order_by("-pub_date")
    communitylist = Community.objects.order_by("date")
    

    context = {
        "post_list" : post_list,
        "community_list" : communitylist,
    }

    if request.user.is_authenticated:
        context["friend_list"] = request.user.following.all()
    
    return render(request, "website_template.html", context)

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
    likes = get_object_or_404(
        PostLike.objects.annotate()
    )
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