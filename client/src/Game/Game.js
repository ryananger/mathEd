import input    from './input.js';
import Entity   from './Entity.js';
import Question from './Question.js';
import Pulse    from './Pulse.js';
import Jupiter  from './Jupiter.js';

import images from '../util/loadImages.js';
import ax     from '../util/ax.js';

var bgs = images.loaded.bgImages;

var renderTimeout;
var buttonId = 0;

var Game = {
  init: function() {
    Game.fps = 60;
    Game.tick = 0;

    Game.playing = false;
    Game.paused =  false;
    Game.over =    false;

    Game.score = 0;
    Game.hp = 0;

    Game.expression = '';
    Game.display = '';
    Game.answer = null;
    Game.mod = '+';

    Game.buttonsPressed = [];
    Game.deadButtons = 0;

    Game.entities = [];
    Game.numbers = [];

    Game.questionSpeed = 2;
    Game.pulse = Pulse();
    Game.jupiter = Jupiter(0, -1500);
    Game.jupiterFalling = false;

    Game.getNumbers();
    Game.leaderBoard;

    ax.getLeaderboard(Game);
  },
  togglePause: function() {
    Game.playing = !Game.playing;
  },
  update: function(ctx) {
    var cw = ctx.canvas.width;
    var ch = ctx.canvas.height;
    var background = bgs[Game.hp] || bgs[12];

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(background, 0, 0, cw, ch);

    if (Game.score > 0) {
      Game.questionSpeed = 2 * (1 + ((Math.floor(Game.score/2000)))/2);
    }

    if (Game.hp > 13) {
      Game.jupiter.crash(Game);
      Game.jupiter.update(Game);
      Game.jupiter.draw(Game, ctx);
      Game.jupiterFalling = true;
      Game.playing = false;
    }

    Game.pulse.update(Game);
    Game.pulse.draw(Game, ctx);

    if (!Game.playing || Game.paused || Game.over) {
      return;
    }

    if (Game.tick % 120 === 0) {
      var question = Question(100 + Math.floor(Math.random() * (cw - 200)), -50);

      Game.entities.unshift(question);
    }

    Game.entities.map(function(entity) {
      entity.update(Game);
      entity.draw(Game, ctx);
    });
  },
  gameLoop: function() {
    var ctx = document.getElementById('canvas').getContext('2d');

    ctx.font = "72px Jost";
    ctx.fillStyle = 'rgb(70, 32, 21)';

    var animId;
    var render = function() {
      clearTimeout(renderTimeout);
      Game.update(ctx);
      Game.tick++;

      renderTimeout = setTimeout(function() {
        animId = window.requestAnimationFrame(render);
      }, 1000/Game.fps);
    };

    render();

    return function() {
      window.cancelAnimationFrame(animId);
    };
  },

  getNumbers: function() {
    var num = [];
    var n = 10 - Game.numbers.length;

    for (var i = 0; i < n; i++) {
      num.push({value: Math.floor(Math.random() * 3) + 1, id: buttonId++});
    }

    Game.numbers = Game.numbers.concat(num);
  },
  evaluate: function() {
    if (Game.entities.length === 0) {
      return;
    }

    var split = Game.expression.split(' ');

    if (split.length === 3) {
      var a = Number(split[0]);
      var b = Number(split[2]);
      var mod = split[1];

      switch (mod) {
        case '+':
          Game.answer = a + b;
          break;
        case '-':
          Game.answer = a - b;
          break;
        case '??':
          Game.answer = a * b;
          break;
        case '??':
          Game.answer = a / b;
          break;
      }
    } else {
      var a = Number(split[0]);
      var b = Number(split[2]);
      var c = Number(split[4]);
      var mod1 = split[1];
      var mod2 = split[3];

      var result = null;

      switch (mod1) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '??':
          result = a * b;
          break;
        case '??':
          result = a / b;
          break;
      }

      switch (mod2) {
        case '+':
          Game.answer = result + c;
          break;
        case '-':
          Game.answer = result - c;
          break;
        case '??':
          Game.answer = result * c;
          break;
        case '??':
          Game.answer = result / c;
          break;
      }
    }

    var last = Game.entities[Game.entities.length - 1];

    if (last.question === Game.answer) {
      Game.correctAnswer();
    }

    Game.expression = '';
    Game.display = '';
    Game.buttonsPressed = [];
  },
  correctAnswer: function() {
    Game.pulse.pulsing = true;
    setTimeout(()=>{Game.entities.pop()}, 150);
    Game.score += 100;

    if (Game.buttonsPressed.length === 3) {
      Game.score += 100;
    }

    if (Game.buttonsPressed.length >= Game.numbers.length) {
      Game.numbers = [];
    } else {
      Game.buttonsPressed.map(function(id) {
        var index;

        Game.numbers.map(function(entry, i) {
          if (entry.id === id) {
            index = i;
          }
        })

        var front = Game.numbers.slice(0, index);
        var back  = Game.numbers.slice(index + 1);

        Game.numbers = front.concat(back);
      });
    }
  }
};

Game.init();

window.Game = Game;

export default Game;