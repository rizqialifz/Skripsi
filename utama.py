from picamera import PiCamera
from time import sleep
import datetime

camera = PiCamera()
camera.resolution = (337,600)
camera.start_preview()
for i in range (10):
	camera.capture('')
	execfile("pcd.py")
	sleep(2)
