# Buzzy

Play songs on a piezo buzzer without blocking.

Use the [javascript program](./js/index.js) to convert a midi file into a representation that this library can play.

## **WARNING!**

Make sure that the size of your song doesn't use too much RAM. Before flashing your program, compile it and check that the RAM usage does not exceed 100%, otherwise your MCU will appear to be bricked.

However, if you have mistakenly flashed something too large, fear not. Connect your MCU to a breadboard and wire a button between `GND` and `RST`. Modify your program removing the too-large song and flash it to your board. Once you see `Looking for upload port...` double tap the button quickly. This should reset your board and allow the computer to find it. If you see `Waiting for the new upload port...` double tap again until you see that the port is found and the uploading begins. It can take some tries to get the timing correct, so don't be afraid to do a few sets of double-taps until it works.
