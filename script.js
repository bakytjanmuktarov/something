/* Здесь только логика. Тексты и фото меняются в index.html. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var screens = ["s-intro", "s-env", "s-letter", "s-mem", "s-final"];

  function go(id) {
    screens.forEach(function (s) { $(s).classList.toggle("on", s === id); });
  }

  /* плавающие сердечки на фоне */
  var fl = $("floaters");
  for (var i = 0; i < 9; i++) {
    var f = document.createElement("span");
    f.className = "float";
    f.textContent = "❤";
    f.style.left = (Math.random() * 96) + "%";
    f.style.fontSize = (12 + Math.random() * 18) + "px";
    f.style.animationDuration = (9 + Math.random() * 9) + "s";
    f.style.animationDelay = (-Math.random() * 12) + "s";
    fl.appendChild(f);
  }

  /* абзацы письма появляются по очереди */
  document.querySelectorAll(".letter p").forEach(function (p, i) {
    p.style.setProperty("--i", i);
  });

  /* 1 -> 2 */
  $("go-open").addEventListener("click", function () { go("s-env"); });

  /* 2: конверт. Первый клик открывает, второй открывает письмо */
  var env = $("env"), state = 0;
  env.addEventListener("click", function () {
    if (state === 0) {
      env.classList.add("open");
      state = 1;
      $("env-hint").textContent = "(нажми на письмо, чтобы прочитать)";
      setTimeout(function () { env.classList.add("read"); state = 2; }, 900);
    } else if (state === 2) {
      go("s-letter");
    }
  });

  /* 3 -> 4 */
  $("to-memories").addEventListener("click", function () { go("s-mem"); });

  /* 4: галерея. Считает фото сама, сколько их в index.html */
  var photos = document.querySelectorAll(".photo");
  var dots = $("dots"), cur = 0, seen = {};
  photos.forEach(function () { dots.appendChild(document.createElement("i")); });

  function show(n) {
    cur = (n + photos.length) % photos.length;
    seen[cur] = true;
    photos.forEach(function (el, k) { el.hidden = k !== cur; });
    Array.prototype.forEach.call(dots.children, function (el, k) { el.classList.toggle("on", k === cur); });
    $("to-final").hidden = Object.keys(seen).length < photos.length;
  }
  $("prev").addEventListener("click", function () { show(cur - 1); });
  $("next").addEventListener("click", function () { show(cur + 1); });

  var x0 = null;
  $("s-mem").addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  $("s-mem").addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });
  show(0);

  /* 4 -> 5 */
  $("to-final").addEventListener("click", function () { go("s-final"); });

  /* повтор */
  $("replay").addEventListener("click", function () {
    env.classList.remove("open", "read");
    state = 0;
    $("env-hint").textContent = "(нажми, чтобы открыть конверт)";
    seen = {}; show(0);
    go("s-intro");
  });
})();
