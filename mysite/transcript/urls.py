from django.urls import path, re_path

from . import views


urlpatterns = [
    path('student/list/', views.list_student, name='list_student'),
    re_path('grade/list/(?P<sn>\d{6})/$', views.list_grade, name='list_grade'),
    path('student/add/', views.add_student, name='add_student'),
    path('student/upload/', views.upload_file, name='upload_file'),
    re_path('student/update/(?P<sn>\d{6})/$', views.upt_student, name='upt_student'),
]