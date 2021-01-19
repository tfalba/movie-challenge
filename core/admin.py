from django.contrib import admin
from .models import Movie, User

class MovieInline(admin.TabularInline):
    model = Movie
    list_display = ('title', 'release_year', 'is_nominee')
    fields = ['title', 'release_year', 'is_nominee']

    extra = 0

# class UserInline(admin.TabularInline):
#     model = User
#     extra = 0

class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_year', 'is_nominee')
    # inlines = [UserInline]

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email')
    fields = ['username']
    inlines = [MovieInline]


admin.site.register(Movie, MovieAdmin)
admin.site.register(User, UserAdmin)
