import numpy
import cv2
image = cv2.imread('dua.jpg')
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
cv2.imwrite('gray_image.png',gray_image)
cv2.imshow('gray_image',gray_image)
cv2.waitKey(0)
cv2.destroyAllWindows()