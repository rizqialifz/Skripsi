import cv2
from picamera import PiCamera, Color
from time import sleep
import datetime
import numpy as np
from PIL import Image
import copy
from os import listdir
from os.path import isfile, join
from sendData import *

camera = PiCamera()

camera.rotation=180
camera.resolution=(670,600)
camera.start_preview()
for i in range(2):
    
    camera.capture('/home/pi/Skripsi_Alif/direktori/%s.jpg' %(datetime.datetime.now()))
    
    mypath = ("/home/pi/Skripsi_Alif/direktori")
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
        difference = cv2.subtract(gray_img[n-1],gray_img[n])

        #menghilangkan noise
        th, img_th = cv2.threshold(difference, 40, maxValue, cv2.THRESH_BINARY)
        
        img_th_arr.append(img_th)

    #show and write hasil
    for n in range (0, len(onlyfiles)-1):    
        #cv2.imshow("citra_difference.png",img_th_arr[n])
        citra_difference = img_th_arr[n]

    #transformasi hasil
    cv2.circle(citra_difference, (50,190), 5, (0, 0, 255), 1) #kiri atas
    cv2.circle(citra_difference, (659,187), 5, (0, 0, 255), 1) #kanan atas
    cv2.circle(citra_difference, (95,592), 5, (0, 0, 255), 1) #kiri bawah
    cv2.circle(citra_difference, (603,585), 5, (0, 0, 255), 1) #kanan bawah

    pts1 = np.float32([[50,190], [659,187], [95,592], [603,585]])
    pts2 = np.float32([[0, 0], [670, 0], [0, 600], [670, 600]])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    result = cv2.warpPerspective(citra_difference, matrix, (670, 600))
    cv2.imwrite("/home/pi/Skripsi_Alif/hasil/img.png", result)
    #cv2.imshow('Hasil transformasi', result)

    #mapping pixel
    img = Image.open('/home/pi/Skripsi_Alif/hasil/img.png')
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

    title = str()
    message = str()
    deviceid = str()

    #menampilkan garis batas tertinggi
    cv2.line(result,(0,j),(670,j),(255,0,0),2)
    tinggi = (600 - j) / 28.6
    lebar = 670 / 24.8
    panjang = 30
    volume = (tinggi * lebar * panjang)
    #if volume>1000:
    #    sendNotif(title, message, deviceid)

    print("tinggi sampah adalah %d cm" %(tinggi))
    print ("volume bak sampah adalah %.2f m3" %(volume))
    print(" ")
    #r = requests.post('http://172.29.155.126:3333/api/wastebin/data?vol=' + str(volume))
    #cv2.imshow("batas garis", result)
    #level = 3
    #kirimData(volume, level)
    sleep(10)
camera.stop_preview()
#cv2.waitKey(0)
