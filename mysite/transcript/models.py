from django.db import models

# Create your models here.


class Student(models.Model):
    SEX_TYPE = (
        (1, '男'),
        (2, '女'),
        (3, '其它'),
    )

    sn = models.CharField(max_length=10, unique=True, verbose_name='学号')
    name = models.CharField(max_length=50, verbose_name='姓名')
    sex = models.IntegerField(choices=SEX_TYPE, verbose_name='性别')
    age = models.IntegerField(verbose_name='年龄')
    phone = models.CharField(max_length=20, default='', verbose_name='手机号')
    add_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = '学生'
        verbose_name_plural = '学生信息'


class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.CharField(max_length=30, verbose_name='课程名称')
    score = models.FloatField(verbose_name='分数')
    add_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = '成绩单'

