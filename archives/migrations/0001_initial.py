# Generated by Django 3.2.5 on 2021-08-02 09:36

from django.db import migrations, models
import django_resized.forms


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Constituent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('kind', models.CharField(choices=[('액체', '액체'), ('재료', '재료'), ('용품', '용품')], max_length=50)),
                ('description', models.TextField(blank=True)),
                ('alcohol', models.IntegerField(blank=True, null=True)),
                ('reference', models.URLField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ConstituentImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('image', django_resized.forms.ResizedImageField(blank=True, crop=None, force_format=None, keep_meta=True, null=True, quality=0, size=[615, 770], upload_to='archive_images')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FlavorTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('expression', models.CharField(max_length=255)),
                ('category', models.CharField(choices=[('과일맛', '과일맛'), ('식물맛', '식물맛'), ('기본맛', '기본맛'), ('향신료맛', '향신료맛'), ('입안 감촉', '입안 감촉'), ('냄새', '냄새'), ('색감', '색감'), ('기타 특징', '기타 특징')], max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
