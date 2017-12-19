var Snow = (function () {
    var snow = {
        stage: (function () {
            var s = new PIXI.Stage();
            return s;
        })(),
        render: (function () {
            var render;
            function autoWH() {
                if (render.view) {
                    render.width = render.view.width = $(window).width();
                    render.height = render.view.height = $(window).height();
                }
            }
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                render = PIXI.autoDetectRenderer($(window).width(), $(window).height(), { transparent: true }, false);
            }
            else {
                render = new PIXI.CanvasRenderer($(window).width(), $(window).height(), { transparent: true });
            };
            $(render.view).addClass("snow-main")
            autoWH();
            $(window).on("resize", function () { autoWH(); });
            return render;
        })(),
        list: [],
        dom: null,
        pos: function (o) {
            o.dom.x = o.left;
            o.dom.y = o.top;
        },
        reset: function (o) {
            var w = snow.render.view.width;
            o.left = Math.random() * w;
            o.top = Math.random() * -100;
            snow.pos(o);
        },
        img: null,
        item: function () {
            var rand = Math.random();
            var bt = new PIXI.BaseTexture.fromImage(snow.img);
            var bg = new PIXI.Texture(bt);
            var g = new PIXI.Sprite(bg);
            g.width = rand * 20;
            g.height = rand * 20;

            snow.stage.addChild(g);
            var obj = {
                dom: g,
                offsetLeft: rand > 0.5 ? rand * 0.5 : 0 - rand * 0.5,
                offsetTop: rand
            }
            snow.reset(obj);
            return obj;
        },
        flag: true,
        speed: 1.5,// px
        frequency: 15,//频率
        density: 30,//密度 px
        ani: function (n) {
            var list = snow.list;
            var flag = true;
            var maxh = 1500; //snow.render.view.height;//($(document.body).height() > $(window).height() ? $(document.body).height() : $(window).height());
            for (var j = 0; j < list.length; j++) {
                var o = list[j];
                o.dom.width = o.dom.width;
                o.dom.height = o.dom.height;
                if (o.top >= maxh) {
                    snow.reset(o);
                    snow.flag = false;
                } else {
                    o.top += (snow.speed + o.offsetTop);
                    o.left += o.offsetLeft;
                    snow.pos(o);
                }
            };
            n += 1;
            if (snow.flag && n >= snow.density / snow.speed) {
                n = 0;
                for (var a = 0; a < snow.frequency; a++) {
                    snow.list.push(snow.item());
                }
            };
            snow.render.render(snow.stage);
            if ("requestAnimationFrame" in window) {
                requestAnimationFrame(function () { snow.ani(n) });
            }
        }
    };
    return {
        init: function (p) {
            p = p ? p : {};
            snow.img = p.img;
            document.body.appendChild(snow.render.view);
            snow.ani(0);
        }
    }
})();