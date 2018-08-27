from . import views
from django.urls import path





urlpatterns = [
    path('getmhzz/', views.getmhzz, name='getmhzz'),
    path('zz2zz/', views.zz2zz, name='zz2zz'),
    path('zz2ks/', views.zz2ks, name='zz2ks'),
]