import cv2
import numpy as np
import copy
from os import listdir
from os.path import isfile, join
from picamera import PiCamera, Color
from time import sleep
import datetime as dt


camera = PiCamera()

camera.rotation=180
camera.resolution = (600,600)
camera.start_preview()
#Menaruh caption tanggal dan waktu pada gambar
camera.annotate_background = Color('black')
camera.annotate_foreground = Color('white')
camera.annotate_text = dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

camera.start_preview()
for i in range(2):
    sleep(3)
    #Menyimpan hasil capture
    camera.capture('/home/pi/Skripsi_Alif/photos/image%s.jpg' % i)
camera.stop_preview()

mypath = ("/home/pi/Skripsi_Alif/photos")
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath,f)) ]
images = np.empty(len(onlyfiles),dtype =object)
gray_img = np.empty(len(onlyfiles),dtype=object)
for n in range (0, len(onlyfiles)):
    images[n] = cv2.imread(join(mypath, onlyfiles[n]))
    gray_img[n] = cv2.cvtColor(images[n],cv2.COLOR_BGR2GRAY)
    #gray image
    #sukses load image sekali banyak secara sequential

#Frame Difference
thresh = 70
maxValue = 255

kernel = np.ones((5,5),np.uint8)
citra_difference = []

for n in range (1, len(onlyfiles)):
    #mendapatkan foreground image
    difference = cv2.subtract(gray_img[n-1],gray_img[n])

    #menghilangkan noise
    th, img_th = cv2.threshold(difference, 40, maxValue, cv2.THRESH_BINARY)
    #mendapatkan pinggiran objek
    edges = cv2.Canny(img_th,100,200)
    #dilasi, mempertebal pinggiran objek
    #kernel = np.ones((3,5),np.uint8)
    #dilasi = cv2.dilate(edges, kernel, iterations = 1)
    
    citra_difference.append(img_th)

for n in range (0, len(onlyfiles)-1):
    imageA = images[n]
    cv2.circle(imageA, (110,140), 5, (0, 0, 255), -1)
    cv2.circle(imageA, (390,142), 5, (0, 0, 255), -1)
    cv2.circle(imageA, (59,503), 5, (0, 0, 255), -1)
    cv2.circle(imageA, (440,509), 5, (0, 0, 255), -1)

    pts1 = np.float32([[110, 140], [390, 142], [59, 503], [440, 509]])
    pts2 = np.float32([[0, 0], [600, 0], [0, 600], [600, 600]])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)

    result = cv2.warpPerspective(imageA, matrix, (600, 600))
    cv2.imshow("Frame", imageA)
    cv2.imshow("Perspective transformation", result)
    cv2.imwrite("hasil transform.jpg", result)

    
#cv2.imshow("citra_difference",citra_difference[n])
#cv2.imwrite("hasil citra/img %d.png" %n , gray_img[n])
#for n in range (0, len(onlyfiles)-1):
	#print semua hasil di dalam array
    #cv2.imshow("citra_difference/img %d.png" %n, citra_difference[n])
    #print hanya array terakhir
    #cv2.imshow("citra_difference.png", citra_difference[n])
#cv2.imshow("hasil citra/img %d.png" %n, gray_img[n])
#cv2.imshow("image",dilasi[n])
cv2.waitKey(0)
