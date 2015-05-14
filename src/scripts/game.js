var canvas = document.getElementById('snakeCanvas');
var context = canvas.getContext('2d');
var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;

var arrowkeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
}

var inverseDirection = {
    'up': 'down',
    'left': 'right',
    'right': 'left',
    'down': 'up'
};

var game = {
    over: true,
    paused: false,
    init: function() {
        document.addEventListener("keydown", function(e) {
            var keyCode = e.keyCode;

            if (arrowkeys[keyCode] && arrowkeys[keyCode] !== inverseDirection[game.snake.direction]) {
                game.snake.direction = arrowkeys[keyCode];
            }
            // Enter key start
            else if (keyCode === 13 && game.over) {
                game.start();
            }
            // White space key pause 
            else if (keyCode === 32) {
                game.paused = !game.paused;
            }
        }, false);
    },
    start: function() {
        game.over = false;
        game.paused = false;
        game.snake.init();
        game.snake.draw();
        game.food.create();
    },
    stop: function() {
        game.over = true;
    },
    drawRect: function(x, y, size, color) {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x, y);
        context.rect(x, y, size, size);
        context.closePath();
        context.fill();
    },
    resetCanvas: function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    },
    loop: function() {
        if (!game.over && !game.paused) {
            game.resetCanvas();
            snake.move();
            food.create();
            snake.draw();
        }
    },
    snake: {
        size: 20,
        direction: 'left',
        color: '#0F0',
        nodes: [],
        init: function() {
            var p = {};

            game.snake.direction = 'left';
            game.snake.nodes = [];

            game.snake.x = p.x = canvas.width / 2;
            game.snake.y = p.y = canvas.height / 2;
            game.snake.nodes.push(p);

            for (var i = 0; i < 3; i++) {
                p.x = game.snake.x + game.snake.size * (i + 1);
                p.y = game.snake.y;
                game.snake.nodes.push(p);
            }
        },
        move: function() {
            var p = {};
            switch (game.snake.direction) {
                case 'up':
                    game.snake.y -= game.snake.size;
                    break;
                case 'down':
                    game.snake.y += game.snake.size;
                    break;
                case 'left':
                    game.snake.x -= game.snake.size;
                    break;
                case 'right':
                    game.snake.x += game.snake.size;
                    break;
            }

            p.x = game.snake.x;
            p.y = game.snake.y;

            if (game.snake.isCollision(p)) {
                return false;
            }

            game.snake.nodes.unshift(p);
            game.snake.tryEat();
        },
        isCollision: function(p) {
            // 超出画布背景
            if (p.x < 0 || p.y < 0 || p.x > canvas.width || p.y + game.snake.size > canvas.height) {
                return true;
            }

            // 碰到自己
            for (var i = 0, j = snake.nodes.length; i < j; i++) {
                if (snake.nodes[i].x == x && snake.nodes[i].y == y) {
                    return true;
                }
            }

            return false;
        },
        // 检测是否吃到食物
        tryEat: function() {
            if (game.snake.x == food.x && game.snake.y == food.y) {
                game.food.create();
            }
            else {
                game.snake.nodes.pop();
            }
        },
        draw: function() {
            game.snake.nodes.forEach(function(node) {
                game.drawRect(node.x, node.y, game.snake.size, game.snake.color);
            });
        }
    },
    food: {
        color: '#0ff',
        create: function() {
            game.food.size = game.snake.size;
            game.food.x = (Math.ceil(Math.random() * 10) * game.snake.size * 4) - game.snake.size / 2;
            game.food.y = (Math.ceil(Math.random() * 10) * game.snake.size * 3) - game.snake.size / 2;
            game.drawRect(game.food.x, game.food.y, game.food.size, game.food.color);
        }
    }
};

game.init();
requestAnimationFrame(game.loop);