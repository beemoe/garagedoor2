import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)

pins = [2,3,4,14,27,22,10,9,11,0,5,6,13,19,26,17]

for pin in pins:
    GPIO.setup(pin, GPIO.IN)


#18,23,24 - reeds
#GPIO.setup(2, GPIO.IN)
#GPIO.setup(3, GPIO.IN)
#GPIO.setup(4, GPIO.IN)
#GPIO.setup(17, GPIO.IN)
#GPIO.setup(27, GPIO.IN)
#GPIO.setup(22, GPIO.IN)
#GPIO.setup(10, GPIO.IN)
#GPIO.setup(9, GPIO.IN)
#GPIO.setup(11, GPIO.IN)

#GPIO.setup(0, GPIO.IN)
#GPIO.setup(5, GPIO.IN)
#GPIO.setup(6, GPIO.IN)
#GPIO.setup(13, GPIO.IN)
#GPIO.setup(19, GPIO.IN)
#GPIO.setup(26, GPIO.IN)

def pin_changed(channel):
    pinValue = GPIO.input(channel)
    print "Channel ", channel,  " Value ", pinValue

for pin in pins: 
    GPIO.add_event_detect(pin, GPIO.BOTH, callback=pin_changed, bouncetime=100)

#GPIO.add_event_detect(23, GPIO.BOTH, callback=pin_changed, bouncetime=100)
#GPIO.add_event_detect(24, GPIO.BOTH, callback=pin_changed, bouncetime=100)

try:
    raw_input("Running...")
except KeyboardInterrupt:  
    GPIO.cleanup()       # clean up GPIO on CTRL+C exit  
GPIO.cleanup()           # clean up GPIO on normal exit 