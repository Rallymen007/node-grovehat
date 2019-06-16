const i2c = require('i2c-bus');

var RPI_HAT_PID      = 0x0004
var RPI_ZERO_HAT_PID = 0x0005
var RPI_HAT_NAME     = 'Grove Base Hat RPi'
//""" The HAT name to compare with return value of :class:`ADC.name` """
var RPI_ZERO_HAT_NAME= 'Grove Base Hat RPi Zero'
//""" The HAT name to compare with return value of :class:`ADC.name` """

class ADC {

	/**
	 * Class ADC for the ADC unit on Grove Base Hat for RPi.
	 *
	 * @constructor
	 *
	 * @param {int} address
	 *   optional, i2c address of the ADC unit, default 0x04.
	**/
	constructor(address = 0x04) {
		this.address = address;
		this.bus = i2c.openSync(1);
	}

	/**
	 * Read the raw data of ADC unit, with 12 bits resolution.
	 * 
	 * @param {int} channel
	 *   0 - 7, specify the channel to read
	 * 
	 * @return {int} 
	 *   The adc result, in [0 - 4095].
	**/
	readRaw(channel) {
		return this.readRegister(0x10 + channel);
	}

	/**
	 * Read the voltage data of ADC unit.
	 *
	 * @param {int} channel
	 *   0 - 7, specify the channel to read
	 * 
	 * @return {int} 
	 *   The voltage result, in mV.
	**/
	readVoltage(channel) {
		return this.readRegister(0x20 + channel);
	}
	
	/**
	 * Read the ratio between channel input voltage and power voltage (most time it's 3.3V).
	 *
	 * @param {int} channel
	 *   0 - 7, specify the channel to read
	 * 
	 * @return {int} 
	 *   The ratio, in 0.1%.
	**/
	read(channel) {
		return this.readRegister(0x30 + channel);
	}

	/**
	 * Get the Hat name.
	 *
	 * @return {string}
	 *   Could be `RPI_HAT_NAME`or `RPI_ZERO_HAT_NAME`
	 **/
	name() {
		var id = this.readRegister(0x0)
		if (id == RPI_HAT_PID) {
			return RPI_HAT_NAME;
		} else if (id == RPI_ZERO_HAT_PID) {
			return RPI_ZERO_HAT_NAME;
		}
	}

	/**
	 * Get the Hat firmware version.
	 *
	 * @return {int}
	 *   Firmware version
	 **/
	version() {
		return this.readRegister(0x3);
	}

	/**
	 * Read the ADC Core (through I2C) registers
	 *
	 * Grove Base Hat for RPI I2C Registers
	 *
	 *	- 0x00 ~ 0x01: 
	 *	- 0x10 ~ 0x17: ADC raw data
	 *	- 0x20 ~ 0x27: input voltage
	 *	- 0x29: output voltage (Grove power supply voltage)
	 *	- 0x30 ~ 0x37: input voltage / output voltage
	 *
	 * @param {int} n
	 *   Register address.
	 *
	 * @return {int}
	 *   16-bit register value.
	**/
	readRegister(n) {
		try {
			this.bus.sendByteSync(this.address, n);
			return this.bus.readWordSync(this.address, n);
		} catch (error) {
			console.log("Check whether I2C enabled and Grove Base Hat inserted");
			console.log(error);
			return 0
		}
	}
}

module.exports = ADC;