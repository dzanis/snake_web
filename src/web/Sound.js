'use strict';
var Sound = {};
Sound.muted = true;
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

Sound.enableSoundDialog = function()
{
	var overlay = document.createElement('div');
	overlay.id = 'overlay';
	overlay.style.cssText = 'background: rgba(0, 0, 0, 0.65);width: 100%; height: 100%;z-index: 12000;';
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	
	var dialog = document.createElement('div');
	dialog.id = 'dialog';
	dialog.style.cssText = 'width: 200px;margin-left: -110px;background-color: grey; text-align:center; border: 10px solid red;';
	dialog.innerHTML = 'Enable sound?<br>';

	dialog.style.position = 'absolute';
	dialog.style.top = '40%';
	dialog.style.left = '50%';

	var yes = document.createElement('button');
	yes.style.float = 'left';
	yes.innerText = 'Yes';
	dialog.appendChild(yes);
	var no = document.createElement('button');
	no.style.float = 'right';
	no.innerText = 'No';
	dialog.appendChild(no);

	no.addEventListener('click', function (event)
	{
	Sound.muted = true;
	overlay.outerHTML = ""
	}, false);

	yes.addEventListener('click', function (event)
	{
	Sound.muted = false;	
	overlay.outerHTML = ""
	}, false);
	
	overlay.appendChild(dialog);	
	document.body.appendChild(overlay);
}


