//main.js 

var greeter = require('./Greeter.js');
document.getElementById('root').appendChild(greeter());

var imgUrl = require('./demo.png');
var imgTempl = '<img src="'+imgUrl+'" />'
	
document.body.innerHTML = imgTempl;