import React, {useEffect, useState} from 'react';
import images       from '../util/loadImages.js';
import cookieHandle from '../util/cookieHandle.js';

import Game     from '../Game/Game.js';
import GameOver from './GameOver.jsx';
import MenuUI   from './UI/MenuUI.jsx';
import PlayUI   from './UI/PlayUI.jsx';

const App = function() {
  const [updates, updateReact] = useState(0);
  const [view, setView] = useState('menu');

  const user = cookieHandle.user();
  const updateInterval = 50;

  if (window.innerWidth < 640) {
    console.log(window.innerWidth)
    return (
      <div style={{textAlign: 'center', color: '#ffc89d'}}>
        please view on desktop,
        <br/>
        mobile coming soon
        <br/>
        <br/>
        thx
      </div>
    )
  }

  const reactLoop = function() {
    if (!Game.playing) {
      return;
    }

    if (Game.over) {
      setView('gameover');
      return;
    }

    setTimeout(function() {
      updateReact(updates + 1);
    }, updateInterval);
  };

  const renderView = function() {
    switch (view) {
      case 'menu':
        return <MenuUI setView={setView} user={user}/>;
      case 'play':
        if (!Game.playing) {
          return;
        }

        return <PlayUI user={user}/>;
      case 'gameover':
        return <GameOver setView={setView} user={user}/>;
    }
  };

  useEffect(reactLoop, [updates, Game.playing]);
  useEffect(Game.gameLoop, []);

  return (
    <div className='main h'>
      <div className='wing v'>
        this is jupiterFalls, an edutainment proof of concept for early math education (and beyond!)
        <br/><br/>
        there is an increasing need for alternative education solutions and this aims to be accessible and effective.
        <br/><br/>
        it's still a work in progress, but the long term goal is to expand this into a suite of games that can supplement a complete K-12 curriculum,
        with individualized content generated in real time.
        <br/><br/>
        math seemed an easy enough subject to start with, and I'm trying to think through game concepts that could increase in difficulty as the learner progresses. I'm open to ideas and feedback.
      </div>
      <div id='play' className='play v'>
        <canvas id='canvas' className='canvas float' width='800' height='1420'/>

        {renderView()}
      </div>
      <div className='wing v'>
        click on the buttons or use numpad, then click on the expression or press Enter to fire.
        <br/><br/>
        <small>press Spacebar to refill your numbers.</small>
        <br/>
        <small>press M to mute, Escape to pause.</small>
        <br/>
        <br/>
        <br/>
        <br/>
        <div style={{textAlign: 'center'}}>
          --xx--
          <br/><br/>
          I made the art, too. Related projects below.
          <br/><br/>
          <a href='https://gen.inkvessels.art'>ink.gen</a><br/>
          <a href='https://inkvessels.art'>ink.vessels</a>
        </div>
      </div>
    </div>

  )


}

export default App;

