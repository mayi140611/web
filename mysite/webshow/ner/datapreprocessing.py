# coding: utf-8

import pandas as pd
import os
import re
import pickle
import argparse
##cmd
#python .\datapreprocessing.py -d './tmp/data' formattransform D:\github\zh-NER-TF\data_path\original\testright1.txt
#python .\datapreprocessing.py  -d './tmp/filename' splitfile 'D:\baiduyunpanbackup\datasets\sample-data\sample-data.csv'
## hyperparameters
'''
parser = argparse.ArgumentParser(description='datapreprocessing')
parser.add_argument('mode', type=str, choices=['splitfile','buildcorpus'], help='mode select')
parser.add_argument('sourcepath', type=str, help='source file path')
parser.add_argument('-d','--destpath', type=str, default='.', help='dest file path')
parser.add_argument('-l','--lineNum', type=int, default=20, help='the line number of small file splitted')
args = parser.parse_args()
'''
# print('tagprocessing')
# tags = ['o','b', 'jx', 'jc', 'm', 'qt','w', 's', 't', 'x', 'yc', 'yw', 'zs', 'zl']
# comments = ['o', '疾病', '畸形', '异常检查', '医疗设备', '其他治疗', '部位', '受伤', '查体', '细菌、病毒', '异常体征', '药物', '自诉症状', '治疗过程']
tags = ['o', 'b', 'jx', 'jc', 'm', 'qt', 'w', 's', 't', 'x', 'yc', 'yw', 'zs', 'zl', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '1jx', '2jx', '3jx', '4jx', '5jx', '6jx', '7jx', '1jc', '2jc', '3jc', '4jc', '5jc', '6jc', '7jc', '1m', '2m', '3m', '4m', '5m', '6m', '7m', '1qt', '2qt', '3qt', '4qt', '5qt', '6qt', '7qt', '1w', '2w', '3w', '4w', '5w', '6w', '7w', '1s', '2s', '3s', '4s', '5s', '6s', '7s', '1t', '2t', '3t', '4t', '5t', '6t', '7t', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '1yc', '2yc', '3yc', '4yc', '5yc', '6yc', '7yc', '1yw', '2yw', '3yw', '4yw', '5yw', '6yw', '7yw', '1zs', '2zs', '3zs', '4zs', '5zs', '6zs', '7zs', '1zl', '2zl', '3zl', '4zl', '5zl', '6zl', '7zl']
comments = ['o',
 '疾病',
 '畸形',
 '异常检查',
 '医疗设备',
 '其他治疗',
 '部位',
 '受伤',
 '查体',
 '细菌、病毒',
 '异常体征',
 '药物',
 '自诉症状',
 '治疗过程',
 '疾病(-)',
 '疾病(家族成员)',
 '疾病(有条件的)',
 '疾病(可能的)',
 '疾病(待证实的)',
 '疾病(偶有的)',
 '疾病(既往史)',
 '畸形(-)',
 '畸形(家族成员)',
 '畸形(有条件的)',
 '畸形(可能的)',
 '畸形(待证实的)',
 '畸形(偶有的)',
 '畸形(既往史)',
 '异常检查(-)',
 '异常检查(家族成员)',
 '异常检查(有条件的)',
 '异常检查(可能的)',
 '异常检查(待证实的)',
 '异常检查(偶有的)',
 '异常检查(既往史)',
 '医疗设备(-)',
 '医疗设备(家族成员)',
 '医疗设备(有条件的)',
 '医疗设备(可能的)',
 '医疗设备(待证实的)',
 '医疗设备(偶有的)',
 '医疗设备(既往史)',
 '其他治疗(-)',
 '其他治疗(家族成员)',
 '其他治疗(有条件的)',
 '其他治疗(可能的)',
 '其他治疗(待证实的)',
 '其他治疗(偶有的)',
 '其他治疗(既往史)',
 '部位(-)',
 '部位(家族成员)',
 '部位(有条件的)',
 '部位(可能的)',
 '部位(待证实的)',
 '部位(偶有的)',
 '部位(既往史)',
 '受伤(-)',
 '受伤(家族成员)',
 '受伤(有条件的)',
 '受伤(可能的)',
 '受伤(待证实的)',
 '受伤(偶有的)',
 '受伤(既往史)',
 '查体(-)',
 '查体(家族成员)',
 '查体(有条件的)',
 '查体(可能的)',
 '查体(待证实的)',
 '查体(偶有的)',
 '查体(既往史)',
 '细菌、病毒(-)',
 '细菌、病毒(家族成员)',
 '细菌、病毒(有条件的)',
 '细菌、病毒(可能的)',
 '细菌、病毒(待证实的)',
 '细菌、病毒(偶有的)',
 '细菌、病毒(既往史)',
 '异常体征(-)',
 '异常体征(家族成员)',
 '异常体征(有条件的)',
 '异常体征(可能的)',
 '异常体征(待证实的)',
 '异常体征(偶有的)',
 '异常体征(既往史)',
 '药物(-)',
 '药物(家族成员)',
 '药物(有条件的)',
 '药物(可能的)',
 '药物(待证实的)',
 '药物(偶有的)',
 '药物(既往史)',
 '自诉症状(-)',
 '自诉症状(家族成员)',
 '自诉症状(有条件的)',
 '自诉症状(可能的)',
 '自诉症状(待证实的)',
 '自诉症状(偶有的)',
 '自诉症状(既往史)',
 '治疗过程(-)',
 '治疗过程(家族成员)',
 '治疗过程(有条件的)',
 '治疗过程(可能的)',
 '治疗过程(待证实的)',
 '治疗过程(偶有的)',
 '治疗过程(既往史)']
