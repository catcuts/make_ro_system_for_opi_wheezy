# -*- coding: utf-8 -*-

import time
import usb.core
import usb.util

class find_class:

    def __init__(self, class_, filter_):
        self._class = class_
        self._filter = filter_

    def __call__(self, device):
        # first, let's check the device
        if device.bDeviceClass == self._class:
            return True
        # ok, transverse all devices to find an
        # interface that matches our class
        for cfg in device:
            # find_descriptor: what's it?
            intf = usb.util.find_descriptor(cfg, bInterfaceClass=self._class)
            if intf is not None:
                return True if not callable(self._filter) else self._filter(device)

        return False

class MassStorageUSBListerner:
    """
    this is a temporate class
    which future will be a sub class
    to a USBListerner class
    """

    def __init__(self, filter_=None, callback=None, interval=0, logfile=None):
        """
        callback eg= {
            "on_plug_in": lambda dev: print("on plug in"),
            "on_plug_out": lambda dev: print("on plug out"),             
        }
        """
        self.filter = filter_
        self.callback = callback or {}
        self.amount = 0
        self.devices = []
        self.status = "init"
        self.interval = interval
        self.logfile = logfile

    def start(self):
        if self.status == "start":
            self.log("[  UL-WARN  ] Starting refused, already listening .")
        else:
            self.log("[  UL-INFO  ] Listerning started .")
            self.listrening()

    def stop(self):
        self.status = "stop"
        time.sleep(0.1)

    def listrening(self):
        try:
            while self.status != "stop":
                self.find()
                if self.interval: time.sleep(self.interval)
        except KeyboardInterrupt:
            pass
        self.log("[  UL-INFO  ] Listerning stopped .")

    def find(self):
        devices = list(usb.core.find(find_all=True, custom_match=find_class(8, self.filter)))
        amount = len(devices)

        if amount == self.amount: return False

        if amount < self.amount:
            self.on_plug_out(self.devices.pop(0))
        elif amount > self.amount:
            self.on_plug_in(devices[0])
            self.devices.insert(0, devices[0])

        self.amount = amount
        return True

    def on_plug_in(self, device):
        self.log("[  UL-INFO  ] Something plugged in .")
        callback = self.callback.get("on_plug_in")
        if callable(callback): 
            try:
                callback(device)
            except Exception as E:
                self.log("[  UL-ERRO  ] Error while callback on device plug in: %s" % E)

    def on_plug_out(self, device):
        self.log("[  UL-INFO  ] Something plugged out .")
        callback = self.callback.get("on_plug_out")
        if callable(callback): 
            try:
                callback(device)
            except Exception as E:
                self.log("[  UL-ERRO  ] Error while callback on device plug out: %s" % E)

    def log(self, logline, screen=True):
        logtime = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
        logline = "[%s]%s" % (logtime, logline) 
        if self.logfile:
            with open(self.logfile, "a") as f:
                print(logline, file=f)
        if screen or not self.logfile: print(logline)

if __name__ == "__main__":

    listerner = MassStorageUSBListerner()
    listerner.start()