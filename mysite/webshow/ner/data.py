import sys, pickle, os, random
import numpy as np
import webshow.ner.datapreprocessing as dp

# l = []
# l.append('{}'.format('O'))
# for k in dp.tag2label.keys():
#     if k != 'o':
#         l.append('B-{}'.format(k.upper()))
#         l.append('I-{}'.format(k.upper()))
        
# tag2label = dict(zip(l,range(len(l))))        
# ## tags, BIO
# tag2label = {"O": 0,
#              "B-PER": 1, "I-PER": 2,
#              "B-LOC": 3, "I-LOC": 4,
#              "B-ORG": 5, "I-ORG": 6
#              }
tag2label = {'B-1B': 1,
 'B-1JC': 3,
 'B-1JX': 5,
 'B-1M': 7,
 'B-1O': 9,
 'B-1QT': 11,
 'B-1S': 13,
 'B-1T': 15,
 'B-1W': 17,
 'B-1X': 19,
 'B-1YC': 21,
 'B-1YW': 23,
 'B-1ZL': 25,
 'B-1ZS': 27,
 'B-2B': 29,
 'B-2JC': 31,
 'B-2JX': 33,
 'B-2M': 35,
 'B-2O': 37,
 'B-2QT': 39,
 'B-2S': 41,
 'B-2T': 43,
 'B-2W': 45,
 'B-2X': 47,
 'B-2YC': 49,
 'B-2YW': 51,
 'B-2ZL': 53,
 'B-2ZS': 55,
 'B-3B': 57,
 'B-3JC': 59,
 'B-3JX': 61,
 'B-3M': 63,
 'B-3O': 65,
 'B-3QT': 67,
 'B-3S': 69,
 'B-3T': 71,
 'B-3W': 73,
 'B-3X': 75,
 'B-3YC': 77,
 'B-3YW': 79,
 'B-3ZL': 81,
 'B-3ZS': 83,
 'B-4B': 85,
 'B-4JC': 87,
 'B-4JX': 89,
 'B-4M': 91,
 'B-4O': 93,
 'B-4QT': 95,
 'B-4S': 97,
 'B-4T': 99,
 'B-4W': 101,
 'B-4X': 103,
 'B-4YC': 105,
 'B-4YW': 107,
 'B-4ZL': 109,
 'B-4ZS': 111,
 'B-5B': 113,
 'B-5JC': 115,
 'B-5JX': 117,
 'B-5M': 119,
 'B-5O': 121,
 'B-5QT': 123,
 'B-5S': 125,
 'B-5T': 127,
 'B-5W': 129,
 'B-5X': 131,
 'B-5YC': 133,
 'B-5YW': 135,
 'B-5ZL': 137,
 'B-5ZS': 139,
 'B-6B': 141,
 'B-6JC': 143,
 'B-6JX': 145,
 'B-6M': 147,
 'B-6O': 149,
 'B-6QT': 151,
 'B-6S': 153,
 'B-6T': 155,
 'B-6W': 157,
 'B-6X': 159,
 'B-6YC': 161,
 'B-6YW': 163,
 'B-6ZL': 165,
 'B-6ZS': 167,
 'B-7B': 169,
 'B-7JC': 171,
 'B-7JX': 173,
 'B-7M': 175,
 'B-7O': 177,
 'B-7QT': 179,
 'B-7S': 181,
 'B-7T': 183,
 'B-7W': 185,
 'B-7X': 187,
 'B-7YC': 189,
 'B-7YW': 191,
 'B-7ZL': 193,
 'B-7ZS': 195,
 'B-B': 197,
 'B-JC': 199,
 'B-JX': 201,
 'B-M': 203,
 'B-QT': 205,
 'B-S': 207,
 'B-T': 209,
 'B-W': 211,
 'B-X': 213,
 'B-YC': 215,
 'B-YW': 217,
 'B-ZL': 219,
 'B-ZS': 221,
 'I-1B': 2,
 'I-1JC': 4,
 'I-1JX': 6,
 'I-1M': 8,
 'I-1O': 10,
 'I-1QT': 12,
 'I-1S': 14,
 'I-1T': 16,
 'I-1W': 18,
 'I-1X': 20,
 'I-1YC': 22,
 'I-1YW': 24,
 'I-1ZL': 26,
 'I-1ZS': 28,
 'I-2B': 30,
 'I-2JC': 32,
 'I-2JX': 34,
 'I-2M': 36,
 'I-2O': 38,
 'I-2QT': 40,
 'I-2S': 42,
 'I-2T': 44,
 'I-2W': 46,
 'I-2X': 48,
 'I-2YC': 50,
 'I-2YW': 52,
 'I-2ZL': 54,
 'I-2ZS': 56,
 'I-3B': 58,
 'I-3JC': 60,
 'I-3JX': 62,
 'I-3M': 64,
 'I-3O': 66,
 'I-3QT': 68,
 'I-3S': 70,
 'I-3T': 72,
 'I-3W': 74,
 'I-3X': 76,
 'I-3YC': 78,
 'I-3YW': 80,
 'I-3ZL': 82,
 'I-3ZS': 84,
 'I-4B': 86,
 'I-4JC': 88,
 'I-4JX': 90,
 'I-4M': 92,
 'I-4O': 94,
 'I-4QT': 96,
 'I-4S': 98,
 'I-4T': 100,
 'I-4W': 102,
 'I-4X': 104,
 'I-4YC': 106,
 'I-4YW': 108,
 'I-4ZL': 110,
 'I-4ZS': 112,
 'I-5B': 114,
 'I-5JC': 116,
 'I-5JX': 118,
 'I-5M': 120,
 'I-5O': 122,
 'I-5QT': 124,
 'I-5S': 126,
 'I-5T': 128,
 'I-5W': 130,
 'I-5X': 132,
 'I-5YC': 134,
 'I-5YW': 136,
 'I-5ZL': 138,
 'I-5ZS': 140,
 'I-6B': 142,
 'I-6JC': 144,
 'I-6JX': 146,
 'I-6M': 148,
 'I-6O': 150,
 'I-6QT': 152,
 'I-6S': 154,
 'I-6T': 156,
 'I-6W': 158,
 'I-6X': 160,
 'I-6YC': 162,
 'I-6YW': 164,
 'I-6ZL': 166,
 'I-6ZS': 168,
 'I-7B': 170,
 'I-7JC': 172,
 'I-7JX': 174,
 'I-7M': 176,
 'I-7O': 178,
 'I-7QT': 180,
 'I-7S': 182,
 'I-7T': 184,
 'I-7W': 186,
 'I-7X': 188,
 'I-7YC': 190,
 'I-7YW': 192,
 'I-7ZL': 194,
 'I-7ZS': 196,
 'I-B': 198,
 'I-JC': 200,
 'I-JX': 202,
 'I-M': 204,
 'I-QT': 206,
 'I-S': 208,
 'I-T': 210,
 'I-W': 212,
 'I-X': 214,
 'I-YC': 216,
 'I-YW': 218,
 'I-ZL': 220,
 'I-ZS': 222,
 'O': 0}

