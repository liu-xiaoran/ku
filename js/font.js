! function (e, t) {
    var i = e.documentElement,
        n = "orientationchange" in window ? "orientationchange" : "resize",
        a = navigator.userAgent.match(/iphone|ipad|ipod/i),
        d = function () {
            var e = i.clientWidth,
                t = i.clientHeight;
            e && (e >= 750 && (e = 750), i.style.fontSize = 100 * (e / 750) + "px", i.dataset.percent = 100 * (e / 750), i.dataset.width = e, i.dataset.height = t)
        };
    d(), a && e.documentElement.classList.add("iosx" + t.devicePixelRatio), e.addEventListener && t.addEventListener(n, d, !1)
}(document, window)