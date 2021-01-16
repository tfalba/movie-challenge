# Generated by Django 3.1.5 on 2021-01-15 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20210115_1404'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='summary',
            field=models.TextField(blank=True, max_length=1500, null=True),
        ),
        migrations.AddField(
            model_name='movie',
            name='trailer_link',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]