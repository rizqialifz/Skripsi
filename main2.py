import cv2
import numpy as np
from PIL import Image
import copy
from os import listdir
from os.path import isfile, join
import requests
from sendData import *

#mypath = ("C:/Users/user/Documents/Skripsi/direktori")
mypath = ("/mnt/c/Users/user/Documents/Skripsi/direktori")
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath,f)) ]
images = np.empty(len(onlyfiles),dtype =object)
gray_img = np.empty(len(onlyfiles),dtype=object)
for n in range (0, len(onlyfiles)):
    images[n] = cv2.imread(join(mypath, onlyfiles[n]))
    gray_img[n] = cv2.cvtColor(images[n],cv2.COLOR_BGR2GRAY)
    #cv2.imshow("gambar bak sampah", images[n])
    #gray image
    #sukses load image sekali banyak secara sequential

#Frame Difference
thresh = 70
maxValue = 255

kernel = np.ones((5,5),np.uint8)
img_th_arr = []

for n in range (1, len(onlyfiles)):
    #mendapatkan foreground image
    difference = cv2.subtract(gray_img[n],gray_img[n-1])

    #menghilangkan noise
    th, img_th = cv2.threshold(difference, 40, maxValue, cv2.THRESH_BINARY)
    
    img_th_arr.append(img_th)

#show and write hasil
for n in range (0, len(onlyfiles)-1):    
    #cv2.imshow("citra_difference.png",img_th_arr[n])
    citra_difference = img_th_arr[n]

#transformasi hasil
cv2.circle(citra_difference, (122, 77), 5, (0, 0, 255), 1) #kiri atas
cv2.circle(citra_difference, (472,72), 5, (0, 0, 255), 1) #kanan atas
cv2.circle(citra_difference, (165,252), 5, (0, 0, 255), 1) #kiri bawah
cv2.circle(citra_difference, (428,250), 5, (0, 0, 255), 1) #kanan bawah

pts1 = np.float32([[122, 77], [472,72], [165,252], [428,250]])
pts2 = np.float32([[0, 0], [600, 0], [0, 337], [600, 337]])
matrix = cv2.getPerspectiveTransform(pts1, pts2)
result = cv2.warpPerspective(citra_difference, matrix, (600, 337))
cv2.imwrite("/mnt/c/Users/user/Documents/Skripsi/hasil/img.png", result)
#cv2.imshow('Hasil transformasi', result)

#mapping pixel
img = Image.open('/mnt/c/Users/user/Documents/Skripsi/hasil/img.png')
pixels = img.load() # create the pixel map

#mencari binary 225 tertinggi
for j in range(img.size[1]):
    for i in range(img.size[0]):
        if pixels[i,j]==255:
            print("tinggi sampah adalah %d pixel" %(j))
            break
    else:
        continue
    break

#menampilkan garis batas tertinggi
cv2.line(result,(0,j),(600,j),(255,0,0),2)
tinggi = (337 - j) / 16
lebar = 600 / 16
panjang = 600 / 16
volume = (lebar * panjang)
print("tinggi sampah adalah %d cm" %(tinggi))
print ("volume bak sampah adalah %d cm3" %(volume))
#r = requests.post('http://172.29.155.126:3333/api/wastebin/data?vol=' + str(volume))
#cv2.imshow("batas garis", result)

level = 3
kirimData(volume, level)
cv2.waitKey(0)

#cv2.imshow("citra_difference",citra_difference[n])
#cv2.imwrite("hasil citra/img %d.png" %n , gray_img[n])
#for n in range (0, len(onlyfiles)-1):
	#print semua hasil di dalam array
    #cv2.imshow("citra_difference/img %d.png" %n, citra_difference[n])
    #print hanya array terakhir
    #cv2.imshow("citra_difference.png", citra_difference[n])
#cv2.imshow("hasil citra/img %d.png" %n, gray_img[n])
#cv2.imshow("image",dilasi[n])
