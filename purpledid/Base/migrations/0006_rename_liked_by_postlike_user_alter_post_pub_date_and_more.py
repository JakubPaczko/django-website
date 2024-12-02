# Generated by Django 5.1.1 on 2024-11-14 12:58

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Base', '0005_user_following_alter_post_pub_date_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='postlike',
            old_name='liked_by',
            new_name='user',
        ),
        migrations.AlterField(
            model_name='post',
            name='pub_date',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2024, 11, 14, 13, 58, 2, 660674)),
        ),
        migrations.AlterField(
            model_name='postlike',
            name='date_time',
            field=models.DateTimeField(default=datetime.datetime(2024, 11, 14, 13, 58, 2, 661674)),
        ),
        migrations.AddConstraint(
            model_name='postlike',
            constraint=models.UniqueConstraint(fields=('user', 'post'), name='unique_like'),
        ),
    ]