const Grove4DigitDisplay = require('../grove_4_digit_display.js');
const strftime = require('strftime');
const time = require('sleep');

function main() {
	var count, display,	pin, t;
	pin = 5;

	display = new Grove4DigitDisplay(pin, (pin + 1));
	count = 0;

	for (var i = 10; i >= 0; i--) {
		display.show(i);
		time.msleep(200);
	}
	time.msleep(500);
	display.clear();
	time.msleep(500);
	while (true) {
		t = strftime("%H%M", new Date());
		display.show(t);
		display.set_colon((count & 1));
		count += 1;
		time.sleep(1);
	}
}

main();