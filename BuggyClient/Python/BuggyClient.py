import RPi.GPIO as GPIO
import time
import urllib.request as ur
import json
from collections import namedtuple
import math


# Generate a named tuple to handle the wheel speeds
# values are 100 to -100.  0 is stationary
WheelVelocities = namedtuple("WheelVelocities", "LeftWheel RightWheel")



def testWiring(pin, message):
    print(message)
    GPIO.output(pin, True)
    time.sleep(0.05)
    GPIO.output(pin, False)

def getControllerStatus():
    url = "http://192.168.43.252/getvalues.ashx?format=json"
    s = ur.urlopen(url)
    sl = s.read()
    return json.loads(sl.decode())

def getAnalogueStick(obj, stickId):
    for i in range (len(obj)):
        if(obj[i]["id"]==stickId):
            return(obj[i])
    


def CalculateCarWheelSpeeds(LeftDirection, LeftMagnitude, RightDirection, RightMagnitude):
   
    ## Get the adjust for the velocity
    OverallVelocity = math.cos(math.radians(RightDirection)) * RightMagnitude

    ## Get the oposite for the stearing.
    StearingAdjust = math.sin(math.radians(LeftDirection)) * LeftMagnitude

    ## Assign the values to the wheels
    leftWheelValue = round(OverallVelocity + StearingAdjust)
    rightWheelValue = round(OverallVelocity - StearingAdjust)

    ## Limit the values to within the maximum range of -32768 to 32768
    if (leftWheelValue > 32768): leftWheelValue = 32768
    if (leftWheelValue < -32768): leftWheelValue = -32768
    if (rightWheelValue > 32768): rightWheelValue = 32768
    if (rightWheelValue < -32768): rightWheelValue = -32768

    return WheelVelocities(LeftWheel = leftWheelValue, RightWheel = rightWheelValue)



def ConvertWheelSpeedsToPercentages(wheels):
    
    leftWheelValue = round(wheels.LeftWheel / 327.68)
    rightWheelValue = round(wheels.RightWheel / 327.68)

    if (leftWheelValue > 100): leftWheelValue = 100
    if (leftWheelValue < -100): leftWheelValue = -100

    if (rightWheelValue > 100): rightWheelValue = 100
    if (rightWheelValue < -100): rightWheelValue = -100

    return WheelVelocities(LeftWheel = leftWheelValue, RightWheel = rightWheelValue)







leftSpeedPin = 40
leftForwardPin = 36
leftReversePin = 38

rightSpeedPin =  37
rightForwardPin = 35
rightReversePin =  33

GPIO.setmode(GPIO.BOARD)

GPIO.setup(leftSpeedPin, GPIO.OUT)
GPIO.setup(leftForwardPin, GPIO.OUT)
GPIO.setup(leftReversePin, GPIO.OUT)

GPIO.setup(rightSpeedPin, GPIO.OUT)
GPIO.setup(rightForwardPin, GPIO.OUT)
GPIO.setup(rightReversePin, GPIO.OUT)










# Some Quick Wiring Tests
testWiring(leftSpeedPin, "Left Speed Pin")
testWiring(leftForwardPin, "Left Forward Pin")
testWiring(leftReversePin, "Left Reverse Pin")
testWiring(rightSpeedPin, "right Speed Pin")
testWiring(rightForwardPin, "right Forward Pin")
testWiring(rightReversePin, "right Reverse Pin")



leftPWM = GPIO.PWM(leftSpeedPin, 50)
leftPWM.start(0)
rightPWM = GPIO.PWM(rightSpeedPin, 50)
rightPWM.start(0)


while(True):

    obj = getControllerStatus()

    leftStick = getAnalogueStick(obj["thumbstickValues"], "LeftStick")
    rightStick = getAnalogueStick(obj["thumbstickValues"], "RightStick")

    wheels = CalculateCarWheelSpeeds(leftStick["direction"], leftStick["magnitude"], rightStick["direction"], rightStick["magnitude"])
    wheels = ConvertWheelSpeedsToPercentages(wheels)

    ## Configure the left Wheel
    GPIO.output(leftForwardPin, (wheels.LeftWheel > 0))
    GPIO.output(leftReversePin, (wheels.LeftWheel < 0))
    leftPWM.ChangeDutyCycle(abs(wheels.LeftWheel))

    ## configure the Right Wheel
    GPIO.output(rightForwardPin, (wheels.RightWheel > 0))
    GPIO.output(rightReversePin, (wheels.RightWheel < 0))
    rightPWM.ChangeDutyCycle(abs(wheels.RightWheel))

    

GPIO.cleanup()
