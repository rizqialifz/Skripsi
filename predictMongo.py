
# coding: utf-8

# In[1]:

from pymongo import MongoClient
import pandas as pd
client = MongoClient()


# In[2]:

db = client['keystone-demo']


# In[3]:

collection = db.datasets


# In[4]:

import pprint
from bson.objectid import ObjectId
#pprint.pprint(collection.find({"sensornode": ObjectId("590e00f72476bf2dbca3e394")}))


# In[5]:

dat = []
creat = []
data = collection.find({"sensornode": ObjectId("590e00f72476bf2dbca3e394")})
data1 = list(data)
for i in range(len(data1)):
    dat.append(data1[i]["data"]["temperature"])

for j in range(len(data1)):
    creat.append(data1[j]["created_at"].isoformat())


# In[6]:

df2 = pd.DataFrame({"created_at":creat, "humidity":dat})


# In[7]:

series = df2.set_index("created_at")
ts = series
ts["humidity"] = ts["humidity"].astype("float")


# In[8]:

from statsmodels.tsa.arima_model import ARIMA


# In[9]:

model = ARIMA(ts, order=(1, 0, 0)) 
results_AR = model.fit(disp=-1)


# In[10]:

#make prediction 5 values ahead
pred = results_AR.predict((ts.shape[0]-1), (ts.shape[0]+9), dynamic=True)
predValue = list(pred)


# In[11]:

print(predValue)

