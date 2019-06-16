const GroveChainableRGBLed = require('../grove_chainable_rgb_led.js');
const NUM_LEDS = 1;

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
  msleep(n*1000);
}

function rgb(leds) {
  for (var i = 0; i < NUM_LEDS; i++) {
		leds.setColorRGB(i, 255, 0, 0);
	}	
	msleep(500);
  for (var i = 0; i < NUM_LEDS; i++) {
		leds.setColorRGB(i, 0, 255, 0);
	}
	msleep(500);
	for (var i = 0; i < NUM_LEDS; i++) {
		leds.setColorRGB(i, 0, 0, 255);
	}
	msleep(500);
	for (var i = 0; i < NUM_LEDS; i++) {
		leds.setColorRGB(i, 0, 0, 0);
	}
}

function cycle(leds) {
  var hue = 0.0;
  var up = true;

	while (true) {
		for (var i = 0; i < NUM_LEDS; i++) {
			leds.setColorHSB(i, hue, 1.0, 0.5);

			msleep(50);

			if (up)
				hue += 0.025;
			else
				hue -= 0.025;

			if (hue >= 1.0 && up)
				up = false;
			else if (hue <= 0.0 && !up)
				up = true;
		}
	}
}
 
function main() {
	var pin;
	pin = 5;

	leds = new GroveChainableRGBLed(pin, (pin + 1));
	
	//rgb(leds);
	cycle(leds);
}

main();