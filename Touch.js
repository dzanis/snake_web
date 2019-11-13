// взято по ссылке
// https://github.com/air/encounter/blob/master/js/Touch.js
// добавил изменение положение кнопок в зависимости от ориентации


'use strict';

var Touch = {};

Touch.CONTROLS_CSS_NOFILL = 'opacity:0.5; z-index: 11000; border-style: dashed; border-width: 1px';
Touch.CONTROLS_CSS =  'background-color: grey; ' + Touch.CONTROLS_CSS_NOFILL;
Touch.DPAD_BUTTON_WIDTH_PERCENT = 18;
Touch.DPAD_BUTTON_HEIGHT_PERCENT = 12;
Touch.DPAD_BUTTON_WIDTH_SKIP_PERCENT = 0;


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
		Touch.DPAD_BUTTON_WIDTH_SKIP_PERCENT = 100 - (Touch.DPAD_BUTTON_WIDTH_PERCENT*3);
        break; 
      default:
        //console.log('orientation portrait');
		Touch.DPAD_BUTTON_WIDTH_PERCENT = 18;
		Touch.DPAD_BUTTON_HEIGHT_PERCENT = 25 / 3;
		Touch.DPAD_BUTTON_WIDTH_SKIP_PERCENT = 50 - (Touch.DPAD_BUTTON_WIDTH_PERCENT+Touch.DPAD_BUTTON_WIDTH_PERCENT/2);
        break; 
    }
  // remove button 
  var btnName = ['up','left','right','down','center'];
  btnName.forEach(myFunction);			
    function myFunction(btn, index, array)
    {				
      	var el = document.getElementById(btn); 
		if(el != null)
        el.outerHTML = ""; 						
    }
  
  // disable dragging
  // FIXME this shouldn't be needed but we go a few px off bottom of screen, which enables drag
  document.addEventListener('touchmove', function(event) {
    event.preventDefault();
  });

  //Touch.initFireButton();

  // pass our id, along with our press() and unpress() functions.
  // we need to do this eight times in all.

  Touch.dpad['up'] = Touch.createDPadButton('up', function() {
    keyDown(38);
  },
  function() {
    // no op
  });
  Touch.dpad['up'].style.bottom = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  Touch.dpad['up'].style.left = Touch.DPAD_BUTTON_WIDTH_SKIP_PERCENT + Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';



  Touch.dpad['left'] = Touch.createDPadButton('left', function() {
     keyDown(37);
  }, function() {
    // no op
  });
  Touch.dpad['left'].style.left = Touch.DPAD_BUTTON_WIDTH_SKIP_PERCENT + '%';
  Touch.dpad['left'].style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  

  Touch.dpad['right'] = Touch.createDPadButton('right', function() {
    keyDown(39);
  }, function() {
     // no op
  });
  Touch.dpad['right'].style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  Touch.dpad['right'].style.left = (Touch.DPAD_BUTTON_WIDTH_SKIP_PERCENT + Touch.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';



  Touch.dpad['down'] = Touch.createDPadButton('down', function() {
    keyDown(40); 
  }, function() {
    // no op
  });
  Touch.dpad['down'].style.left= Touch.DPAD_BUTTON_WIDTH_SKIP_PERCENT + Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';



  // create a dummy button in the middle to accept touchstarts. Override the default CSS for no red colour.
  Touch.dpad['center'] = Touch.createDPadButton('center', function() {
    // no op
  }, function() {
    keyUp(32); // space
  });
  Touch.dpad['center'].style.left= Touch.DPAD_BUTTON_WIDTH_SKIP_PERCENT + Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  Touch.dpad['center'].style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  Touch.dpad['center'].style.textAlign  = 'center'; 
  Touch.dpad['center'].innerText = 'SPACE';
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
  Touch.fireButton = document.createElement('div');
  Touch.fireButton.id = 'fireButton';
  Touch.fireButton.style.cssText = Touch.CONTROLS_CSS;
  Touch.fireButton.style.width = '40%';
  Touch.fireButton.style.height = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 3) + '%';
  Touch.fireButton.style.position = 'absolute';
  Touch.fireButton.style.bottom = '0px';
  Touch.fireButton.style.right = '0px';

  Touch.fireButton.press = function() {
    Keys.shooting = true;
  };
  Touch.fireButton.unpress = function() {
    Keys.shooting = false;
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