def read_corpus(corpus_path):
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
        else:
            data.append((sent_, tag_))
            sent_, tag_ = [], []

    return data


def vocab_build(vocab_path, corpus_path, min_count):
    """

    :param vocab_path:
    :param corpus_path:
    :param min_count:
    :return:
    """
    data = read_corpus(corpus_path)
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

    print(len(word2id))
    with open(vocab_path, 'wb') as fw:
        pickle.dump(word2id, fw)


def sentence2id(sent, word2id):
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


def read_dictionary(vocab_path):
    """

    :param vocab_path:
    :return:
    """
    vocab_path = os.path.join(vocab_path)
    with open(vocab_path, 'rb') as fr:
        word2id = pickle.load(fr)
    print('vocab_size:', len(word2id))
    return word2id


def random_embedding(vocab, embedding_dim):
    """

    :param vocab:
    :param embedding_dim:
    :return:
    """
    embedding_mat = np.random.uniform(-0.25, 0.25, (len(vocab), embedding_dim))
    embedding_mat = np.float32(embedding_mat)
    return embedding_mat


def pad_sequences(sequences, pad_mark=0):
    """

    :param sequences:
    :param pad_mark:
    :return:
    """
    max_len = max(map(lambda x : len(x), sequences))
    seq_list, seq_len_list = [], []
    for seq in sequences:
        seq = list(seq)
        seq_ = seq[:max_len] + [pad_mark] * max(max_len - len(seq), 0)
        seq_list.append(seq_)
        seq_len_list.append(min(len(seq), max_len))
    return seq_list, seq_len_list


def batch_yield(data, batch_size, vocab, tag2label, shuffle=False):
    """

    :param data:
    :param batch_size:
    :param vocab:
    :param tag2label:
    :param shuffle:
    :return:
    """
    if shuffle:
        random.shuffle(data)

    seqs, labels = [], []
    for (sent_, tag_) in data:
        sent_ = sentence2id(sent_, vocab)
        label_ = [tag2label[tag] for tag in tag_]

        if len(seqs) == batch_size:
            yield seqs, labels
            seqs, labels = [], []

        seqs.append(sent_)
        labels.append(label_)

    if len(seqs) != 0:
        yield seqs, labels

