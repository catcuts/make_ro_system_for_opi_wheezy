
import os
import sys

if not os.getegid() == 0:
    sys.exit('Script must be run as root')


from time import sleep
from pyA20.gpio import gpio
from pyA20.gpio import port
from pyA20.gpio import connector

indicator = connector.gpio1p26

gpio.init()
gpio.setcfg(indicator, gpio.OUTPUT)

try:
    print("Press CTRL+C to exit")
    gpio.output(indicator, 1)
    sleep(0.1)

except KeyboardInterrupt:
    print("Goodbye.")
