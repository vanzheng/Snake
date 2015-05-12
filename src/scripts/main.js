// requirejs config
require.config({
    paths: {
        jquery: 'lib/jquery-2.1.1.min'
    },
    waitSeconds: 25
});

require(['jquery'], function($) {
    var canvas = document.getElementById('myCanvas');

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        ctx.beginPath(); // 开始路径绘制
        ctx.moveTo(0, 0); // 设置路径起点，坐标为(20,20)
        ctx.lineTo(600, 0); // 绘制一条到(200,20)的直线
        ctx.lineWidth = 1.0; // 设置线宽
        ctx.strokeStyle = "#CC0000"; // 设置线的颜色
        ctx.stroke(); // 进行线的着色，这时整条线才变得可见
    }
});
