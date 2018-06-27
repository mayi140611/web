from django.shortcuts import render
from django.http import HttpResponse

import json
import tensorflow as tf
import numpy as np
import os, time, random
from .ner.utils import str2bool, get_logger, get_entitys
from .ner.data import random_embedding,tag2label
import webshow.ner.datapreprocessing as dp
from .ner.model import BiLSTM_CRF
from mysite.settings import BASE_DIR
print('hello111')
os.environ['CUDA_VISIBLE_DEVICES'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # default: 0
config = tf.ConfigProto()
paths = {}
timestamp='1529463214'
output_path = os.path.join(BASE_DIR, 'webshow/model', timestamp)
print(output_path)
if not os.path.exists(output_path): os.makedirs(output_path)
summary_path = os.path.join(output_path, "summaries")
paths['summary_path'] = summary_path
if not os.path.exists(summary_path): os.makedirs(summary_path)
model_path = os.path.join(output_path, "checkpoints/")
if not os.path.exists(model_path): os.makedirs(model_path)
ckpt_prefix = os.path.join(model_path, "model")
paths['model_path'] = ckpt_prefix
result_path = os.path.join(output_path, "results")
paths['result_path'] = result_path
if not os.path.exists(result_path): os.makedirs(result_path)
log_path = os.path.join(result_path, "log.txt")
paths['log_path'] = log_path
## get char embeddings
word2id = dp.loadVocab(os.path.join(BASE_DIR, 'webshow/model', 'word2id.pkl'))
embeddings = np.load(os.path.join(BASE_DIR, 'webshow/model', 'pretrain_embedding.npy'))
## demo
ckpt_file = tf.train.latest_checkpoint(model_path)
print(ckpt_file)
paths['model_path'] = ckpt_file
model = BiLSTM_CRF(embeddings, tag2label, word2id, paths, config=config)
model.build_graph()
saver = tf.train.Saver()
sess = tf.Session(config=config)
print('============= demo =============')
saver.restore(sess, ckpt_file)
# Create your views here.


def list1(request):
    return render(request, 'list.html')


def ner(request):
    if request.method == 'POST':
        s = request.POST.get('content', '')
    # s = '患者三周无明显诱因下出现心悸、胸闷，无胸痛、气急等不适，面色黧黑，胃纳可，二便调，夜寐安。'
    demo_sent = list(s.strip())
    demo_data = [(demo_sent, ['O'] * len(demo_sent))]
    tag = model.demo_one(sess, demo_data)
    d = get_entitys(dp.tags, tag, demo_sent)
    return HttpResponse(json.dumps(d, ensure_ascii=False), content_type="application/json")


def fuzhen(request):
    return render(request, 'fuzhen.html')


def chelunview(request):
    return render(request, 'chelunview.html')
