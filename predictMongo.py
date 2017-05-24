
# coding: utf-8

# In[1]:

from pymongo import MongoClient
from flask import Flask,jsonify,json,request
from bson.objectid import ObjectId
import pandas as pd
client = MongoClient()


# In[2]:

db = client['keystone-demo']
collection = db.datasets
data = collection.find({"sensornode": ObjectId("590e00f72476bf2dbca3e394")})


# In[3]:

dat = []
creat = []

data1 = list(data)
for i in range(len(data1)):
    dat.append(data1[i]["data"]["temperature"])

for j in range(len(data1)):
    creat.append(data1[j]["created_at"].isoformat())


# In[4]:

df2 = pd.DataFrame({"created_at":creat, "humidity":dat})


# In[5]:

series = df2.set_index("created_at")
ts = series
ts["humidity"] = ts["humidity"].astype("float")


# In[6]:

from statsmodels.tsa.arima_model import ARIMA
model = ARIMA(ts, order=(1, 0, 0)) 
results_AR = model.fit(disp=-1)

#make prediction 5 values ahead
pred = results_AR.predict((ts.shape[0]-1), (ts.shape[0]+9), dynamic=True)
predValue = list(pred)


# In[7]:

'''
for i in predValue:
    print i,
'''


# In[8]:

lah = ','.join(map(str,predValue))
print lah

