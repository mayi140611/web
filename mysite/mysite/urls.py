"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
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
from django.urls import path, include
# from django.contrib.auth.views import login


from . import views
from transcript import views as v


urlpatterns = [
    path('register/', views.register, name='register'),
#     path('accounts/login/', login, {'template_name': 'login.html'}, name='login'),
    path('accounts/profile/', v.list_student, name='list_student'),
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('transcript/', include('transcript.urls')),
    path('webshow/', include('webshow.urls')),
    path('daozhen/', include('daozhen.urls')),
]
