const GPIO = require('onoff').Gpio;
const time = require('sleep');

var CL_RED          = 0;
var CL_GREEN        = 1;
var CL_BLUE         = 2;
var CLK_PULSE_DELAY = 20;
var NB_LED_DEFAULT  = 1;

class GroveChainableRGBLed {
	
	constructor(clk, dio, nb_leds = NB_LED_DEFAULT) {
		this.num_leds = nb_leds;
		this.clk = new GPIO(clk, 'out');
		this.dio = new GPIO(dio, 'out');
		this.led_state = new Array(this.num_leds * 3).fill(0);
		
		for (var i = 0; i < this.num_leds; i++) {
			this.setColorRGB(i, 0, 0, 0);
		}
	}
	
	clkSend() {
		this.clk.writeSync(0);
		time.usleep(CLK_PULSE_DELAY);
		this.clk.writeSync(1);
		time.usleep(CLK_PULSE_DELAY);
	}
	
	sendByte(b) {
		for (var i = 0; i < 8; i++) {
			if ((b & 0x80) != 0)
				this.dio.writeSync(1);
			else
				this.dio.writeSync(0);
			this.clkSend();
			
			b <<= 1;
		}
	}

	sendColor(red, green, blue) {
		var prefix = 0b11000000;
		if ((blue & 0x80) == 0)  prefix|= 0b00100000;
    if ((blue & 0x40) == 0)  prefix|= 0b00010000; 
    if ((green & 0x80) == 0) prefix|= 0b00001000;
    if ((green & 0x40) == 0) prefix|= 0b00000100;
    if ((red & 0x80) == 0)   prefix|= 0b00000010;
    if ((red & 0x40) == 0)   prefix|= 0b00000001;
    this.sendByte(prefix);
        
    // Now must send the 3 colors
    this.sendByte(blue);
    this.sendByte(green);
    this.sendByte(red);
	}

	setColorRGB(led, red, green, blue) {
	  this.sendByte(0x00);
    this.sendByte(0x00);
    this.sendByte(0x00);
    this.sendByte(0x00);
    
    // Send color data for each one of the leds
    for (var i = 0; i < this.num_leds; i++)
    {
      if (i == led)
      {
        this.led_state[i * 3 + CL_RED] = red;
        this.led_state[i * 3 + CL_GREEN] = green;
        this.led_state[i * 3 + CL_BLUE] = blue;
      }

      this.sendColor(this.led_state[i * 3 + CL_RED], 
                     this.led_state[i * 3 + CL_GREEN], 
                     this.led_state[i * 3 + CL_BLUE]);
    }

    // Terminate data frame (32x "0")
    this.sendByte(0x00);
    this.sendByte(0x00);
    this.sendByte(0x00);
    this.sendByte(0x00);
	}

	setColorHSB(led, hue, saturation, brightness) {
		var r, g, b;
		
		if (saturation == 0.0) {
      r = g = b = brightness;
    } else {
      var q = brightness < 0.5 ? 
				brightness * (1.0 + saturation) : brightness + saturation - brightness * saturation;
      var p = 2.0 * brightness - q;
      r = this.hue2rgb(p, q, hue + 1.0/3.0);
      g = this.hue2rgb(p, q, hue);
      b = this.hue2rgb(p, q, hue - 1.0/3.0);
    }

    this.setColorRGB(led, Math.round(255.0 * r), Math.round(255.0 * g), Math.round(255.0 * b));
	}

  hue2rgb(p, q, t) {
		if (t < 0.0) t += 1.0;
    if (t > 1.0) t -= 1.0;
    if (t < 1.0/6.0) 
      return p + (q - p) * 6.0 * t;
    if (t < 1.0/2.0) 
      return q;
    if (t < 2.0/3.0) 
      return p + (q - p) * (2.0/3.0 - t) * 6.0;

		return p;
	}

}

module.exports = GroveChainableRGBLed;
