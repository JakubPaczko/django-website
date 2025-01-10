from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from Base import views
from django.conf.urls.static import static
from django.conf import settings
from Base.views import PostViewSet, CommunityViewSet, UserViewSet, CommentViewSet, CommunityPostsViewSet, MyTokenObtainPairView
from rest_framework import routers


from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'communitys', CommunityViewSet)
router.register(r'users', UserViewSet)
router.register(r'comments', CommentViewSet, basename='comments')


# router.register(r'post_comments', CommentsViewSet)
# router.register(r'comments', CommentViewSet)


urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("", views.board, name = "board"),

    # path("post/<str:pk>/", views.post, name="post"),
    # path("like_post/<str:pk>/", views.like_post, name="like_post"),
    # path("user/<str:pk>", views.user_profile, name="user_profile"),
    # path("user/<str:pk>/<str:user_activity>", views.user_profile, name="user_profile_activity"),
    # path("follow/<str:pk>", views.follow_user, name="follow_user"),
    # path("community/<str:pk>/", views.community, name="community"),
    # path("createpost", views.create_post, name="createpost"),
    # path("register/", views.user_register, name="user_register"),
    # path("login/", views.user_login, name="user_login"),
    # path("create_community/", views.create_community, name="create_community"),
    # path("logout/", views.user_logout, name="user_logout"),

    path("likes/", views.likes, name = "likes"),
    # path('api/create/', CreateUserView.as_view()),
    # path('api/create/', CreateUserView.as_view()),
    # path('post_comments/<str:post_id>/', CommentViewSet.as_view(), name='post_comments'),
    path('community_posts/<str:community_id>/', CommunityPostsViewSet.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + router.urls
