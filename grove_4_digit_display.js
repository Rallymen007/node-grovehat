const GPIO = require('onoff').Gpio;
const time = require('sleep');
const strftime = require('strftime')

function _pj_snippets(container) {
	function set_properties(cls, props) {
		var desc,
		value;
		var _pj_a = props;
		for (var p in _pj_a) {
			if (_pj_a.hasOwnProperty(p)) {
				value = props[p];
				if (((((!((value instanceof Map) || (value instanceof WeakMap))) && (value instanceof Object)) && ("get" in value)) && (value.get instanceof Function))) {
					desc = value;
				} else {
					desc = {
						"value": value,
						"enumerable": false,
						"configurable": true,
						"writable": true
					};
				}
				Object.defineProperty(cls.prototype, p, desc);
			}
		}
	}
	container["set_properties"] = set_properties;
	return container;
}
_pj = {};
_pj_snippets(_pj);

var charmap = {
	"0": 63,
	"1": 6,
	"2": 91,
	"3": 79,
	"4": 102,
	"5": 109,
	"6": 125,
	"7": 7,
	"8": 127,
	"9": 111,
	"A": 119,
	"B": 127,
	"b": 124,
	"C": 57,
	"c": 88,
	"D": 63,
	"d": 94,
	"E": 121,
	"F": 113,
	"G": 125,
	"H": 118,
	"h": 116,
	"I": 6,
	"J": 31,
	"K": 118,
	"L": 56,
	"l": 6,
	"n": 84,
	"O": 63,
	"o": 92,
	"P": 115,
	"r": 80,
	"S": 109,
	"U": 62,
	"V": 62,
	"Y": 102,
	"Z": 91,
	"-": 64,
	"_": 8,
	" ": 0
};

var ADDR_AUTO = 64;
var ADDR_FIXED = 68;
var STARTADDR = 192;
var BRIGHT_DARKEST = 0;
var BRIGHT_DEFAULT = 2;
var BRIGHT_HIGHEST = 7;

class Grove4DigitDisplay {

	constructor(clk, dio, brightness = BRIGHT_DEFAULT) {
		this.brightness = brightness;
		this.clk = new GPIO(clk, 'out');
		this.dio = new GPIO(dio, 'out');
		this.data = [0, 0, 0, 0];
		this.show_colon = false;
	}

	clear() {
		this.show_colon = false;
		this.data = [0, 0, 0, 0];
		this._show();
	}

	isNumber(value) {
		return typeof value === 'number' && isFinite(value);
	}

	show(data) {
		var index,
		negative;
		if ((typeof data) === 'string') {
			for (const [i, c] of Array.from(data).entries()) {
				if (charmap[c] != undefined) {
					this.data[i] = charmap[c];
				} else {
					this.data[i] = 0;
				}
				if (((i === this.colon_index) && this.show_colon)) {
					this.data[i] |= 128;
				}
				if ((i === 3)) {
					break;
				}
			}
		} else {
			console.log("TODO: ", data);
			// if ( (Object.getPrototypeOf(data) === 'number') ) {
			// this.data = [0, 0, 0, charmap["0"]];
			// if ((data < 0)) {
			// negative = true;
			// data = (- data);
			// } else {
			// negative = false;
			// }
			// index = 3;
			// while ((data !== 0)) {
			// this.data[index] = charmap[(data % 10).toString()];
			// index -= 1;
			// if ((index < 0)) {
			// break;
			// }
			// data = Number.parseInt((data / 10));
			// }
			// if (negative) {
			// if ((index >= 0)) {
			// this.data[index] = charmap["-"];
			// } else {
			// this.data = (charmap["_"] + ([charmap["9"]] * 3));
			// }
			// }
			// } else {
			// throw new ValueError("Not support {}".format(Object.getPrototypeOf(data)));
			// }
		}
		this._show();
	}

	_show() {
		this.__enter__()
		this._transfer(ADDR_AUTO);
		this.__exit__()

		this.__enter__()
		this._transfer(STARTADDR);
		for (var i = 0, _pj_a = 4; (i < _pj_a); i += 1) {
			this._transfer(this.data[i]);
		}
		this.__exit__()

		this.__enter__()
		this._transfer((136 + this.brightness));
		this.__exit__()
	}

	// update(index, value) {
	// if (((index < 0) || (index > 4))) {
	// return;
	// }
	// if (charmap[value] != undefined) {
	// this.data[index] = charmap[value];
	// } else {
	// this.data[index] = 0;
	// }
	// if (((index === this.colon_index) && this.show_colon)) {
	// this.data[index] |= 128;
	// this._transfer(ADDR_FIXED);
	// this._transfer((STARTADDR | index));
	// this._transfer(this.data[index]);
	// this._transfer((136 + this.brightness));
	// }
	// }

	set_brightness(brightness) {
		if ((brightness > 7)) {
			brightness = 7;
		}
		this.brightness = brightness;
		this._show();
	}

	set_colon(enable) {
		this.show_colon = enable;
		if (this.show_colon) {
			this.data[this.colon_index] |= 128;
		} else {
			this.data[this.colon_index] &= 127;
		}
		this._show();
	}

	_transfer(data) {
		for (var _ = 0, _pj_a = 8; (_ < _pj_a); _ += 1) {
			this.clk.writeSync(0);
			if ((data & 1)) {
				this.dio.writeSync(1);
			} else {
				this.dio.writeSync(0);
			}
			data >>= 1;
			time.usleep(1);
			this.clk.writeSync(1);
			time.usleep(1);
		}
		this.clk.writeSync(0);
		this.dio.writeSync(1);
		this.clk.writeSync(1);
		this.dio.direction('in');
		while (this.dio.readSync()) {
			time.msleep(1);
			if (this.dio.readSync()) {
				this.dio.direction('out');
				this.dio.writeSync(0);
				this.dio.direction('in');
			}
		}
		this.dio.direction(GPIO.OUT);
	}

	_start() {
		this.clk.writeSync(1);
		this.dio.writeSync(1);
		this.dio.writeSync(0);
		this.clk.writeSync(0);
	}

	_stop() {
		this.clk.writeSync(0);
		this.dio.writeSync(0);
		this.clk.writeSync(1);
		this.dio.writeSync(1);
	}

	__enter__() {
		this._start();
	}

	__exit__(exc_type, exc_val, exc_tb) {
		this._stop();
	}
}

_pj.set_properties(Grove4DigitDisplay, {
	"colon_index": 1
});

function main() {
	var count,
	display,
	pin,
	t;
	pin = 5;

	display = new Grove4DigitDisplay(pin, (pin + 1));
	count = 0;

	while (true) {
		t = strftime("%H%M", new Date());
		display.show(t);
		display.set_colon((count & 1));
		count += 1;
		time.sleep(1);
	}
}

main();