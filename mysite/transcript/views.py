# -*- encoding=utf-8 -*-
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from .models import Student
from .models import Grade
import pandas as pd
import os
from mysite.settings import BASE_DIR
# Create your views here.


def list_grade(request, sn):
    if request.method == 'GET':
        objs = Grade.objects.filter(student=Student.objects.get(sn=sn))
        return render(request, 'list_score.html', {'objs': objs})
    return Http404


@login_required
def list_student(request):
    if request.method == 'GET':
        objs = Student.objects.all()
    elif request.method == 'POST':
        condition = request.POST.get('condition', 'sn')
        content = request.POST.get('content', '')
        if condition == 'sn':
            objs = Student.objects.filter(sn=content)
        elif condition == 'name':
            objs = Student.objects.filter(name=content)
        else:
            objs = Student.objects.filter(phone=content)
    paginator = Paginator(objs, 5)  # Show 25 contacts per page
    page = request.GET.get('page')
    try:
        objss = paginator.page(page)
    except PageNotAnInteger:
        objss = paginator.page(1)
    except EmptyPage:
        objss = paginator.page(paginator.num_pages)
    return render(request, 'list_student.html', {'objs': objss})


def upload_file(request):
    if request.method == 'POST':
        obj = request.FILES.get('file')
        with open(os.path.join(BASE_DIR, obj.name), 'wb') as f:
            for line in obj.chunks():
                f.write(line)
        df = pd.read_excel(os.path.join(BASE_DIR, obj.name))
        for line in df.itertuples():
            print(line)
            g = Grade()
            g.course = line[2]
            g.score = float(line[3])
            g.student = Student.objects.get(sn=line[1])
            g.save()
        return HttpResponse('上传成功')
    return Http404


def add_student(request):
    if request.method == 'GET':
        return render(request, 'add_student1.html')
    elif request.method == 'POST':
        sn = request.POST.get('sn', '')
        name = request.POST.get('name', '')
        sex = request.POST.get('sex', 0)
        age = request.POST.get('age', 0)
        phone = request.POST.get('phone', '')
        if not name or not sex or not age:
            raise Http404
        try:
            sex = int(sex)
            age = int(age)
        except ValueError:
            raise Http404
        obj = Student()
        obj.sn = sn
        obj.name = name
        obj.sex = sex
        obj.age = age
        obj.phone = phone
        obj.save()
        return HttpResponseRedirect('/transcript/student/list/')


def upt_student(request, sn):
    if request.method == 'POST':
        name = request.POST.get('name', '')
        sex = request.POST.get('sex', 0)
        age = request.POST.get('age', 0)
        phone = request.POST.get('phone', '')
        if not name or not sex or not age:
            raise Http404
        try:
            sex = int(sex)
            age = int(age)
        except ValueError:
            raise Http404
        try:
            obj = Student.objects.get(sn=sn)
        except Student.DoesNotExist:
            raise Http404
        obj.name = name
        obj.sex = sex
        obj.age = age
        obj.phone = phone
        obj.save()
        return HttpResponseRedirect('/transcript/student/list/')
    else:
        try:
            obj = Student.objects.get(sn=sn)
        except Student.DoesNotExist:
            raise Http404
        return render(request, 'upt_student.html', {'obj': obj})


