# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-01 16:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_remove_project_repos'),
        ('gitweb', '0016_remove_repopermission_col1'),
    ]

    operations = [
        migrations.AddField(
            model_name='repo',
            name='project',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='projects.project'),
        ),
    ]
