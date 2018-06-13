from django.shortcuts import render

# Create your views here.
from django.http.response import HttpResponse


def list1(request):
    return render(request, 'list1.html')

