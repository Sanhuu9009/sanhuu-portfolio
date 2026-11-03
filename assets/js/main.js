/**
 * 三虎 Loui Yue — 页面逻辑
 * 纯原生 JS，无依赖、无构建步骤。所有内容来自 window.SITE_DATA（data.js）。
 *
 * 模块（按执行顺序）：
 *   bindBasics      —— 名字、年份等简单绑定
 *   renderHero      —— 首屏内容（上线版层），并复制出设计稿层
 *   initSplit       —— 设计稿/上线版拖动对比 + 自动标注
 *   renderWork      —— 作品网格 + 筛选
 *   renderStack / renderExperience / renderProcess / renderAbout / renderContact
 *   initPanel       —— 项目详情面板，hash 路由 #project/<slug>
 *   initNav / initTheme
 */
(function () {
  "use strict";

  var D = window.SITE_DATA;
  if (!D) { console.error("SITE_DATA 未加载：检查 assets/js/data.js"); return; }

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** 转义，所有来自 data.js 的文本插入 innerHTML 前都要经过它 */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  /** 只允许 http(s)、mailto 和站内相对路径，防止 javascript: 链接 */
  function safeUrl(u) {
    u = String(u || "").trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) && !/^(https?:|mailto:)/i.test(u)) return "#";
    return u || "#";
  }

  /* ---------------- 基础绑定 ---------------- */
  function bindBasics() {
    $$('[data-bind]').forEach(function (el) {
      var key = el.getAttribute("data-bind");
      if (D.site[key] != null) el.textContent = D.site[key];
    });
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------------- 首屏 ---------------- */
  function renderHero() {
    var s = D.site;
    var a = s.availability || {};
    var html =
      '<div class="hero-inner">' +
        '<p class="hero-status' + (a.available ? "" : " is-off") + '" data-spec="Status">' + esc(a.text || "") + "</p>" +
        '<h1 class="hero-name" data-spec="Display / H1" data-spec-type="text">' +
          '<span class="cn" data-spec="CN 900" data-spec-type="text">' + esc(s.nameCn) + "</span>" +
          '<span class="en">' + esc(s.nameEn) + "<small>" + esc(s.role) + "，" + esc(s.roleEn) + "</small></span>" +
        "</h1>" +
        '<p class="hero-lede" data-spec="Lede" data-spec-type="text">' + esc(s.lede) + "</p>" +
        '<div class="hero-actions" data-spec="Actions">' +
          '<a class="btn btn-solid" href="#work">看作品</a>' +
          '<a class="btn btn-ghost" href="mailto:' + esc(s.email) + '">发邮件给我</a>' +
        "</div>" +
      "</div>";
    var built = $("#heroBuilt");
    var spec = $("#heroSpec");
    built.innerHTML = html;
    spec.innerHTML = html;
    spec.setAttribute("inert", "");
    // 设计稿层里的链接不可聚焦
    $$("a", spec).forEach(function (el) { el.setAttribute("tabindex", "-1"); });
  }

  /* ---------------- 设计稿/上线版对比 ---------------- */
  function initSplit() {
    var stage = $("#heroStage");
    var spec = $("#heroSpec");
    var handle = $("#split");
    var current = 100;
    var dragging = false;

    function setSplit(pct) {
      current = Math.max(0, Math.min(100, pct));
      stage.style.setProperty("--split", current + "%");
      handle.setAttribute("aria-valuenow", String(Math.round(current)));
      handle.setAttribute("aria-valuetext", "设计稿占 " + Math.round(current) + "%");
    }

    function pctFromEvent(e) {
      var r = stage.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    }

    handle.addEventListener("pointerdown", function (e) {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
      cancelIntro();
    });
    handle.addEventListener("pointermove", function (e) { if (dragging) setSplit(pctFromEvent(e)); });
    handle.addEventListener("pointerup", function () { dragging = false; });
    handle.addEventListener("pointercancel", function () { dragging = false; });
    handle.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 2;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") { setSplit(current - step); e.preventDefault(); }
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") { setSplit(current + step); e.preventDefault(); }
      else if (e.key === "Home") { setSplit(0); e.preventDefault(); }
      else if (e.key === "End") { setSplit(100); e.preventDefault(); }
      else return;
      cancelIntro();
    });

    // 入场：从全部设计稿扫到静止位置（页面唯一的自动动画）
    // 静止位置：切在「三虎」中间，让访客同时看到两种状态
    var rest = 46;
    var cn = $(".cn", $("#heroBuilt"));
    if (cn) {
      var sr = stage.getBoundingClientRect(), cr = cn.getBoundingClientRect();
      rest = ((cr.left + cr.width * 0.5 - sr.left) / sr.width) * 100;
      rest = Math.max(22, Math.min(70, rest));
    }
    var raf = 0;
    function cancelIntro() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    if (reduceMotion) {
      setSplit(rest);
    } else {
      setSplit(100);
      var t0 = 0, dur = 1700, delay = 450;
      var tick = function (t) {
        if (!t0) t0 = t;
        var p = Math.min(1, Math.max(0, (t - t0 - delay) / dur));
        var eased = 1 - Math.pow(1 - p, 4);
        setSplit(100 - (100 - rest) * eased);
        raf = p < 1 ? requestAnimationFrame(tick) : 0;
      };
      raf = requestAnimationFrame(tick);
    }

    // 标注：根据真实排版自动测量
    function drawSpec() {
      var old = $(".spec-anno", spec);
      if (old) old.remove();
      var layer = document.createElement("div");
      layer.className = "spec-anno";
      var sRect = spec.getBoundingClientRect();
      var inner = $(".hero-inner", spec).getBoundingClientRect();

      // 12 栏网格示意（只画奇数栏，避免太满）
      var cols = window.innerWidth < 760 ? 4 : 12;
      var gap = window.innerWidth < 760 ? 16 : 24;
      var colW = (inner.width - gap * (cols - 1)) / cols;
      for (var c = 0; c < cols; c += 2) {
        var col = document.createElement("div");
        col.className = "spec-col";
        col.style.left = (inner.left - sRect.left + c * (colW + gap)) + "px";
        col.style.width = colW + "px";
        layer.appendChild(col);
      }

      var flow = [];
      $$("[data-spec]", spec).forEach(function (el) {
        if (el.classList.contains("hero-name")) { flow.push(el); return; } // 整体标题只量间距，不加框
        var r = el.getBoundingClientRect();
        var box = document.createElement("div");
        box.className = "spec-box";
        box.style.left = (r.left - sRect.left) + "px";
        box.style.top = (r.top - sRect.top) + "px";
        box.style.width = r.width + "px";
        box.style.height = r.height + "px";
        var label = el.getAttribute("data-spec");
        if (el.getAttribute("data-spec-type") === "text") {
          var cs = getComputedStyle(el);
          label += "  " + Math.round(parseFloat(cs.fontSize)) + "/" + cs.fontWeight;
        }
        box.innerHTML = '<span class="spec-tag">' + esc(label) + "</span>" +
          '<span class="spec-dim">' + Math.round(r.width) + " × " + Math.round(r.height) + "</span>";
        layer.appendChild(box);
        if (el.parentElement && el.parentElement.classList.contains("hero-inner")) flow.push(el);
      });

      // 相邻元素之间的垂直间距
      flow.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
      for (var i = 0; i < flow.length - 1; i++) {
        var a = flow[i].getBoundingClientRect(), b = flow[i + 1].getBoundingClientRect();
        var g = Math.round(b.top - a.bottom);
        if (g < 10) continue;
        var m = document.createElement("div");
        m.className = "spec-gap";
        m.style.left = (inner.left - sRect.left - 14) + "px";
        m.style.top = (a.bottom - sRect.top) + "px";
        m.style.height = g + "px";
        m.innerHTML = "<span>" + g + "</span>";
        layer.appendChild(m);
      }
      spec.appendChild(layer);
    }

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(drawSpec, 120);
    });
    // 字体加载后行高会变，重新测量
    drawSpec();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawSpec);
  }

  /* ---------------- 占位封面 ---------------- */
  function placeholderCover(p) {
    var kind = p.placeholder || "web";
    var inner = "";
    if (kind === "dashboard") {
      var bars = [42, 64, 50, 78, 58, 88, 70, 95, 62, 80].map(function (h) { return '<i style="height:' + h + '%"></i>'; }).join("");
      inner = '<div class="ph-frame ph-dash">' +
        '<div class="side"><span class="ph-bar ph-strong"></span><span class="ph-bar"></span><span class="ph-bar"></span><span class="ph-bar"></span><span class="ph-bar"></span></div>' +
        '<div class="main"><div class="kpis"><span class="ph-bar"></span><span class="ph-bar"></span><span class="ph-bar"></span></div><div class="chart">' + bars + "</div></div></div>";
    } else if (kind === "mobile") {
      var phone = '<div class="ph-phone"><span class="ph-bar ph-strong"></span><span class="ph-bar"></span><span class="ph-bar" style="width:60%"></span><div class="grid2"><span class="ph-bar"></span><span class="ph-bar"></span><span class="ph-bar"></span><span class="ph-bar"></span></div></div>';
      inner = '<div class="ph-frame ph-mobile">' + phone + phone + "</div>";
    } else if (kind === "brand") {
      inner = '<div class="ph-frame ph-brand"><div class="mark"><i></i></div>' +
        '<div class="swatches"><i style="background:' + esc(p.tone) + '"></i><i style="background:#F3EEE3"></i><i style="background:#1E2A24"></i></div></div>';
    } else {
      inner = '<div class="ph-frame ph-web">' +
        '<div class="nav-row"><i class="ph-bar ph-strong" style="width:14%"></i><i class="ph-bar" style="width:36%"></i></div>' +
        '<span class="ph-bar ph-strong" style="width:62%;justify-self:start"></span>' +
        '<div class="row"><span class="ph-bar"></span><span class="ph-bar"></span><span class="ph-bar"></span></div></div>';
    }
    return '<div class="ph" style="--tone:' + esc(p.tone || "") + '" role="img" aria-label="' + esc(p.title) + ' 封面占位图">' + inner + "</div>";
  }

  function coverHTML(p, eager) {
    if (p.cover) {
      return '<img src="' + esc(safeUrl(p.cover)) + '" alt="' + esc(p.title) + ' 封面" ' + (eager ? "" : 'loading="lazy" ') + 'decoding="async">';
    }
    return placeholderCover(p);
  }

  /* ---------------- 作品 ---------------- */
  var activeFilter = "全部";

  function renderWork() {
    var grid = $("#workGrid");
    var projects = D.projects || [];
    $("#workCount").textContent = projects.length ? "共 " + projects.length + " 个项目，点击查看详情。" : "作品整理中。";

    grid.innerHTML = projects.map(function (p) {
      var tags = (p.disciplines || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");
      return '<article class="card ' + (p.size === "wide" ? "size-wide" : "size-normal") + '" data-tags="' + esc((p.disciplines || []).join("|")) + '">' +
        '<a class="card-link" href="#project/' + esc(p.slug) + '">' +
          '<div class="card-cover">' + coverHTML(p) + "</div>" +
          '<div class="card-body">' +
            '<h3 class="card-title">' + esc(p.title) + "</h3>" +
            '<span class="card-year">' + esc(p.year) + "</span>" +
            '<p class="card-sum">' + esc(p.summary) + "</p>" +
            '<p class="card-tags">' + tags + "</p>" +
          "</div>" +
        "</a></article>";
    }).join("");

    // 筛选项：从所有项目的 disciplines 自动汇总
    var counts = {};
    projects.forEach(function (p) { (p.disciplines || []).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; }); });
    var names = ["全部"].concat(Object.keys(counts));
    counts["全部"] = projects.length;
    var filters = $("#filters");
    filters.innerHTML = names.map(function (n) {
      return '<button class="filter" type="button" aria-pressed="' + (n === activeFilter) + '" data-filter="' + esc(n) + '">' +
        esc(n) + '<span class="count">' + counts[n] + "</span></button>";
    }).join("");
    if (names.length <= 2) filters.hidden = true;

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      activeFilter = btn.getAttribute("data-filter");
      $$(".filter", filters).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      var shown = 0;
      $$(".card", grid).forEach(function (card) {
        var tags = card.getAttribute("data-tags").split("|");
        var ok = activeFilter === "全部" || tags.indexOf(activeFilter) > -1;
        card.hidden = !ok;
        if (ok) shown++;
      });
      $("#workEmpty").hidden = shown > 0;
    });
  }

  /* ---------------- 服务层级 ---------------- */
  function renderStack() {
    $("#stackList").innerHTML = (D.stack || []).map(function (s, i) {
      return '<div class="stack-row" style="--depth:' + i + '">' +
        '<h3 class="stack-name">' + esc(s.layer) + "</h3>" +
        "<div><p class=\"stack-desc\">" + esc(s.desc) + '</p><p class="stack-deliver">' +
          (s.deliver || []).map(function (d) { return '<span class="tag">' + esc(d) + "</span>"; }).join("") + "</p></div>" +
        '<p class="stack-tools"><strong>常用工具</strong>' + esc((s.tools || []).join("、")) + "</p>" +
      "</div>";
    }).join("");
  }

  /* ---------------- 经历 ---------------- */
  function renderExperience() {
    var rows = (D.experience || []).map(function (e) {
      return '<div class="exp-row" role="row">' +
        '<span class="exp-period" role="cell">' + esc(e.period) + "</span>" +
        '<span class="exp-client" role="cell">' + esc(e.client) + "</span>" +
        '<span class="exp-scope" role="cell">' + esc(e.scope) + "</span>" +
        '<span class="exp-note" role="cell">' + esc(e.note) + "</span>" +
      "</div>";
    }).join("");
    $("#expList").innerHTML =
      '<div class="exp-row is-head" role="row"><span role="columnheader">时间</span><span role="columnheader">客户</span><span role="columnheader">交付范围</span><span role="columnheader">合作方式</span></div>' + rows;
  }

  function renderProcess() {
    $("#processList").innerHTML = (D.process || []).map(function (p) {
      return '<li class="step"><div class="step-top"><span class="step-num" aria-hidden="true"></span></div>' +
        '<p class="step-title">' + esc(p.title) + "</p>" +
        '<p class="step-text">' + esc(p.text) + "</p>" +
        (p.time ? '<p class="step-time">' + esc(p.time) + "</p>" : "") +
      "</li>";
    }).join("");
  }

  /* ---------------- 关于 ---------------- */
  function renderAbout() {
    var a = D.about || {};
    $("#aboutBody").innerHTML = (a.paragraphs || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    $("#toolList").innerHTML = (a.toolGroups || []).map(function (g) {
      return "<div><dt>" + esc(g.name) + "</dt><dd>" + esc((g.items || []).join("、")) + "</dd></div>";
    }).join("");
  }

  /* ---------------- 联系 ---------------- */
  function renderContact() {
    var s = D.site;
    var link = $("#mailLink");
    link.href = "mailto:" + s.email;
    link.textContent = s.email;
    $("#replyNote").textContent = s.replyNote || "";

    var status = $("#copyStatus");
    var timer = 0;
    $("#copyMail").addEventListener("click", function () {
      var done = function () {
        status.textContent = "已复制 " + s.email;
        clearTimeout(timer);
        timer = setTimeout(function () { status.textContent = ""; }, 2400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(s.email).then(done, function () { fallbackCopy(s.email); done(); });
      } else { fallbackCopy(s.email); done(); }
    });

    $("#socials").innerHTML = (s.socials || []).filter(function (x) { return x.url; }).map(function (x) {
      return '<li><a href="' + esc(safeUrl(x.url)) + '" target="_blank" rel="noopener">' + esc(x.label) + "</a></li>";
    }).join("");
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove();
  }

  /* ---------------- 项目详情面板 ---------------- */
  function initPanel() {
    var panel = $("#panel");
    var body = $("#panelBody");
    var projects = D.projects || [];
    var lastFocus = null;

    function find(slug) {
      for (var i = 0; i < projects.length; i++) if (projects[i].slug === slug) return i;
      return -1;
    }

    function render(i) {
      var p = projects[i];
      var prev = projects[(i - 1 + projects.length) % projects.length];
      var next = projects[(i + 1) % projects.length];
      var meta = [
        ["客户", p.client], ["年份", p.year], ["负责内容", p.role], ["技术与工具", (p.stack || []).join("、")]
      ].filter(function (m) { return m[1]; });

      body.innerHTML =
        '<div class="panel-top"><span class="panel-crumb">作品 ' + (i + 1) + " / " + projects.length + "</span>" +
          '<button class="btn btn-small btn-ghost" type="button" data-close>关闭</button></div>' +
        '<h2 id="panelTitle">' + esc(p.title) + "</h2>" +
        '<p class="panel-sum">' + esc(p.summary) + "</p>" +
        '<dl class="panel-meta">' + meta.map(function (m) { return "<div><dt>" + esc(m[0]) + "</dt><dd>" + esc(m[1]) + "</dd></div>"; }).join("") + "</dl>" +
        '<div class="card-cover' + (p.size === "wide" ? " is-wide" : "") + '">' + coverHTML(p, true) + "</div>" +
        '<div class="panel-body">' + (p.body || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>" +
        ((p.highlights || []).length ? '<h3 class="panel-h">重点</h3><ul class="panel-list">' +
          p.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" : "") +
        ((p.gallery || []).length ? '<div class="panel-gallery">' +
          p.gallery.map(function (g, k) { return '<img src="' + esc(safeUrl(g)) + '" alt="' + esc(p.title) + " 图 " + (k + 1) + '" loading="lazy" decoding="async">'; }).join("") + "</div>" : "") +
        ((p.links || []).length ? '<div class="panel-links">' +
          p.links.map(function (l) { return '<a class="btn btn-solid" href="' + esc(safeUrl(l.url)) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>"; }).join("") + "</div>" : "") +
        (projects.length > 1 ?
          '<nav class="panel-nav" aria-label="切换项目">' +
            '<a href="#project/' + esc(prev.slug) + '"><span>上一个</span><strong>' + esc(prev.title) + "</strong></a>" +
            '<a class="next" href="#project/' + esc(next.slug) + '"><span>下一个</span><strong>' + esc(next.title) + "</strong></a>" +
          "</nav>" : "");
      panel.scrollTop = 0;
    }

    function open(slug) {
      var i = find(slug);
      if (i < 0) return false;
      render(i);
      document.title = projects[i].title + "｜" + D.site.nameCn + " " + D.site.nameEn;
      if (!panel.open) {
        lastFocus = document.activeElement;
        panel.showModal();
      }
      var closeBtn = $("[data-close]", body);
      if (closeBtn) closeBtn.focus();
      return true;
    }

    function close() {
      if (panel.open) panel.close();
    }

    panel.addEventListener("close", function () {
      document.title = D.site.nameCn + " " + D.site.nameEn + "｜" + D.site.role;
      if (/^#project\//.test(location.hash)) history.replaceState(null, "", location.pathname + location.search + "#work");
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    });
    panel.addEventListener("click", function (e) {
      if (e.target === panel) close(); // 点击遮罩
      if (e.target.closest("[data-close]")) close();
    });

    function route() {
      var m = location.hash.match(/^#project\/([\w-]+)$/);
      if (m) { if (!open(m[1])) close(); }
      else close();
    }
    window.addEventListener("hashchange", route);
    route();
  }

  /* ---------------- 导航 ---------------- */
  function initNav() {
    var nav = $("#nav");
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var links = $("#navLinks");
    var btn = $("#menuBtn");
    btn.addEventListener("click", function () {
      var openNow = !links.classList.contains("is-open");
      links.classList.toggle("is-open", openNow);
      btn.setAttribute("aria-expanded", String(openNow));
      btn.setAttribute("aria-label", openNow ? "关闭菜单" : "打开菜单");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) { links.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }
    });

    // 当前所在区块高亮
    if ("IntersectionObserver" in window) {
      var map = {};
      $$("a", links).forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var a = map[en.target.id];
          if (!a) return;
          if (en.isIntersecting) {
            $$("a", links).forEach(function (x) { x.classList.remove("is-active"); });
            a.classList.add("is-active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* ---------------- 主题 ---------------- */
  function initTheme() {
    var root = document.documentElement;
    $("#themeToggle").addEventListener("click", function () {
      var cur = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------------- 启动 ---------------- */
  bindBasics();
  renderHero();
  initSplit();
  renderWork();
  renderStack();
  renderExperience();
  renderProcess();
  renderAbout();
  renderContact();
  initNav();
  initTheme();
  initPanel();
})();
