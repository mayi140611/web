import sys
sys.path.append('/home/ian/code/github')
import os
import gensim
import jieba
import numpy as np
import pandas as pd
from scipy.linalg import norm
from utils.pymongo_wrapper import pymongo_wrapper as pmw
from utils.pickle_wrapper import pickle_wrapper as pkw
from utils.nlp.nlp_wrapper import nlp_wrapper as nlpw
from utils.pandas_wrapper import pandas_wrapper as pdw
from utils.pandas.dataframe_wrapper import dataframe_wrapper as dfw
from utils.nlp.nlp_wrapper import nlp_wrapper as nlpw
import re

class model_wrapper(object):
    def __init__(self): 
        self._model_dir = '/home/ian/code/github/crawl/requestProj/39jiankang'
        self._model_file = '/home/ian/code/github/data/word2vec/news_12g_baidubaike_20g_novel_90g_embedding_64.bin'
        self._model = gensim.models.KeyedVectors.load_word2vec_format(self._model_file, binary=True)
        self._zzlist = pkw.loadfromfile(os.path.join(self._model_dir,'症状列表.pkl'))
        self._zzshared_series = pkw.loadfromfile(os.path.join(self._model_dir,'共有症状Series.pkl'))
        self._zzshared_series_inv = pkw.loadfromfile(os.path.join(self._model_dir,'共有症状逆序Series.pkl'))
        self._tongxianmatr = pkw.loadfromfile('/home/ian/code/data/daozhen/同现矩阵ndarray.pkl')
        self._buweilist = pkw.loadfromfile(os.path.join(self._model_dir,'二级部位列表.pkl'))
        self._buweiseries = pkw.loadfromfile(os.path.join(self._model_dir,'二级部位series.pkl'))
        self._pattern = re.compile(r'|'.join(self._buweilist))
        self._pmw = pmw()
        self._zztable = self._pmw.get_collection('jiankang39', 'zznew')
    def get_buwei(self, s):
        '''
        从一个描述中得到部位
        '''
        list1 = re.findall(self._pattern,s)
        return list({self._buweiseries[i] for i in list1})
    
    def get_zzs_by_editdis(self,s1, n=10): 
        '''
        通过编辑距离计算相似度
        '''
        zzlist = self._zzlist
        e = list(map(nlpw.cal_editdistance, [s1]*len(zzlist), zzlist))
        df = pdw.build_df_from_dict({'zz':zzlist,'e':e})
        return list(dfw.sort_by_column(df,'e').loc[:,'zz'][:n].values)
    def get_zzs_by_word2vec(self,s1,n=10):
        '''
        通过word2vec模糊推荐症状
        '''
        zzlist = self._zzlist
        def vector_similarity(s1, s2):
            def sentence_vector(s):
                words = jieba.lcut(s)
                v = np.zeros(64)
                for word in words:
                    if word in self._model:
                        v += self._model[word]
                v /= len(words)
                return v
            try:
                v1, v2 = sentence_vector(s1), sentence_vector(s2)
                return np.dot(v1, v2) / (norm(v1) * norm(v2))
            except:
                return 0            
        e = list(map(vector_similarity, [s1]*len(zzlist), zzlist))
        df = pdw.build_df_from_dict({'zz':zzlist,'e':e})
        
        return list(dfw.sort_by_column(df,'e',ascending=False).loc[:,'zz'][:n].values)
    def get_zzs(self,s1,gender='男',age='4',other='普通'):
        genderdict = {'男':0,'女':1}
        otherdict = {'普通':[0],'孕妇':[1],'产褥期':[2],'孕妇及产褥期':[1,2]}
        gender = genderdict[gender]
        other = otherdict[other]
        '''
        @gender: 男，女，孕妇，产褥期
        '''
        zzlist = self._zzlist
        s1 = re.sub(r'[我你他很的,，。？！了么呢吗哦哈]|(感觉)|觉得|(非常)|(有点)','',s1)
        s1 = re.sub(r'胳膊','上臂上肢前臂',s1)
        s1 = re.sub(r'小腿','小腿下肢',s1)
        s1 = re.sub(r'大腿','大腿下肢',s1)
    #     s1 = re.sub(r'脸','脸面部',s1)
        s1 = re.sub(r'喉咙','喉咙咽喉',s1)
        s1 = re.sub(r'嘴','嘴口',s1)
    #     s1 = re.sub(r'牙','牙牙齿',s1)
        s1 = re.sub(r'屁股','屁股臀部',s1)
        s1 = re.sub(r'肚子','肚子腹部',s1)
        s1 = re.sub(r'脚','脚足',s1)
    #     s1 = re.sub(r'[疼痛]','疼痛',s1)
        s1 = re.sub(r'睡不着觉|睡不着','失眠',s1)
        s1 = re.sub(r'鼻子流血','流鼻血',s1)
        s1 = re.sub(r'黑眼圈重','黑眼圈',s1)
        s1 = re.sub(r'想吐','恶心与呕吐',s1)
        s1 = re.sub(r'牙出血','牙龈出血',s1)
        print(s1)
        if s1 in zzlist:
            return s1
        ll = pd.Series(self.get_zzs_by_editdis(s1)+self.get_zzs_by_word2vec(s1)).unique()
        bwlist = self.get_buwei(s1)
        print(bwlist)
        if bwlist:
            zzdicts = self._pmw.find_all(self._zztable,{'$or':[{'c2':i} for i in bwlist],'gender':{'$in':[gender]},'age':{'$in':[age]},'备注':{'$in':other}},fieldlist=['症状名称'])
        else:
            zzdicts = self._pmw.find_all(self._zztable,{'gender':{'$in':[gender]},'age':{'$in':[age]},'备注':{'$in':other}},fieldlist=['症状名称'])
        zz1 = [i['症状名称'] for i in zzdicts]        
        print(len(zz1))
        return [i for i in ll if i in zz1]

    def zz2zz(self,zzlist1,gender='男',age='4',other='普通'):
        genderdict = {'男':0,'女':1}
        otherdict = {'普通':[0],'孕妇':[1],'产褥期':[2],'孕妇及产褥期':[1,2]}
        gender = genderdict[gender]
        other = otherdict[other]
        t = [self._zzshared_series_inv[i] for i in zzlist1 if i in self._zzshared_series_inv]
        if t:
            r = None
            for i in t:
                if not r:
                    r = self._tongxianmatr[i]
                else:
                    r = r + self._tongxianmatr[i]
                s = pd.Series(list(r)).sort_values(ascending=False)
                l = list(s[s>0].index)
                l1 = [i for i in l if i not in t]
                if l1:
                    zzdicts = self._pmw.find_all(self._zztable,{'gender':{'$in':[gender]},'age':{'$in':[age]},'备注':{'$in':other}},fieldlist=['症状名称'])
                    zz1 = [i['症状名称'] for i in zzdicts]
                    z = list()
                    a = list()
                    for i in l1:
                        if self._zzshared_series[i] in zz1:
                            z.append(self._zzshared_series[i])
                            a.append(s[i])
#                     z = [(self._zzshared_series[i],i) for i in l1 if self._zzshared_series[i] in zz1]
                    return z,a
        return [],[]