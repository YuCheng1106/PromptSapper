# -*- coding: utf-8 -*-
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import re
import pickle
def getPromptParams(prompt_template):
    paraNames = []
    if re.search(r"{{\w+}}", prompt_template):
        paraNames = re.findall(r"{{.*}}", prompt_template)
        for i in range(len(paraNames)):
            paraNames[i] = paraNames[i][2:-2]
    return paraNames
def search_by_keyword(inputs, query):
    # 加载预训练的 BERT 模型
    model = SentenceTransformer('distilbert-base-nli-stsb-mean-tokens')
    # 打开prompt仓库
    df = pd.read_csv("prompt_repository/prompt_repository.csv")
    keywords = df["keywords"].tolist()

    # 使用 BERT 模型将关键字向量化，这步耗时较长，所以将向量保存到磁盘上
    # keyword_embeddings = model.encode(keywords)
    # 加载已保存的嵌入向量，可以节约时间
    with open('prompt_repository/keyword_embeddings.pickle', 'rb') as f:
        keyword_embeddings = pickle.load(f)

    # 向量化查询关键字
    query_embedding = model.encode([query])[0]
    # 计算每个关键字和查询关键字之间的余弦相似度
    similarity_scores = cosine_similarity(query_embedding.reshape(1, -1), keyword_embeddings)[0]
    # 降序排序相似度分数
    sorted_scores = similarity_scores.argsort()[::-1]
    # 可能有重复的关键词，所以用字典记录每个关键词出现的次数
    # occurrence = {}
    # 输出前10个分数及对应的原始文本数据和关键字

    j = 0
    for score in sorted_scores:
        keyword = keywords[score]
        prompt = df.loc[df['keywords'] == keyword, 'prompt_content'].values[0]
        j += 1
        if j>20:
            break
        promptinput = getPromptParams(prompt)
        if len(promptinput) == len(inputs):
            for i in range(len(inputs)):
                prompt = prompt.replace("{{" + promptinput[i] +"}}", "{{" + inputs[i] +"}}")
                return prompt
    # 返回分数最高的prompt_content
    return ""

# print(search_by_keyword(["sd"],"javascript"))

