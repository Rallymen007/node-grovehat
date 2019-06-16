const ADC = require('../adc.js');

var ANALOG_PORT = 0;

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
  msleep(n*1000);
}

function main() {
	var adc = new ADC();
	console.log(adc.name() + " " + adc.version());

	while (true) {
		console.log(adc.read(ANALOG_PORT));
		sleep(1);
	}
}

main();