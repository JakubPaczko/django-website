# Generated by Django 5.0.2 on 2025-02-03 09:47

import datetime
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Base', '0012_alter_comment_date_alter_community_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='community',
            name='users',
            field=models.ManyToManyField(blank=True, related_name='communities', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='comment',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 3, 10, 47, 21, 836768)),
        ),
        migrations.AlterField(
            model_name='commentlike',
            name='date_time',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 3, 10, 47, 21, 836768)),
        ),
        migrations.AlterField(
            model_name='community',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 3, 9, 47, 21, 835768, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AlterField(
            model_name='post',
            name='pub_date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2025, 2, 3, 10, 47, 21, 836768)),
        ),
        migrations.AlterField(
            model_name='postlike',
            name='date_time',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 3, 10, 47, 21, 836768)),
        ),
    ]
