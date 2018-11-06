import os
import time

current_time = time.time()
mypath = r"C:/Users/user/Documents/Skripsi/direktori"
now= time.time()


for f in os.listdir(mypath):

 f = os.path.join(mypath, f)
 if os.stat(f).st_mtime > now - 7 * 86400

  if os.path.isfile(f):

   os.remove(os.path.join(mypath, f))
