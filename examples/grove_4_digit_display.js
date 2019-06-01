const Grove4DigitDisplay = require('../grove_4_digit_display.js');
const strftime = require('strftime');

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
  msleep(n*1000);
}

function main() {
	var count, display,	pin, t;
	pin = 5;

	display = new Grove4DigitDisplay(pin, (pin + 1));
	count = 0;

	for (var i = 10; i >= 0; i--) {
		display.show(i);
		msleep(200);
	}
	msleep(500);
	display.clear();
	msleep(500);
	while (true) {
		t = strftime("%H%M", new Date());
		display.show(t);
		display.set_colon((count & 1));
		count += 1;
		sleep(1);
	}
}

main();