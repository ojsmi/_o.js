// Copyright (c) 2012 Oliver Smith, http://ollyjsmith.com
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//


(function( global ){

// SETUP

	var _o = {
		VERSION: '0.0.2'
	};

	if( global._o ){
		throw new Error( '_o is already defined.');
	} else {
		global._o = _o;
	}
// TEST FOR SUPPORT 
// This is pretty bare bones - for more, use Modernizr ( where some of this comes from... )
_o.browser = {};

_o.browser.canvasSupport = (function(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
})();

_o.browser.webAudioSupport = (function(){
	return ( typeof AudioContext === "function" ) ? true : ( typeof webkitAudioContext === "function" ) ? 'webkit' : false;
})();
console.log( _o.browser );


// MOUSE INTERACTION	
// 
// we keep this info about the mouse: 
// x : document x position
// y : document y position
// down : is the button up or down ( true/false )

	// useful to have current mouse info and previous mouse info
	_o.pMouse = {};
	_o.mouse = {};

	// TRACK MOUSE
	//
	// gives access to current mouse X and Y and previous mouse X and Y
	//
	_o.trackMouse = function( e ){
		//tracks mouse globally on page
		_o.pMouse.x	= _o.mouse.x;
		_o.pMouse.y = _o.mouse.y;
		
		if (e.pageX || e.pageY) 	{
			_o.mouse.x = 	e.pageX;
			_o.mouse.y = 	e.pageY;
		} else if (e.clientX || e.clientY) 	{ //not eerything provides pageX/Y...
			_o.mouse.x = 	e.clientX + document.body.scrollLeft
		   		+ document.documentElement.scrollLeft;
			_o.mouse.y = 	e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}

		//tracks mouse on a per canvas basis
		_o.trackMouseOnCanvasses();

	};

	// MOUSE BUTTONS
	//
	// is a mouse button pressed
	// TODO: detect which button it is
	_o.mouseDown = function(){
		_o.pMouse.down = _o.mouse.down;
		_o.mouse.down = true;
	}
	_o.mouseUp = function(){
		_o.pMouse.down = _o.mouse.down;
		_o.mouse.down = false;
	}




// KEYBOARD INTERACTION
	
	_o.keys = {};

    _o.keys.listByCode = {
        "8": "backspace", "9": "tab", "13": "enter", "16": "shift", "17": "control", "18": "alt", "32": "space", "37": "left", "38": "up", "39": "right", "40": "down",
        "48": "0", "49": "1", "50": "2", "51": "3", "52": "4", "53": "5", "54": "6", "55": "7", "56": "8", "57": "9",
        "65": "a", "66": "b", "67": "c", "68": "d", "69": "e", "70": "f", "71": "g", "72": "h", "73": "i", "74": "j", "75": "k", "76": "l", "77": "m", "78": "n", "79": "o", "80": "p", "81": "q", "82": "r", "83": "s", "84": "t", "85": "u", "86": "v", "87": "w", "88": "x", "89": "y","90": "z",
        "91": "meta", "93": "meta",
        "186": ";", "187": "=", "188": ",", "189": "-", "190": ".", "191": "/", "192": "`", "219": "[", "220": "\\", "221": "]","222": "'"
    };
    _o.keys.listByName = {
        "0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57,        
        "q": 81, "w": 87, "e": 69, "r": 82, "t": 84, "y": 89, "u": 85, "i": 73, "o": 79, "p": 80, "a": 65, "s": 83, "d": 68, "f": 70, "g": 71, "h": 72, "j": 74, "k": 75, "l": 76, "z": 90, "x": 88, "c": 67, "v": 86, "b": 66, "n": 78, "m": 77,
        "[": 219, "]": 221, "-": 189, "=": 187, ";": 186, "'": 222, "\\": 220, "`": 192, ",": 188, ".": 190, "/": 191,
        "backspace": 8, "tab": 9, "enter": 13, "shift": 16, "control": 17, "alt": 18, "meta": 93, "space": 32, "left": 37, "down": 40, "right": 39, "up": 38
    };

    _o.keys.pressed = [];

	_o.keyDown = function( e ){
		var name = _o.keys.listByCode[ e.keyCode ];
		if( _o.keys.pressed.length ){
			var keyAlreadyPressed = false;
			for( var i = 0; i < _o.keys.pressed.length; i++ ){
				if( _o.keys.pressed[i] === name ){
					keyAlreadyPressed = true;					
				} 								
			}
			if ( !keyAlreadyPressed ){
				_o.keys.pressed.push( name );
				_o.keys.lastDown = name;
			}
		} else {
			_o.keys.pressed.push( name );
			_o.keys.lastDown = name;
		}
	}
	_o.keyUp = function( e ){		
		var name = _o.keys.listByCode[ e.keyCode ];
		var indexToRemove = -1;
		if( _o.keys.pressed.length ){
			for( var i = 0; i < _o.keys.pressed.length; i++ ){
				if( _o.keys.pressed[i] === name ){
					indexToRemove = i;					
				} 								
			}
			_o.keys.pressed.splice( indexToRemove, 1 );
		} 	
		_o.keys.lastUp = name;	
	}


// ADD LISTENERS
// 
// add the listeners for mouse ad keyboard to the document
// this relies on addEventListener, so it precludes older browsers, but they tend
// not to have canvas support and almost certainly don't have audio support, so
// they're out of the scope of this library
	_o.addListeners = function(){
		var events = [ 
						{ 
							'event': 'mousemove', 
							'func' : _o.trackMouse
						}, 
						{
							'event': 'mousedown',
							'func' : _o.mouseDown
						}, 
						{
							'event': 'mouseup',
							'func' : _o.mouseUp
						},
						{
							'event': 'keydown',
							'func' : _o.keyDown
						},
						{
							'event': 'keyup',
							'func' : _o.keyUp
						}
					];
		for( var i = 0; i < events.length; i++ ){
			if( document.addEventListener ){
				document.addEventListener( events[i].event , events[i].func, true );
			} else {
				throw new Error( 'This browser does not support \'addEventListener()\'' );
			}
		}
	}

	_o.addListeners();

// NUMBER GENERATION & ADJUSTMENT 

	// MAP VALUE
	//
	// maps a value from one range to another
	// ta Processing: http://processing.org
	// NOTE: does not clamp the values
	//
	_o.mapValue = function( val, origMin, origMax, newMin, newMax ){
		return newMin + ( newMax - newMin ) * ( ( val - origMin ) / ( origMax - origMin ) );
	};

	_o.randomRange = function ( fromValue, toValue ){
		return fromValue + ( Math.random() * ( toValue - fromValue ) );
	}

// AUDIOVISUAL
	
	//we keep a list of canvasses for reference & for mouse tracking
	_o.canvasses = [];

	// CREATE CANVAS
	//
	// sets up a canvas and returns an object containing:
	// .canvas - the canvas element, sized based on values passed in, or the size of the window
	// .w & .h - the width and height of the canvas element
	// .ctx    - the context of the canvas
	_o.createCanvas = function( width, height ){
		var canvas = {};

		canvas.canvas 			= 	document.createElement( 'canvas' );						
		//set the size - default to the sizes of the window
		canvas.canvas.width		=	width || window.innerWidth;
		canvas.canvas.height 	=	height || window.innerHeight;
		//these are just for convenience
		canvas.w 				=	canvas.canvas.width;
		canvas.h 				=	canvas.canvas.height;
		//could add options for webGL context but realistically that's getting handled by three.js
		canvas.ctx				=	canvas.canvas.getContext( '2d' );

		//where is the mouse on this canvas?
		canvas.mouse = {};
		canvas.pMouse = {};

		//add this to our list
		_o.canvasses.push( canvas );

		return canvas;
	};

	// TRACK MOUSE ON CANVASSES
	//
	// provides us with a mouse position & previous mouse position mapped to each canvas we have created

	_o.trackMouseOnCanvasses = function(){
		for( var i = 0; i < _o.canvasses.length; i++ ){
			var this_canvas = _o.canvasses[i];			
			var canvas_mouse_x = _o.mouse.x - this_canvas.canvas.offsetLeft;
			var canvas_mouse_y = _o.mouse.y - this_canvas.canvas.offsetTop;

			this_canvas.pMouse.x = this_canvas.mouse.x;
			this_canvas.pMouse.y = this_canvas.mouse.y;

			this_canvas.mouse.x = ( canvas_mouse_x  >= 0 && canvas_mouse_x  <= this_canvas.w ) ? canvas_mouse_x : -1;			
			this_canvas.mouse.y = ( canvas_mouse_y  >= 0 && canvas_mouse_y  <= this_canvas.h ) ? canvas_mouse_y : -1;	
		}
	}

	// CREATE AUDIO
	//
	// creates and returns an audio context
	// normalises the webkit prefix
	// returns empty object if no audio support
	_o.createAudio = function( ){
		var audio = {};

		if (typeof AudioContext == "function") {
			audio.ctx = new AudioContext();
		} else if (typeof webkitAudioContext == "function") {
			audio.ctx = new webkitAudioContext();
		} 

		return audio;
	};

// SHIVS/SHIMS

	// REQUEST ANIMATION FRAME
	// SEE: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	requestAnimationFrame = (function(){

		return	window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function( callback ){ //fallback to setTimeout
					window.setTimeout(callback, 1000 / 60);
				};

	})();

// END _o.

})( typeof window === 'undefined' ? this : window );


// END
