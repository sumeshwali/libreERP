# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-03-20 13:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taskBoard', '0014_task_completion'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='archived',
            field=models.BooleanField(default=False),
        ),
    ]