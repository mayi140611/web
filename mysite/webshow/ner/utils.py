import logging, sys, argparse


def str2bool(v):
    # copy from StackOverflow
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')


def get_entity(tag_seq, char_seq):
    ZS = get_ZS_entity(tag_seq, char_seq)
#     PER = get_PER_entity(tag_seq, char_seq)
#     LOC = get_LOC_entity(tag_seq, char_seq)
#     ORG = get_ORG_entity(tag_seq, char_seq)
    return ZS
def get_entitys(flaglist, tag_seq, char_seq):
    dict1 = dict()
    for flag in flaglist:
        dict1[flag] = get_x_entity(flag,tag_seq,char_seq)
    return dict1
def get_x_entity(flag,tag_seq,char_seq):
    beginFlag = 'B-{}'.format(flag.upper())
    endFlag = 'I-{}'.format(flag.upper())
    length = len(char_seq)
    X = []
    m = 0
    word = ''
    for i, (char, tag) in enumerate(zip(char_seq, tag_seq)):
        if m == 0:
            if tag == beginFlag:
    #             if '{}'.format(flag) in locals().keys():
    #                 X.append(flag)
    #                 del flag
    #             flag = char
    #             if i+1 == length:
                word += char
                m = 1
        elif m == 1:
            if tag == endFlag:
                word += char
            else:
                if word:
                    X.append(word)
                word = ''
                m = 0
                if tag == beginFlag:
                    word += char
                    m = 1
    if word:
        X.append(word)
    return X
    

def get_ZS_entity(tag_seq, char_seq):
    length = len(char_seq)
    ZS = []
    for i, (char, tag) in enumerate(zip(char_seq, tag_seq)):
        if tag == 'B-ZS':
            if 'zs' in locals().keys():
                ZS.append(zs)
                del zs
            zs = char
            if i+1 == length:
                ZS.append(zs)
        if tag == 'I-ZS':
            if 'zs' in vars():
                zs += char
                if i+1 == length:
                    ZS.append(zs)
        if tag not in ['I-ZS', 'B-ZS']:
            if 'zs' in locals().keys():
                ZS.append(zs)
                del zs
            continue
    return ZS

def get_PER_entity(tag_seq, char_seq):
    length = len(char_seq)
    PER = []
    for i, (char, tag) in enumerate(zip(char_seq, tag_seq)):
        if tag == 'B-PER':
            if 'per' in locals().keys():
                PER.append(per)
                del per
            per = char
            if i+1 == length:
                PER.append(per)
        if tag == 'I-PER':
            per += char
            if i+1 == length:
                PER.append(per)
        if tag not in ['I-PER', 'B-PER']:
            if 'per' in locals().keys():
                PER.append(per)
                del per
            continue
    return PER


def get_LOC_entity(tag_seq, char_seq):
    length = len(char_seq)
    LOC = []
    for i, (char, tag) in enumerate(zip(char_seq, tag_seq)):
        if tag == 'B-LOC':
            if 'loc' in locals().keys():
                LOC.append(loc)
                del loc
            loc = char
            if i+1 == length:
                LOC.append(loc)
        if tag == 'I-LOC':
            loc += char
            if i+1 == length:
                LOC.append(loc)
        if tag not in ['I-LOC', 'B-LOC']:
            if 'loc' in locals().keys():
                LOC.append(loc)
                del loc
            continue
    return LOC


def get_ORG_entity(tag_seq, char_seq):
    length = len(char_seq)
    ORG = []
    for i, (char, tag) in enumerate(zip(char_seq, tag_seq)):
        if tag == 'B-ORG':
            if 'org' in locals().keys():
                ORG.append(org)
                del org
            org = char
            if i+1 == length:
                ORG.append(org)
        if tag == 'I-ORG':
            org += char
            if i+1 == length:
                ORG.append(org)
        if tag not in ['I-ORG', 'B-ORG']:
            if 'org' in locals().keys():
                ORG.append(org)
                del org
            continue
    return ORG


def get_logger(filename):
    logger = logging.getLogger('logger')
    logger.setLevel(logging.DEBUG)
    logging.basicConfig(format='%(message)s', level=logging.DEBUG)
    handler = logging.FileHandler(filename)
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s: %(message)s'))
    logging.getLogger().addHandler(handler)
    return logger
