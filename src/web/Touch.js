// взято по ссылке
// https://github.com/air/encounter/blob/master/js/Touch.js
// добавил изменение положение кнопок в зависимости от ориентации


'use strict';

var Touch = {};

Touch.CONTROLS_CSS_NOFILL = 'opacity:0.5; z-index: 11000; border-style: dashed; border-width: 1px';
Touch.CONTROLS_CSS =  'background-color: grey; ' + Touch.CONTROLS_CSS_NOFILL;
Touch.DPAD_BUTTON_WIDTH_PERCENT = 18;
Touch.DPAD_BUTTON_HEIGHT_PERCENT = 12;
Touch.ALIGN_RIGHT = 0;


Touch.dpad = {}; // map of dpad control objects
Touch.fireButton = null;

Touch.lastDPadPressed = null;

Touch.init = function()
{
  // don't init touch on desktops
  if (!('ontouchstart' in window))
  {
    return;
  }
  
  switch(window.orientation) {  
      case -90: case 90:
        //console.log('orientation landscape');
		Touch.DPAD_BUTTON_WIDTH_PERCENT = 25 / 3;
		Touch.DPAD_BUTTON_HEIGHT_PERCENT = 18;
		Touch.ALIGN_RIGHT = 100 - (Touch.DPAD_BUTTON_WIDTH_PERCENT*3);
        break; 
      default:
        //console.log('orientation portrait');
		Touch.DPAD_BUTTON_WIDTH_PERCENT = 18;
		Touch.DPAD_BUTTON_HEIGHT_PERCENT = 25 / 3;
		Touch.ALIGN_RIGHT = 100 - (Touch.DPAD_BUTTON_WIDTH_PERCENT*3);
        break; 
    }
  // remove button 
  var btnName = ['up','left','right','down','space'];
  btnName.forEach(function(btn){
		var el = document.getElementById(btn); 
		if(el != null) el.outerHTML = ""; 	});	

  
  // disable dragging
  // добавил {passive: false}  чтобы не было перетаскивания 
  document.addEventListener('touchmove', function(event) {
    event.preventDefault();
	//console.log('touchmove');
  },{passive: false});

  //Touch.initFireButton();

  // pass our id, along with our press() and unpress() functions.
  // we need to do this eight times in all.

  Touch.dpad['up'] = Touch.createDPadButton('up', function() {
    Module._keyDown(38);
  },
  function() {
    // no op
  });
  Touch.dpad['up'].style.bottom = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  Touch.dpad['up'].style.left = Touch.ALIGN_RIGHT + Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';



  Touch.dpad['left'] = Touch.createDPadButton('left', function() {
     Module._keyDown(37);
  }, function() {
    // no op
  });
  Touch.dpad['left'].style.left = Touch.ALIGN_RIGHT + '%';
  Touch.dpad['left'].style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  

  Touch.dpad['right'] = Touch.createDPadButton('right', function() {
    Module._keyDown(39);
  }, function() {
     // no op
  });
  Touch.dpad['right'].style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  Touch.dpad['right'].style.left = (Touch.ALIGN_RIGHT + Touch.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';



  Touch.dpad['down'] = Touch.createDPadButton('down', function() {
    Module._keyDown(40); 
  }, function() {
    // no op
  });
  Touch.dpad['down'].style.left= Touch.ALIGN_RIGHT + Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';



  // create a dummy button in the middle to accept touchstarts. Override the default CSS for no red colour.
  Touch.dpad['space'] = Touch.createDPadButton('space', function() {
	  // no op
  }, function() {
		Module._keyUp(32); // space   
  });
  Touch.dpad['space'].style.textAlign  = 'center'; 
  Touch.dpad['space'].innerText = 'SPACE';
};

// DPad buttons are divs with explicit press/unpress functions.
// This factory assumes you live at bottom-left of the screen.
Touch.createDPadButton = function(id, pressFunction, unpressFunction, cssOverride)
{
  var button = document.createElement('div');
  button.id = id;
  if (cssOverride)
  {
    button.style.cssText = cssOverride;
  }
  else
  {
    button.style.cssText = Touch.CONTROLS_CSS;
  }
  button.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  button.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  button.style.position = 'absolute';
  button.style.bottom = '0px';
  button.style.left = '0px';

  button.press = pressFunction;
  button.unpress = unpressFunction;

  // press handler for basic touchstart case
  button.addEventListener('touchstart', function(event) {
    Touch.lastDPadPressed = button.id;
    event.preventDefault();
    button.press();
  });
  // touch left the canvas, seems rarely called
  button.addEventListener('touchleave', function(event) {
    log('touchleave received, how novel');
    event.preventDefault();
    button.unpress();
  });
  // touch ended. The touch may have moved to another button, so handle that
  button.addEventListener('touchend', function(event) {
    event.preventDefault();
    var elementBeingTouched = Touch.getIdOfTouchedElement(event);
    if (elementBeingTouched in Touch.dpad)
    {
      Touch.dpad[elementBeingTouched].unpress();
    }
  });

  // if a touch has moved onto another button, unpress this and press the other one
  button.addEventListener('touchmove', function(event) {
    event.preventDefault();
    var elementBeingTouched = Touch.getIdOfTouchedElement(event);
    if (elementBeingTouched === Touch.lastDPadPressed)
    {
      // no change, no op
    }
    else if (elementBeingTouched in Touch.dpad) // verify we moved onto a dpad button
    {
      // unpress the last button if that's appropriate
      if (Touch.lastDPadPressed in Touch.dpad)
      {
        Touch.dpad[Touch.lastDPadPressed].unpress();
      }
      // press the new button
      Touch.dpad[elementBeingTouched].press();
      Touch.lastDPadPressed = elementBeingTouched;
    }
    else // we moved off the dpad
    {
      // unpress the last button if that's appropriate
      if (Touch.lastDPadPressed in Touch.dpad)
      {
        Touch.dpad[Touch.lastDPadPressed].unpress();
      }
      Touch.lastDPadPressed = null;
    }
  });

  document.body.appendChild(button);
  return button;
};

Touch.getIdOfTouchedElement = function(touchEvent)
{
  var touch = touchEvent.changedTouches[0];
  var element = document.elementFromPoint(touch.clientX, touch.clientY);
  // this can return null
  if (element !== null && 'id' in element)
  {
    return element.id;
  }
  else
  {
    return null;
  }
};

// fire button is a bit simpler, no need for any touchmove for sliding fingers
Touch.initFireButton = function()
{
	var el = document.getElementById('fireButton'); 
		if(el != null) el.outerHTML = "";
	
  Touch.fireButton = document.createElement('div');
  Touch.fireButton.id = 'fireButton';
  Touch.fireButton.style.cssText = 'background-color: white;';
  Touch.fireButton.style.width = '25%';
  Touch.fireButton.style.height = '25%';
  Touch.fireButton.style.position = 'absolute';
  Touch.fireButton.style.bottom = '37%';
  //Touch.fireButton.style.right = '37%';
  Touch.fireButton.style.textAlign  = 'center'; 
  Touch.fireButton.innerText = 'Touch to fullscreen.Because landscape orientation better use full screen';

  Touch.fireButton.press = function() {
	  // no op
  };
  Touch.fireButton.unpress = function() {
    Touch.fullScreen();
	document.getElementById('fireButton').outerHTML = "";
  };

  Touch.fireButton.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Touch.fireButton.press();
  });
  Touch.fireButton.addEventListener('touchend', function(event) {
    event.preventDefault();
    Touch.fireButton.unpress();
  });
  Touch.fireButton.addEventListener('touchleave', function(event) {
    event.preventDefault();
    Touch.fireButton.unpress();
  });

  document.body.appendChild(Touch.fireButton);
};

// функция вкючает полноэкранность только если уже было
// взаимодействие пользователя с дисплеем
Touch.startFullScreen = function(){
		
	if(Touch.isFullScreen())
	{
		//console.log('isFullScreen');
		return;
	}
		// ставим на паузу и ожидаем нажатий
		Module._hide();
		Touch.initFireButton();
}

// https://code-boxx.com/lock-screen-orientation/ 
Touch.fullScreen = function(){
  // Kind of painful, but this is how it works for now
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
}

Touch.exitFullScreen = function(){
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

Touch.isFullScreen = function(){
    var result =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

    if(result) return true;
}

