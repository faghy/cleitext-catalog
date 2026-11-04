/* Taccuino: search panel, phone menu, back to top, "load more" of the lists. */
(function () {
  var d = document;
  // Old search addresses of WordPress (/?s=…) open the search page.
  var form = d.querySelector('.tc-search-form');
  var old = /[?&]s=/.test(location.search) && new URLSearchParams(location.search).get('s');
  if (old && form) { location.replace(form.getAttribute('action') + '?q=' + encodeURIComponent(old)); return; }
  var search = d.getElementById('tc-search');
  d.querySelectorAll('[data-tc-search]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!search) return;
      search.hidden = !search.hidden;
      b.setAttribute('aria-expanded', String(!search.hidden));
      if (!search.hidden) { var i = search.querySelector('input'); if (i) i.focus(); }
    });
  });
  var nav = d.getElementById('tc-nav');
  function menu(open) {
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    d.querySelectorAll('[data-tc-menu]').forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
  }
  d.querySelectorAll('[data-tc-menu]').forEach(function (b) { b.addEventListener('click', function () { menu(true); }); });
  d.querySelectorAll('[data-tc-close]').forEach(function (b) { b.addEventListener('click', function () { menu(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { menu(false); if (search) search.hidden = true; } });
  var top = d.querySelector('.tc-to-top');
  if (top) {
    var on = function () { top.classList.toggle('is-on', window.scrollY > 400); };
    window.addEventListener('scroll', on, { passive: true }); on();
    top.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
  d.querySelectorAll('[data-tc-more]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var list = a.closest('.tc-articles, .wp-block-taccuino-blocks-posts');
      list = list && list.querySelector('[data-tc-list]');
      if (!list || !window.fetch || !window.DOMParser) return;
      e.preventDefault();
      a.classList.add('is-loading');
      fetch(a.href, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var more = doc.querySelector('[data-tc-list]');
        if (more) Array.prototype.forEach.call(more.children, function (c) { list.appendChild(d.importNode(c, true)); });
        var next = doc.querySelector('[data-tc-more]');
        if (next) { a.href = next.getAttribute('href'); a.classList.remove('is-loading'); } else { a.parentNode.removeChild(a); }
      }).catch(function () { window.location.href = a.href; });
    });
  });
})();
