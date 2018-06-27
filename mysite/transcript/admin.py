from django.contrib import admin

# Register your models here.
from .models import Student

class StudentAdmin(admin.ModelAdmin):
    list_display = ("sn", "name", "sex", "age", "phone")
    pass
admin.site.register(Student,StudentAdmin)