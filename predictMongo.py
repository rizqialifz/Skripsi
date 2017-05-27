
# coding: utf-8

# In[1]:

from pymongo import MongoClient
from bson.objectid import ObjectId
from pandas import DataFrame
import sys


# In[2]:

lines = sys.stdin.read().splitlines()
lines = lines[0]


# In[ ]:

client = MongoClient()
collection = client['keystone-demo'].datasets
data = collection.find({"sensornode": ObjectId(lines)})


# In[ ]:

dat = []
creat = []

data1 = list(data)
for i in range(len(data1)):
    dat.append(data1[i]["data"]["temperature"])
    creat.append(data1[i]["created_at"].isoformat())


# In[ ]:

df2 = DataFrame({"created_at":creat, "humidity":dat})


# In[ ]:

series = df2.set_index("created_at")
ts = series
ts["humidity"] = ts["humidity"].astype("float")


# In[ ]:

from statsmodels.tsa.arima_model import ARIMA
model = ARIMA(ts, order=(1, 0, 0)) 
results_AR = model.fit(disp=-1)

#make prediction 5 values ahead
pred = results_AR.predict((ts.shape[0]-1), (ts.shape[0]+9), dynamic=True)
predValue = list(pred)


# In[ ]:

lah = ','.join(map(str,predValue))
print lah

