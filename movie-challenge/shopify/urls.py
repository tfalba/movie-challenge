"""shopify URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.urls import include, path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('registration.backends.simple.urls')),
    path('', views.index, name='home'),
    path('movies/<int:pk>/', views.movie_detail, name='movie-detail'),
    path('movies/add/', views.add_movie, name='add-movie'),
    path('movies/warning/', views.warning, name='warning'),
    path('movies/<int:pk>/nominate', views.nominate, name='nominate'),
    path('movies/<int:pk>/un_nominate', views.un_nominate, name='un-nominate'),
    path('movies/<int:pk>/delete', views.delete_nom, name='delete'),
    path('movies/all_nominees/', views.all_nominees, name='all-nominees'),
    path('movies/nominees_by_user/', views.by_user_nominees, name='by-user-nominees'),
    path('movies/<int:pk>/nominate_from_other', views.nominate_from_other, name='nominate-other'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),

        # For django versions before 2.0:
        # url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
