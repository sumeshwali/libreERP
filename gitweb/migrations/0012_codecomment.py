# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-23 10:55
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gitweb', '0011_commitnotification_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='codeComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('sha', models.CharField(max_length=50)),
                ('message', models.CharField(default='', max_length=500)),
                ('path', models.CharField(blank=True, max_length=250)),
                ('line', models.PositiveIntegerField(default=-1)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
