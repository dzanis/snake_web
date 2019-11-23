'use strict';
var Sound = {};
Sound.load = function(key,src)
{
	this.audio = new Audio();
	this.audio.src = src;
	this.audio.loop=true;// бесконечное проигрывание
	this[key] = this.audio;
	return this.audio;
}
Sound.play = function(key)
{
this.audio = this[key];
this.audio.play();
// на всякий случай если мелодия остановится
this.audio.addEventListener('ended', function() {console.log('ended ' + this.audio.src);this.currentTime = 0;this.play();}, false);

}
Sound.resume = function()
{
this.audio.play();
}
Sound.stop = function()
{
this.audio.pause();
this.audio.currentTime = 0;// чтобы после стопа играла сначала
}
Sound.pause = function()
{
this.audio.pause();
}	  
Sound.volume = function(volume)
{
this.audio.volume =  volume;
}	