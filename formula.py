import cv2
import numpy as np
import copy
from os import listdir
from os.path import isfile, join
from matplotlib import pyplot as plt

imageA = cv2.imread('alam.jpg')
imageB = cv2.imread('alamren.jpg')

gray_imgA = cv2.cvtColor(imageA,cv2.COLOR_BGR2GRAY)
gray_imgB = cv2.cvtColor(imageB,cv2.COLOR_BGR2GRAY)

#Frame Difference
#thresh = 70
maxValue = 255
kernel = np.ones((5,5),np.uint8)

difference = cv2.subtract(gray_imgA,gray_imgB)

#menghilangkan noise
th, img_th = cv2.threshold(difference, 40, maxValue, cv2.THRESH_BINARY)
points = np.argwhere(img_th==255)
points = np.fliplr(points)
x, y, w, h = cv2.boundingRect(points)
x, y, w, h = x-10, y-10, w+20, h+20
crop = difference[y:y+h, x:x+w]
#retval, thresh_crop = cv2.threshold(crop, thresh=200, maxval=255, type=cv2.THRESH_BINARY)
#mendapatkan pinggiran objek

#cv2.imshow("citra_difference.png",crop)
cv2.waitKey(0)