from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import User, Movie
# from .forms import DeckForm, CardForm, SearchForm
import json
import random
import requests


@login_required
def index(request):
  #movies = Movie.objects.filter(Q(user=request.user) | Q(is_private = False))
  movies = Movie.objects.filter(Q(user=request.user))
  
  return render(request, "movies/index.html", {"movies": movies})


@login_required
def movie_detail(request, pk):
  movie = get_object_or_404(Movie, pk=pk)
  return render(request, 'movies/movie_detail.html', {"movie": movie})


@login_required
def add_movie(request):
  response = json.load(request)
  title = response['title']
  summary = response['summary']
  poster_image = response['poster_image']
  new_movie = Movie.objects.create(title=title, summary=summary, poster_image=poster_image,)
  data = {'status': 'OK'}
  return JsonResponse(data)

