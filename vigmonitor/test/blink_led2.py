#!/usr/bin/env python
"""Basic blinking led example.

The led on A20-OLinuXino-MICRO  blinks with rate of 1Hz like "heartbeat".
"""

import os
import sys
import time

if not os.getegid() == 0:
    sys.exit('Script must be run as root')


from time import sleep
from pyA20.gpio import gpio
from pyA20.gpio import port
from pyA20.gpio import connector

__author__ = "Stefan Mavrodiev"
__copyright__ = "Copyright 2014, Olimex LTD"
__credits__ = ["Stefan Mavrodiev"]
__license__ = "GPL"
__version__ = "2.0"
__maintainer__ = __author__
__email__ = "support@olimex.com"


led = connector.gpio1p12
#led = port.STATUS_LED

gpio.init()
gpio.setcfg(led, gpio.OUTPUT)

try:
    print ("Press CTRL+C to exit")
    #while True:
    #gpio.output(led, gpio.HIGH)
    #time.sleep(0.1)
    #gpio.output(led, gpio.LOW)
    gpio.output(led, gpio.HIGH)
except KeyboardInterrupt:
    print ("Goodbye.")
