import cv2
import numpy as np
from PIL import Image
import copy
from os import listdir
from os.path import isfile, join
from sendData import *

imageA = cv2.imread('C:/Users/user/Documents/SKRIPSI/direktori/image0.jpg')
imageB = cv2.imread('C:/Users/user/Documents/SKRIPSI/direktori/image1.jpg')

gray_imgA = cv2.cvtColor(imageA,cv2.COLOR_BGR2GRAY)
gray_imgB = cv2.cvtColor(imageB,cv2.COLOR_BGR2GRAY)

thresh = 70
maxValue = 255

difference = cv2.subtract(gray_imgB,gray_imgA)
th, img_th = cv2.threshold(difference, 40, maxValue, cv2.THRESH_BINARY)
cv2.imshow("difference", img_th)

cv2.circle(img_th, (50,195), 5, (0, 0, 255), 1) #kiri atas
cv2.circle(img_th, (659,190), 5, (0, 0, 255), 1) #kanan atas
cv2.circle(img_th, (95,592), 5, (0, 0, 255), 1) #kiri bawah
cv2.circle(img_th, (603,585), 5, (0, 0, 255), 1) #kanan bawah

pts1 = np.float32([[50,195], [659,190], [95,592], [603,585]])
pts2 = np.float32([[0, 0], [670, 0], [0, 600], [670, 600]])
matrix = cv2.getPerspectiveTransform(pts1, pts2)
result = cv2.warpPerspective(img_th, matrix, (670, 600))
cv2.imshow('Hasil transformasi', result)
#python fix.py
cv2.imwrite("C:/Users/user/Documents/Skripsi/hasil/img.png", result)

img = Image.open('C:/Users/user/Documents/Skripsi/hasil/img.png')
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

cv2.line(result,(0,j),(670,j),(255,0,0),2)
cv2.imshow("batas garis", result)
title = str()
message = str()
deviceid = str()
#level = str()

tinggi = (600 - j) / 28.16
lebar = 670 / 24
panjang = 30
volume = (tinggi * lebar * panjang)

if volume <= 3400:
	level = 1
elif volume <= 6800:
	level = 2
elif volume <= 10200:
	level = 3
elif volume <= 13600:
	level = 4
else:
	level = 5


print("Level sampah saat ini adalah %s" %level)
#if level > 3:
#    sendNotif(title, message, deviceid)

print("tinggi sampah adalah %d cm" %(tinggi))
print ("volume bak sampah adalah %.2f cm3" %(volume))
#kirimData(volume, level)
cv2.waitKey(0)