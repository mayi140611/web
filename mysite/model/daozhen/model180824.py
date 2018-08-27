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
from math import sqrt

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
        self._distable = self._pmw.get_collection('jiankang39','diseases')
        self._ksdicts = pkw.loadfromfile('/home/ian/code/data/daozhen/ksdict.pkl')
        self._zzseries = pkw.loadfromfile('/home/ian/code/data/daozhen/zzseries.pkl')
        self._disseries = pkw.loadfromfile('/home/ian/code/data/daozhen/disseries.pkl')
        self._diszzmatr = pkw.loadfromfile('/home/ian/code/data/daozhen/diszzmatr.pkl')
        self._zzseries_inv = pkw.loadfromfile('/home/ian/code/data/daozhen/zzseries_inv.pkl')
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
    
    def cal_cos_similarity(self,a1,a2):
        a = a1.dot(a2)
        b = a1.dot(a1)
        c = a2.dot(a2)
        if b == 0 or c==0:
            return 0
        return a/sqrt( b*c )
    #输出可能的疾病和概率
    def zz2disease(self, zzs,gender='男',age='4',other='普通'):
        zzseries = self._zzseries
        disseries = self._disseries
        zzseries_inv = self._zzseries_inv
        diszzmatr = self._diszzmatr
        genderdict = {'男':0,'女':1}
        otherdict = {'普通':[0],'孕期':[1],'产褥期':[2],'孕妇及产褥期':[1,2]}
        gender = genderdict[gender]
        other = otherdict[other]
        temp = npw.build_zeros_array((1,len(zzseries)))[0]
        for i in zzs:
            temp[zzseries_inv[i]] = 1
        l1 = list()
        for i in range(len(disseries)):
            l1.append(self.cal_cos_similarity(temp,diszzmatr[i]))
        s1 = pdw.build_series(l1)
        s2 = s1.sort_values(ascending=False)
        diss = list(disseries[s2.iloc[s2.nonzero()].index].values)
        dissprob = list(s2.iloc[s2.nonzero()].values)
        for i in range(len(diss)):
            d = pmw.find_one(distable,{'疾病名称':diss[i],'限定性别':{'$in':[gender]},'限定年龄':{'$in':[age]},'备注':{'$in':other}},fieldlist=['罕见程度','多发年龄','多发性别'])
            if d:
                if d['罕见程度'] == 1:
                    dissprob[i] *= 0.1
                if age not in d['多发年龄']:
                    dissprob[i] *= 0.1
                if gender not in d['多发性别']:
                    dissprob[i] *= 0.1
            else:
                dissprob[i] = 0
        df = pdw.build_df_from_dict({'疾病':diss,'概率':dissprob})    
        return df.sort_values('概率',ascending=False)
    def zz2ks(self, zzs,gender='男',age='4',other='普通'):
        ksdicts = self._ksdicts
        df = self.zz2disease(zzs,gender,age,other)
        a = list(df['疾病'])
        b = list(df['概率'])
        genderdict = {'男':0,'女':1}
        otherdict = {'普通':[0],'孕期':[1],'产褥期':[2],'孕妇及产褥期':[1,2]}
        gender = genderdict[gender]
        other = otherdict[other]
        ksdict = dict()
        for i in range(len(a)):
            ks = self._distable.find_one({'疾病名称':a[i]})
            if ks and '挂号的科室' in ks:
                ks = ks['挂号的科室'].split()
                for ii in ks:
                    if ii in ksdicts and age in ksdicts[ii][1] and gender in ksdicts[ii][0] and other[0] in ksdicts[ii][2]:
                        print(a[i],ks,b[i])
                        if ii in ksdict:
                            ksdict[ii] += b[i]
                        else:
                            ksdict[ii] = b[i]
        if '血液科' in ksdict:
            ksdict['血液科'] = ksdict['血液科'] / 6        
        s = pdw.build_series(ksdict).sort_values(ascending=False)
        s = s/((s.iloc[0]+1))
        return s