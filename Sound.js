'use strict';
var Sound = {};
Sound.muted = false;
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
if(!Sound.muted) 
this.audio.play();
// на всякий случай если мелодия остановится
this.audio.addEventListener('ended', function() {console.log('ended ' + this.audio.src);this.currentTime = 0;this.play();}, false);

}
Sound.resume = function()
{
	if(Sound.muted) return;
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

Sound.mute = function()
{
	Sound.muted = !Sound.muted;
	if(Sound.muted) 
	this.audio.pause();
	else
	this.audio.play();
}	

Sound.addMute = function()
{
  Sound.muteButton = document.createElement('div');
  Sound.muteButton.id = 'muteButton';
  Sound.muteButton.style.cssText = 'background-color: grey;opacity:0.5; z-index: 11000; border-style: dashed; border-width: 1px';
  Sound.muteButton.style.width = '10%';
  //Sound.muteButton.style.height = '10%';
  Sound.muteButton.style.position = 'absolute';
  Sound.muteButton.style.top = '10%';
  Sound.muteButton.style.left = '89%';
  Sound.muteButton.style.textAlign  = 'center'; 
  Sound.muteButton.innerText = 'mute';
  
	Sound.muteButton.addEventListener('click', function (event)
{
    event.preventDefault();
	//Sound.mute();
	Module._keyUp(77);
}, false);
	document.body.appendChild(Sound.muteButton);
}