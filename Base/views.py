from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.shortcuts import render
from datetime import datetime
from django.contrib.auth import authenticate, login, logout

from .forms import CommentForm, PostForm, RegisterForm, CommunityForm
from .models import Post, Comment, User, Community


def board(request):
    post_list = Post.objects.order_by("-pub_date")
    communitylist = Community.objects.order_by("date")

    context = {
        "post_list" : post_list,
        "community_list" : communitylist,
    }

    return render(request, "Base/website_template.html", context)

def community(request, pk):
    community = Community.objects.get(pk=pk)
    post_list = Post.objects.filter(community=community).order_by("-pub_date")
    communitylist = Community.objects.order_by("date")

    context = {
        "post_list" : post_list,
        "community_list" : communitylist,

    }

    return render(request, "Base/website_template.html", context)


def post(request, pk):
    p = Post.objects.get(id=int(pk))
    comments = Comment.objects.filter(post = int(pk)).order_by("-date")
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
    }

    return render(request, "Base/post_template.html", context)

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

    return render(request, "Base/create_post.html", context)

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

    return render(request, "Base/create_post.html", context)


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
    return render(request, "Base/register_template.html", context)

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

    return render(request, "Base/login_template.html", context)