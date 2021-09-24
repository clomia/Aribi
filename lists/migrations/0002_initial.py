# Generated by Django 3.2 on 2021-09-24 04:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('lists', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('postings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customlist',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='custom_lists', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='customlist',
            name='postings',
            field=models.ManyToManyField(related_name='custom_lists', to='postings.Posting'),
        ),
    ]