#14个标签
# tag2label = dict(zip(tags,range(len(tags))))
# print('tagprocessed') 
def removeWhiteSpace(dir,file):
	"""
	人工打标签前的工作：去除每行文本中的空格
	"""
	with open('{}{}.csv'.format(dir,file),'r',encoding='utf8') as f:
		l = f.readlines()
	with open('{}r{}.csv'.format(dir,file),'w',encoding='utf8') as f:
		for i in range(len(l)):
			if i>0:
				l[i]=re.sub(r'[ ]+','',l[i])
		f.writelines(l)
	return 'r{}{}.csv'.format(dir,file)

def splitText(dir,file,fieldlist):
	"""
	人工打标签前的工作：把大文件转化为20行的小文件
	"""
	df = pd.read_csv('{}{}.csv'.format(dir,file),encoding='utf8')
	if not os.path.exists('{}{}'.format(dir,file)): 
		os.mkdir('{}{}'.format(dir,file))
	count = 0
	while count*20<df.shape[0]:
		df[fieldlist].iloc[count*20:(count*20+20),:].to_csv('{0}{1}\\{1}_{2}.csv'.format(dir,file,count),index=False,header=False,sep='\n')
		count += 1

def mergeCSV(corpus_dir):
	'''
	把小的语料文件合并为大的语料文件
	'''
	for s in os.listdir(corpus_dir):
		if s.endswith('.csv'):
			print(os.path.join(corpus_dir,s))
			with open(os.path.join(corpus_dir,s),'r',encoding='utf8') as f:
				l = f.readlines()
			with open(os.path.join(corpus_dir,'merged.csv'),'a',encoding='utf8') as f:
				f.writelines(l)

