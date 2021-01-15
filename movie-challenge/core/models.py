from django.db import models
from django.contrib.auth.models import AbstractUser
from django.urls import reverse


class User(AbstractUser):
    pass


class Movie(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='movies')
    title = models.CharField(max_length=255)
    poster_image = models.CharField(max_length=255, null=True, blank=True)
    summary = models.TextField(max_length=1500, null=True, blank=True)
    trailer_link = models.CharField(max_length=255, null=True, blank=True)
    is_nominee = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('movie-detail', args=[str(self.id)])
