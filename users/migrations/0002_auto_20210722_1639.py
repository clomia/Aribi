# Generated by Django 3.2.5 on 2021-07-22 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='user',
            name='login_method',
            field=models.CharField(choices=[('default', 'Default'), ('kakao', 'Kakao'), ('naver', 'Naver')], default='default', max_length=50),
        ),
        migrations.AddField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(blank=True, upload_to=''),
        ),
    ]