def buildCorpus(sourcepath, destpath):
	"""
	把标注文件转换为训练格式
	sourcepath：'d:\\github\\zh-NER-TF\\data_path\\original\\testright1.txt'
	:return 标注的词汇列表
	"""
	f=open(sourcepath,'r',encoding='utf8')
	l=f.readlines()
    #在每个标注后面加空格
	for i in range(len(l)):
		for k in tag2label.keys():
			l[i] = re.sub('/'+k,'/'+k+' ',l[i])
	f.close()
	g = []
	d = dict()
	for ll in [s.split() for s in l]:
		gg = []
		for s in ll:
			s = s.strip()
			i = s.rfind('/')
			flag = s[i+1:]
			beginFlag = 'O'
			endFlag = 'O'
			if flag != 'o' and (flag in tag2label):
				beginFlag = 'B-{}'.format(flag.upper())
				endFlag = 'I-{}'.format(flag.upper())
				word = s[:i]
				if flag not in d:
					d[flag] = []
				d[flag].append(word)  
			gg.append('{}\t{}\n'.format(s[0],beginFlag))
			for c in s[1:i]:
				gg.append('{}\t{}\n'.format(c,endFlag))
		g.append(gg)
		g.append('\n')

	with open(destpath, 'w', encoding='utf8') as f:
		for gg in g:
			for s in gg:
				f.write(s)
	return d
    
def readCorpus(corpus_path):
	"""
	read corpus and return the list of samples
	:param corpus_path:
	:return: data
	"""
	data = []
	with open(corpus_path, encoding='utf-8') as fr:
		lines = fr.readlines()
	sent_, tag_ = [], []
	for line in lines:
		if line != '\n':
			[char, label] = line.strip().split()
			sent_.append(char)
			tag_.append(label)
			if char == '。':#按句进行拆分
				data.append((sent_, tag_))
				sent_, tag_ = [], []                
		else:
			if sent_:
				data.append((sent_, tag_))
				sent_, tag_ = [], []

	return data

def buildVocab(vocab_path, corpus_path, min_count=1):
	"""
    为每个字编码
	:param vocab_path:
	:param corpus_path:
	:param min_count:
	:return:
	"""
	data = readCorpus(corpus_path)
	word2id = {}
	for sent_, tag_ in data:
		for word in sent_:
			if word.isdigit():
				word = '<NUM>'
			elif ('\u0041' <= word <='\u005a') or ('\u0061' <= word <='\u007a'):
				word = '<ENG>'
			if word not in word2id:
				word2id[word] = [len(word2id)+1, 1]
			else:
				word2id[word][1] += 1
	#删除低频字
	low_freq_words = []
	for word, [word_id, word_freq] in word2id.items():
		if word_freq < min_count and word != '<NUM>' and word != '<ENG>':
			low_freq_words.append(word)
	for word in low_freq_words:
		del word2id[word]
	#为每个字编码
	new_id = 1
	for word in word2id.keys():
		word2id[word] = new_id
		new_id += 1
	word2id['<UNK>'] = new_id
	word2id['<PAD>'] = 0

	print('words size: ',len(word2id))
	with open(vocab_path, 'wb') as fw:
		pickle.dump(word2id, fw)
	return word2id

def sentence2Id(sent, word2id):
	"""

	:param sent:
	:param word2id:
	:return:
	"""
	sentence_id = []
	for word in sent:
		if word.isdigit():
			word = '<NUM>'
		#判断word是不是english，注意这里只比较word的首字母是否在A-Z 或 a-z
		elif ('\u0041' <= word <= '\u005a') or ('\u0061' <= word <= '\u007a'):
			word = '<ENG>'
		if word not in word2id:
			word = '<UNK>'
		sentence_id.append(word2id[word])
	return sentence_id


def loadVocab(vocab_path):
	"""
    载入word编码
	:param vocab_path:
	:return:
	"""
	vocab_path = os.path.join(vocab_path)
	with open(vocab_path, 'rb') as fr:
		word2id = pickle.load(fr)
	print('vocab_size:', len(word2id))
	return word2id


if __name__=='__main__':
	dir = 'd:\\Desktop\\cndata\\'
	file = 'u_tb_yl_mz_medical_record'
	removeWhiteSpace(dir, file)
	splitText(dir,'r'+file,['ZS','ZZMS'])
	file = 'u_tb_cis_mzdzbl'
	removeWhiteSpace(dir, file)
	splitText(dir,'r'+file,['ZS','XBS','JWS','TGJC','FZJC'])
	file = 'u_tb_cis_leavehospital_summary'
	removeWhiteSpace(dir, file)
	splitText(dir,'r'+file,['RYZZTZ','JCHZ','TSJC'])