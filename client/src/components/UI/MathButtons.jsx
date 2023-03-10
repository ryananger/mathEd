import React from 'react';
import images from '../../util/loadImages.js';

const MathButtons = function({Game}) {
  var changeMod = function(e) {
    var mod = e.target.getAttribute('value');

    switch (mod) {
      case 'plus':
        Game.mod = '+';
        break;
      case 'minus':
        Game.mod = '-';
        break;
      case 'multiply':
        Game.mod = '×';
        break;
      case 'divide':
        Game.mod = '÷';
        break;
    }
  };

  return (
    <div className='mathButtons h'>
      <img src={images.urls.mathImages[0]} value='plus'     className='mathButton v' onClick={changeMod}></img>
      <img src={images.urls.mathImages[1]} value='minus'    className='mathButton v' onClick={changeMod}></img>
      <img src={images.urls.mathImages[2]} value='multiply' className='mathButton v' onClick={changeMod}></img>
      <img src={images.urls.mathImages[3]} value='divide'   className='mathButton v' onClick={changeMod}></img>
    </div>
  )
};

export default MathButtons;