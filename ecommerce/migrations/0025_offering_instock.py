# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-15 21:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0024_auto_20160116_0018'),
    ]

    operations = [
        migrations.AddField(
            model_name='offering',
            name='inStock',
            field=models.PositiveIntegerField(null=True),
        ),
    ]