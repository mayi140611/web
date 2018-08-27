from django.shortcuts import render
from django.http import HttpResponse
import json
# Create your views here.
from model.daozhen.model180824 import model_wrapper

model = model_wrapper()


def getmhzz(request):
    if request.method == 'POST':
        p = json.loads(request.body.decode())
        zzlist = p['body']['zzlist']
        l = model.get_zzs(p['body']['questions'])
        if type(l) == str:
            d =  {
                "head":{
                     "code":2,
                    "msg":"success"
                },
                 "body":{"result":l},
            }
        elif type(l) == list:
            l1 = [i for i in l if i not in zzlist]
            d =  {
                "head":{
                     "code":1,
                    "msg":"success"
                },
                 "body":{"result":l1},
            }
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
        index = int(p['body']['questions'])
        zzlist = p['body']['zzlist']
        l1,aa = model.zz2zz(zzlist)
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
        index = int(p['body']['questions'])
        zzlist = p['body']['zzlist']
        l1= model.zz2ks(zzlist)
        d =  {
                "head":{
                     "code":1,
                    "msg":"success"
                },
                 "body":{"result":dict(l1[:3])},
            }
        return HttpResponse(json.dumps(d, ensure_ascii=False), content_type="application/json; charset=utf-8")
      