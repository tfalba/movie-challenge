from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import User, Movie
import json
import random


@login_required
def index(request):
    movies = Movie.objects.filter(Q(user=request.user)).order_by('title', 'release_year')
    nominee_count = movies.filter(is_nominee=True).count()
    return render(request, "movies/index.html", {"movies": movies, "nominee_count": nominee_count})

@login_required
def all_nominees(request):
    movies = Movie.objects.filter(is_nominee=True).order_by('title', 'release_year', 'modified_at')
    movie_titles = movies.values('title').distinct()
    movies_unique = Movie.objects.none()
    for movie in movies:
        movie_first_instance = movies.filter(title=movie.title).filter(release_year=movie.release_year).first()
        if movie_first_instance.title not in movie_titles:
            instance = Movie.objects.filter(pk=movie_first_instance.pk)
            movies_unique |= instance
    movies_unique = movies_unique.order_by('title', 'release_year')

    my_movies = Movie.objects.filter(is_nominee=True).filter(user=request.user).order_by('title', 'release_year')
    nominee_count = my_movies.filter(is_nominee=True).count()

    return render(request, 'movies/all_nominees.html', {"movies_unique": movies_unique, "movies": movies, "nominee_count": nominee_count})

@login_required
def nominee_summary(request):
    movies = Movie.objects.filter(is_nominee=True)

    pass

@login_required
def by_user_nominees(request):
    movies = Movie.objects.filter(is_nominee=True).order_by('title', 'modified_at')
    users = User.objects.all()
    my_movies = Movie.objects.filter(is_nominee=True).filter(user=request.user)
    nominee_count = my_movies.filter(is_nominee=True).count()
    return render(request, 'movies/nominee_list_by_user.html', {"movies": movies, "users": users, "nominee_count": nominee_count})

@login_required
def warning(request):
    return render(request, 'movies/warning.html')

@login_required
def movie_detail(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    nominations = Movie.objects.filter(title=movie.title).filter(release_year=movie.release_year).filter(is_nominee=True).count()
    movies = Movie.objects.filter(Q(user=request.user)).order_by('modified_at')
    nominee_count = movies.filter(is_nominee=True).count()
    return render(request, 'movies/movie_detail.html', {"movie": movie, "nominee_count": nominee_count, "nominations": nominations})

@login_required
def add_movie(request):
    response = json.load(request)
    title = response['title']
    summary = response['summary']
    poster_image = response['poster_image']
    trailer_link = response['trailer_link']
    release_year = response['release_year']
    new_movie = Movie.objects.create(title=title, summary=summary, poster_image=poster_image, trailer_link=trailer_link, user=request.user, release_year=release_year)
    data = {'status': 'OK'}
    return JsonResponse(data)

@login_required
def nominate(request, pk):
    movies = Movie.objects.filter(is_nominee=True).filter(user=request.user)
    movie = get_object_or_404(Movie, pk=pk)
    matched = False
    for movie_check in movies:
        if movie_check.title == movie.title and movie_check.release_year == movie.release_year:
            matched = True
    if matched is False:
        movie.is_nominee = True
        movie.save()
    data = {'mark-nominee': 'mark-nominee'}
    return JsonResponse(data)

@login_required
def nominate_from_other(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    movies = Movie.objects.filter(user=request.user)
    matched = False
    for my_movie in movies:
        if my_movie.title == movie.title and my_movie.release_year == movie.release_year:
            my_movie.is_nominee = True
            my_movie.save()
            matched = True
    if matched is False:
        new_movie = Movie.objects.create(title=movie.title, summary=movie.summary, poster_image=movie.poster_image, trailer_link=movie.trailer_link, user=request.user, is_nominee=True, release_year=movie.release_year)
    data = {'create-nominee': 'create-nominee'}
    return JsonResponse(data)

@login_required
def nominate_from_user(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    movies = Movie.objects.filter(user=request.user)
    matched = False
    for my_movie in movies:
        if movie.title == my_movie.title and movie.release_year == my_movie.release_year:
            my_movie.is_nominee = True
            my_movie.save()
            matched = True
    if matched is False:
        new_movie = Movie.objects.create(title=movie.title, summary=movie.summary, poster_image=movie.poster_image, trailer_link=movie.trailer_link, user=request.user, is_nominee=True, release_year=movie.release_year)
    data = {'create-nominee': 'create-nominee'}
    return JsonResponse(data)

@login_required
def un_nominate(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    movie.is_nominee = False
    movie.save()
    data = {'mark-not-nominee': 'mark-not-nominee'}
    return JsonResponse(data)

@login_required
def delete_nom(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    movie.delete()
    data = {'mark-deleted': 'mark-deleted'}
    return JsonResponse(data)
