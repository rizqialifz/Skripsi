import cv2
import numpy as np
import copy
import argparse
from os import listdir
from os.path import isfile, join
from picamera import PiCamera, Color
from time import sleep
import datetime as dt


camera = PiCamera()

camera.rotation=180
camera.start_preview()

#Menaruh caption tanggal dan waktu pada gambar
camera.annotate_background = Color('black')
camera.annotate_foreground = Color('white')
camera.annotate_text = dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

#Menyimpan hasil capture
For in range(2):
	sleep(10)
	camera.capture('/home/pi/image%s.jpg' % i)
camera.stop_preview()

##############################################

#Membaca gambar
imageA = cv2.imread('image1.jpg')
imageB = cv2.imread('image2.jpg')

#Mengubah gambar menjadi gray scale
grayA = cv2.cvtColor(imageA, cv2.COLOR_BGR2GRAY)
grayB = cv2.cvtColor(imageB, cv2.COLOR_BGR2GRAY)

#Frame Difference
    
thresh = 70
maxValue = 255

#mendapatkan foreground image
difference = cv2.subtract(grayA,grayB)

#menghilangkan noise
th, img_th = cv2.threshold(difference, 40, maxValue, cv2.THRESH_BINARY)
#mendapatkan pinggiran objek
edges = cv2.Canny(img_th,100,200)
#dilasi, mempertebal pinggiran objek
kernel = np.ones((3,5),np.uint8)
dilasi = cv2.dilate(edges, kernel, iterations = 1)
    
cv2.imshow("Diff", img_th)
cv2.imshow("Thresh", dilasi)
cv2.waitKey(0)
