// HELPER for _o.js
//
// allows the generation of key -> key code map for use in _o.trackKeyboard
// not foolproof - cross browser issues not currently dealt with, so a certain amount
// of by-hand adjustment is needed, YMMV


//create an array of each key in order
var keyNames = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace', 'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[',']', 'enter','a','s','d','f','g','h','j','k','l',';','\'','\\','shift','`','z','x','c','v','b','n','m',',','.','/','shift','control','alt','meta','space','meta','alt', 'left', 'down', 'right', 'up' ];
var keyVals = [];
var keys = {};
keys.byCode = {};
keys.byName = {};
var readKeyboard = function( e ){
	//stop the keys doing anything
	e.preventDefault();
	//add the keyCode of the key that's just been pressed
	keyVals.push( e.keyCode );

	//once we have one code for every key
	if( keyNames.length === keyVals.length ){
		//loop through names & codes,
		//create 2 objects, one to look up by key code and one by key name
		for( var i = 0; i < keyNames.length; i++ ){
			_o.keys.byCode[ keyVals[i] ] = keyNames[i];
			_o.keys.byName[ keyNames[i] ] = keyVals[i];
		}
		//print out as JSON string
		console.log( JSON.stringify( _o.keys ) );
		//we're done, so remove the event listener
		document.removeEventListener( 'keydown', readKeyboard, false );
	}
}

//add the event listener, press the keys in the order you added them to the array to generate the JSON
document.addEventListener( 'keydown', readKeyboard, false );
	