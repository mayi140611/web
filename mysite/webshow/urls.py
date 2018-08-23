from django.urls import path, re_path

from . import views


urlpatterns = [
    path('list/', views.list1, name='list'),
    path('list/ner', views.ner, name='ner'),
    path('list/fuzhen', views.fuzhen, name='fuzhen'),
    path('list/chelunview', views.chelunview),
]