var canvas = document.getElementById('snakeCanvas');
var context = canvas.getContext('2d');

var game = {
    keys: {
        up: [38, 75, 87],
        down: [40, 74, 83],
        left: [37, 65, 72],
        right: [39, 68, 76],
        start_game: [13, 32]
    },
    getKey: function (value) {
        for (var key in keys) {
            if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0) {
                return key;
            }
        }
        return null;
    },
    init: function() {
        document.addEventListener("keydown", function(e) {
            var lastKey = game.getKey(e.keyCode);
            if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0 && lastKey != inverseDirection[snake.direction]) {
                snake.direction = lastKey;
            } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
                game.start();
            }
        }, false);
    },
    start: function() {
        game.over = false;
        game.snake.init();
        game.food.create();
    },
    stop: function() {
        game.over = true;
    },
    drawRect: function(x, y, size, color) {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x, y);
        context.rect(size, size);
        context.closePath();
        context.fill();
    },
    resetCanvas: function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
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
            } else {
                game.snake.nodes.pop();
            }
        },
        draw: function() {
            var sections = game.snake.nodes;
            var length = sections.length;

            for (var i = 0; i < length; i++) {
                game.drawRect(sections[i].x, sections[i].y, game.snake.size, game.snake.color);
            }
        }
    },
    food: {
        color: '#0ff',
        create: function() {
            game.food.size = game.snake.size;
            game.food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
            game.food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
            game.drawRect(food.x, food.y, food.size, food.color);
        }
    }
};