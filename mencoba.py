import cv2
import imutils
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
camera.resolution = (200,200)
camera.start_preview()
#Menaruh caption tanggal dan waktu pada gambar
camera.annotate_background = Color('black')
camera.annotate_foreground = Color('white')
camera.annotate_text = dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
sleep(5)

#Menyimpan hasil capture
#camera.capture('/home/pi/image.jpg')

imageB = camera.capture('/home/pi/Skripsi_Alif/image2.jpg')
camera.stop_preview()

#Membaca gambar
imageA = cv2.imread('image1.jpg')


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
#edges = cv2.Canny(img_th,100,200)
#dilasi, mempertebal pinggiran objek
#kernel = np.ones((3,5),np.uint8)
#dilasi = cv2.dilate(edges, kernel, iterations = 1)
    
cv2.imshow("Diff", img_th)
#cv2.imshow("Thresh", dilasi)

#Transformasi, menggambar area yg ingin ditransformasi
#cv2.circle(img_th, (110,140), 5, (0, 0, 255), -1)
#cv2.circle(img_th, (390,142), 5, (0, 0, 255), -1)
#cv2.circle(img_th, (59,503), 5, (0, 0, 255), -1)
#cv2.circle(img_th, (440,509), 5, (0, 0, 255), -1)

#transfomrasi
#pts1 = np.float32([[110, 140], [390, 142], [59, 503], [440, 509]])
#pts2 = np.float32([[0, 0], [500, 0], [0, 600], [500, 600]])
#matrix = cv2.getPerspectiveTransform(pts1, pts2)

result = cv2.warpPerspective(imageA, matrix, (500, 600))
#cv2.imshow("Frame", imageA)
#cv2.imshow("Perspective transformation", result)
#cv2.imwrite("hasil transform.jpg", result)
cv2.imwrite("Diff", img_th)


cv2.waitKey(0)
