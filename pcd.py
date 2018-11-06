import cv2
import numpy as np
from PIL import Image
from picamera import PiCamera
from time import sleep
import datetime
from os import listdir
from os.path import isfile, join
import requests
from sendData import *

camera = PiCamera()
camera.resolution = (337,600)
camera.start_preview()

for i in range (10):
    camera.capture('')

    mypath = ("C:/Users/user/Documents/Skripsi/direktori")
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath,f)) ]
    images = np.empty(len(onlyfiles),dtype =object)
    gray_img = np.empty(len(onlyfiles),dtype=object)
    for n in range (0, len(onlyfiles)):
        images[n] = cv2.imread(join(mypath, onlyfiles[n]))
        gray_img[n] = cv2.cvtColor(images[n],cv2.COLOR_BGR2GRAY)

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
    cv2.imwrite("C:/Users/user/Documents/Skripsi/hasil/img.png", result)

    #mapping pixel
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

    #menampilkan garis batas tertinggi
    cv2.line(result,(0,j),(600,j),(255,0,0),2)
    tinggi = (337 - j) / 16
    lebar = 600 / 16
    panjang = 600 / 16
    volume = (tinggi * lebar * panjang) / 1000000
    print("tinggi sampah adalah %d cm" %(tinggi))
    print ("volume bak sampah adalah %.2f m3" %(volume))

    level = 5
    print("level volume bak sampah adalah %d" %(level))
    #kirimData(volume, level)
    cv2.waitKey(0)