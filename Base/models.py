from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime 

class User(AbstractUser):
    avatar = models.ImageField(blank=True, null=True, upload_to='images/user_avatars/')
    following = models.ManyToManyField(
        "self", blank=True, related_name="followers", symmetrical=False
    )


class Community(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=32, blank=False)
    icon = models.ImageField(blank=True, null=True, upload_to='images/community_icons/')
    description = models.CharField(max_length=1024, blank=False, default="Description")
    date = models.DateField()

    def __str__(self):
        return "@" + self.name



class Post(models.Model):
    title = models.CharField(max_length=256, blank=False, default="Title")
    content = models.CharField(max_length=1024, blank=False)
    author = models.ForeignKey(User, null=True, on_delete=models.SET_DEFAULT, default=None, related_name="post_author")
    pub_date = models.DateTimeField(default=datetime.now(), blank=True)
    image = models.ImageField(blank=True, null=True, upload_to='images/')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return self.title[0:50]
    
    def get_like_count(pk=0) -> int:
        post = Post.objects.get(pk=pk)
        return 5
        # return PostLike.objects.filter(post=post)

class Comment(models.Model):
    content = models.CharField(max_length=1024)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, default=None)
    date = models.DateTimeField()

    def __str__(self):
        return self.content[0:50]
 #   likes = models.ManyToMany#Field(User, through="Like")

class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liked_by")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="liked_post")
    date_time = models.DateTimeField(default=datetime.now())

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name="unique_like"),
        ]
    def __str__(self):
        return f"@{self.user.username[0: 20]} liked: {self.post.title[0:20]}"