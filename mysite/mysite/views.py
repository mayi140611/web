# -*- encoding=utf-8 -*-

from django.http.response import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User


def index(request):
    return HttpResponse('Hello World!  你好')


def register(request):
    if request.method == 'GET':
        return render(request, 'register.html')
    elif request.method == 'POST':
        phone = request.POST.get('phone', '')
        message = request.POST.get('message', '')
        pw = request.POST.get('pw', '')
        repw = request.POST.get('repw', '')
        if len(phone) == 11 and str(phone).isdecimal() and message == '1234' and pw == repw and pw != '':
            user = User(username=phone)
            user.set_password(pw)
            user.save()
            return redirect('login')
        return HttpResponse('输入有误，注册失败！')
    return HttpResponse('Hello World!  你好')