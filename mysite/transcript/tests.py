# -*- encoding=utf-8 -*-

from django.test import TestCase

# Create your tests here.

from .models import Student


class StudentTestCase(TestCase):
    def setUp(self):
        Student.objects.create(sn='100001', name='张三', sex=1, age=20, phone='13012345678')
        Student(sn='100002', name='李四', sex=0, age=20, phone='13112345678').save()

    def test_student_save(self):
        sobj1 = Student.objects.get(sn='100001')
        sobjs = Student.objects.filter(name='李四')
        self.assertEqual(sobj1.name, '张三')
        self.assertEqual(sobjs[0].phone, '13112345678')
