from django.shortcuts import render
from django.http import HttpResponse
import json

# Create your views here.
from model.daozhen.model180824 import model_wrapper

model = model_wrapper()


def getmhzz(request):
    if request.method == 'POST':
        p = json.loads(request.body.decode())
        age = p['head']['age']
        gender = p['head']['gender']
        other = p['head']['other']
        if other == '':
            other = '普通'
        print(gender,age,other,p)
        zzlist = p['body']['zzlist']
        zzlist1 = []
        if 'wxzz' in p['body']:
            zzlist1 = p['body']['wxzz']
        l = model.get_zzs(p['body']['questions'],gender,age,other)
        print('问题',p['body']['questions'])
        if type(l) == str:
            d =  {
                "head":{
                     "code":2,
                    "msg":"success"
                },
                 "body":{"result":l},
            }
            print('已定位症状：',l)
        elif type(l) == list:
            l1 = [i for i in l if i not in zzlist and i not in zzlist1]
            d =  {
                "head":{
                     "code":1,
                    "msg":"success"
                },
                 "body":{"result":l1[:5]},
            }
            print('模糊匹配列表：',l1[:5])
        return HttpResponse(json.dumps(d, ensure_ascii=False), content_type="application/json; charset=utf-8")
    if request.method == 'GET':
        l = model.get_zzs('我牙出血了')
        d =  {
            "head":{
                 "code":1,
                "msg":"success"
            },
             "body":{"result":l},
        }

        return HttpResponse(json.dumps(d, ensure_ascii=False), content_type="application/json; charset=utf-8")
def zz2zz(request):
    if request.method == 'POST':
        p = json.loads(request.body.decode())
        age = p['head']['age']
        gender = p['head']['gender']
        other = p['head']['other']
        if other == '':
            other = '普通'
        index = int(p['body']['questions'])
        zzlist = p['body']['zzlist']
        print('输入症状列表：',zzlist,p)
        zzlist1 = []
        if 'wxzz' in p['body']:
            zzlist1 = p['body']['wxzz']
        l1,aa = model.zz2zz(zzlist,gender,age,other)
        l1 = [i for i in l1 if i not in zzlist1]
        d =  {
                "head":{
                     "code":1,
                    "msg":"success"
                },
                 "body":{"result":l1[index:(index+5)]},
            }
        return HttpResponse(json.dumps(d, ensure_ascii=False), content_type="application/json; charset=utf-8")
    
def zz2ks(request):
    if request.method == 'POST':
        p = json.loads(request.body.decode())
        age = p['head']['age']
        gender = p['head']['gender']
        other = p['head']['other']
        if other == '':
            other = '普通'
        zzlist = p['body']['zzlist']
        print('输入症状列表：',zzlist,p)
        l1= model.zz2ks(zzlist,gender,age,other)
        r = list()
        for i,n in l1[:3].items():
            if i[-1] != '科':
                i += '科'
            r.append('{}:{}'.format(i,n))
#         r = ['{}:{}'.format(i,n) for i,n in l1[:3].items()]
        print('推荐科室结果:',r)
        d =  {
                "head":{
                     "code":1,
                    "msg":"success"
                },
                 "body":{"result":r},
            }
        return HttpResponse(json.dumps(d, ensure_ascii=False), content_type="application/json; charset=utf-8")
      