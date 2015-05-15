var canvas = document.getElementById('snakeCanvas');
var context = canvas.getContext('2d');
var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;
var game, panel, snake, food;

game = {
    fps: 20,
    over: true,
    paused: false,
    score: 0,
    keys: {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    },
    inverseDirection: {
        'up': 'down',
        'left': 'right',
        'right': 'left',
        'down': 'up'
    },
    init: function() {
        game.initControls();
        game.controls.btnStartGame.addEventListener('click', game.events.startGame, false);
        game.controls.btnPauseGame.addEventListener('click', game.events.pauseGame, false);
        document.addEventListener("keydown", game.events.onkeydown, false);
    },
    initControls: function() {
        game.controls = {
            btnStartGame: document.getElementById('startGame'),
            btnPauseGame: document.getElementById('pauseGame'),
            gameScore: document.getElementById('gameScore')
        }
    },
    start: function() {
        game.score = 0;
        game.over = false;
        game.paused = false;
        snake.init();
        snake.draw();
        food.random();
        food.draw();
        requestAnimationFrame(game.animate);
    },
    stop: function() {
        game.over = true;
    },
    animate: function() {
        if (!game.over && !game.paused) {
            panel.resetCanvas();
            snake.move();
            food.draw();
            snake.draw();
        }

        setTimeout(function() {
            requestAnimationFrame(game.animate);
        }, 1000 / game.fps);
    },
    events: {
        onkeydown: function(e) {
            var keyCode = e.keyCode;

            if (game.keys[keyCode] && game.keys[keyCode] !== game.inverseDirection[snake.direction]) {
                snake.direction = game.keys[keyCode];
            }
            // Enter key start
            else if (keyCode === 13 && game.over) {
                game.start();
            }
        },
        startGame: function(e) {
            game.start();
        },
        pauseGame: function(e) {
            game.paused = true;
        }
    }
};

panel = {
    drawRect: function(x, y, size, color) {
        context.fillStyle = color;
        context.fillRect(x, y, size, size);
    },
    resetCanvas: function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
};

snake = {
    size: 10,
    direction: 'left',
    color: '#0F0',
    nodes: [],
    init: function() {
        var px, py;
        snake.direction = 'left';
        snake.nodes = [];

        snake.x = canvas.width / 2;
        snake.y = canvas.height / 2;
        snake.nodes.push({
            x: snake.x,
            y: snake.y
        });

        for (var i = 0; i < 3; i++) {
            px = snake.x + snake.size * (i + 1);
            py = snake.y;
            snake.nodes.push({
                x: px,
                y: py
            });
        }
    },
    move: function() {
        var p = {};
        switch (snake.direction) {
            case 'up':
                snake.y -= snake.size;
                break;
            case 'down':
                snake.y += snake.size;
                break;
            case 'left':
                snake.x -= snake.size;
                break;
            case 'right':
                snake.x += snake.size;
                break;
        }

        p.x = snake.x;
        p.y = snake.y;

        if (snake.isCollision(p)) {
            return false;
        }

        snake.nodes.unshift(p);
        snake.grow();
    },
    isCollision: function(p) {
        // 超出画布背景
        if (p.x < 0 || p.y < 0 || p.x > canvas.width || p.y + snake.size > canvas.height) {
            game.stop();
            return true;
        }

        // 碰到自己
        for (var i = 0, j = snake.nodes.length; i < j; i++) {
            if (snake.nodes[i].x === p.x && snake.nodes[i].y === p.y) {
                game.stop();
                return true;
            }
        }

        return false;
    },
    // 检测是否吃到食物
    grow: function() {
        if (snake.x == food.x && snake.y == food.y) {
            food.random();
            game.score++;
            game.controls.gameScore.innerText = game.score;
        } else {
            snake.nodes.pop();
        }
    },
    draw: function() {
        snake.nodes.forEach(function(node) {
            panel.drawRect(node.x, node.y, snake.size, snake.color);
        });
    }
};

food = {
    size: snake.size,
    color: '#0ff',
    random: function() {
        food.set();
        food.checkOverlap();
    },
    // 设置食物坐标
    set: function() {
        food.x = Math.ceil(Math.random() * (canvas.width - food.size) / food.size) * food.size;
        food.y = Math.ceil(Math.random() * (canvas.height - food.size) / food.size) * food.size;
    },
    // 检测食物是否与蛇坐标重叠, 如果位置重叠则重设位置。
    checkOverlap: function() {
        for (var i = 0, length = snake.nodes.length; i < length; i++) {
            if (food.x === snake.nodes[i].x && food.y === snake.nodes[i].y) {
                food.set();
                food.checkOverlap();
                break;
            }
        }
    },
    draw: function() {
        panel.drawRect(food.x, food.y, food.size, food.color);
    }
}

game.init();
