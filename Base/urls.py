from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("", views.board, name = "board"),
    path("post/<str:pk>/", views.post, name="post"),
    path("user/<str:pk>", views.user_profile, name="user_profile"),
    path("user/<str:pk>/<str:user_activity>", views.user_profile, name="user_profile_activity"),
    path("community/<str:pk>/", views.community, name="community"),
    path("createpost", views.create_post, name="createpost"),
    path("register/", views.user_register, name="user_register"),
    path("login/", views.user_login, name="user_login"),
    path("create_community/", views.create_community, name="create_community"),
    path("logout/", views.user_logout, name="user_logout")



]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)