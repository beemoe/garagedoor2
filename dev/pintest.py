import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)

#18,23,24 - reeds
GPIO.setup(18, GPIO.IN)
GPIO.setup(23, GPIO.IN)
GPIO.setup(24, GPIO.IN)

#17,27,22 - relays
GPIO.setup(17, GPIO.OUT)
GPIO.setup(27, GPIO.OUT)
GPIO.setup(22, GPIO.OUT)

#INIT HIGH to unfuck relay
GPIO.output(17, GPIO.HIGH)
GPIO.output(27, GPIO.HIGH)
GPIO.output(22, GPIO.HIGH)


def pin_changed(channel):
    pinValue = GPIO.input(channel)
    print "Channel ", channel,  " Value ", pinValue

    if(channel == 18):
        GPIO.output(17, logicConvert(pinValue))

    if(channel == 23):
        GPIO.output(27, logicConvert(pinValue))
    
    if(channel == 24):
        GPIO.output(22, logicConvert(pinValue))

def logicConvert(pinValue):
    if(pinValue == 0):
        print pinValue, " OFF"
        return GPIO.HIGH

    print pinValue, " ON"
    return GPIO.LOW
    
GPIO.add_event_detect(18, GPIO.BOTH, callback=pin_changed, bouncetime=100)
GPIO.add_event_detect(23, GPIO.BOTH, callback=pin_changed, bouncetime=100)
GPIO.add_event_detect(24, GPIO.BOTH, callback=pin_changed, bouncetime=100)

try:

    print "Startup Values: 17,27,22 ", GPIO.input(17), GPIO.input(27), GPIO.input(22)
    print "Test all the things!"
    raw_input("Running...")
except KeyboardInterrupt:  
    GPIO.cleanup()       # clean up GPIO on CTRL+C exit  
GPIO.cleanup()           # clean up GPIO on normal exit 