/**
 * The small script of the public pages: the phone menu (dropdown or
 * off-canvas), submenus on touch screens and keyboards, the sliding search
 * box, the "back to top" button and smooth scrolling to anchors.
 */
export const SCRIPT = `(function () {
  'use strict';
  var doc = document, body = doc.body;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
  var popup = doc.getElementById('zn-mobile-popup');
  var header = doc.getElementById('zn-mobile-header');
  var type = header ? header.getAttribute('data-type') : 'dropdown';
  var toggles = $$('#zn-mobile-header .main-header-menu-toggle');

  function setOpen(open) {
    toggles.forEach(function (b) {
      b.classList.toggle('toggled', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (type === 'dropdown') {
      body.classList.toggle('zn-main-header-nav-open', open);
    } else if (popup) {
      body.classList.toggle('zn-popup-nav-open', open);
      body.classList.toggle('zn-main-header-nav-open', open);
      popup.classList.toggle('active', open);
      popup.classList.toggle('show', open);
      if (open) {
        var close = doc.getElementById('menu-toggle-close');
        if (close) close.focus();
      }
    }
  }
  var isOpen = function () { return body.classList.contains('zn-main-header-nav-open'); };
  toggles.forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); setOpen(!isOpen()); });
  });
  if (popup) {
    $$('.zn-mobile-popup-overlay, #menu-toggle-close', popup).forEach(function (el) {
      el.addEventListener('click', function () { setOpen(false); if (toggles[0]) toggles[0].focus(); });
    });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { setOpen(false); if (toggles[0]) toggles[0].focus(); }
  });

  // Submenus: the arrow button opens and closes them (phones, off-canvas, link mode).
  var linkMode = !!doc.querySelector('header.site-header.zn-builder-menu-toggle-link');
  function toggleSub(li, btn) {
    var sub = li.querySelector('.sub-menu');
    if (!sub) return;
    var open = !li.classList.contains('zn-submenu-expanded');
    $$('.menu-item-has-children', li.parentNode).forEach(function (other) {
      if (other !== li) {
        other.classList.remove('zn-submenu-expanded');
        $$('.sub-menu', other).forEach(function (s) { s.style.display = 'none'; });
      }
    });
    $$('.menu-item-has-children', li).forEach(function (child) {
      child.classList.remove('zn-submenu-expanded');
      var s = child.querySelector('.sub-menu');
      if (s) s.style.display = 'none';
    });
    li.classList.toggle('zn-submenu-expanded', open);
    sub.style.display = open ? 'block' : 'none';
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  $$('.zn-menu-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleSub(btn.parentNode, btn);
    });
  });
  if (linkMode) {
    $$('#zn-mobile-header .menu-item-has-children > .menu-link, #zn-mobile-popup .menu-item-has-children > .menu-link').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var li = a.parentNode;
        if (!li.classList.contains('zn-submenu-expanded')) {
          e.preventDefault();
          toggleSub(li, li.querySelector('.zn-menu-toggle'));
        }
      });
    });
  }
  // Keyboard: the desktop submenus open while their item has the focus.
  $$('#zn-desktop-header .menu-item').forEach(function (li) {
    li.addEventListener('focusin', function () { li.classList.add('focus'); });
    li.addEventListener('focusout', function (e) {
      if (!li.contains(e.relatedTarget)) li.classList.remove('focus');
    });
  });
  $$('.zn-header-navigation-arrow').forEach(function (arrow) {
    arrow.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var li = arrow.closest('li');
        var open = !li.classList.contains('focus');
        li.classList.toggle('focus', open);
        arrow.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    });
  });
  // Closing the phone menu when a link to a part of the page is followed.
  $$('#zn-mobile-header .menu-link[href*="#"], #zn-mobile-popup .menu-link[href*="#"]').forEach(function (a) {
    a.addEventListener('click', function () { if (isOpen()) setOpen(false); });
  });

  // Sliding search box.
  $$('.zn-search-menu-icon .zenit-search-icon').forEach(function (icon) {
    var box = icon.closest('.zn-search-menu-icon');
    icon.addEventListener('click', function (e) {
      e.preventDefault();
      box.classList.add('zn-dropdown-active');
      var field = box.querySelector('.search-field');
      if (field) { field.tabIndex = 0; field.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (!box.contains(e.target)) box.classList.remove('zn-dropdown-active');
    });
  });

  // Back to top.
  var top = doc.getElementById('zn-scroll-top');
  if (top) {
    var masthead = doc.getElementById('masthead');
    var update = function () {
      var marker = getComputedStyle(top).content.replace(/[^0-9]/g, '');
      var devices = top.getAttribute('data-on-devices');
      var allowed = devices === 'both' || (devices === 'desktop' && marker === '769') || (devices === 'mobile' && marker === '');
      var limit = masthead ? masthead.offsetHeight + 100 : 300;
      top.style.display = allowed && window.pageYOffset > limit ? 'block' : 'none';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    var go = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    top.addEventListener('click', go);
    top.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  }

  // Sticky header (Zenit Pro): the chosen rows stay at the top once the page passes them.
  var mh = doc.getElementById('masthead');
  if (mh && mh.getAttribute('data-sticky-rows')) {
    var names = mh.getAttribute('data-sticky-rows').split(' ');
    var stickOn = mh.getAttribute('data-sticky-devices');
    var hideOnDown = mh.hasAttribute('data-sticky-hide');
    var stuck = false, hidden = false, lastY = window.pageYOffset, bars = [], start = 0;
    var mobileNow = function () { return body.classList.contains('zn-header-break-point'); };
    var wanted = function () { return stickOn === 'both' || (stickOn === 'mobile') === mobileNow(); };
    var barsNow = function () {
      var root = doc.getElementById(mobileNow() ? 'zn-mobile-header' : 'zn-desktop-header');
      if (!root) return [];
      return names.map(function (n) {
        var wrap = root.querySelector('.zn-' + (n === 'primary' ? 'main' : n) + '-header-wrap');
        return wrap && { wrap: wrap, bar: wrap.firstElementChild };
      }).filter(function (b) { return b && b.bar; });
    };
    var adminBar = function () { var a = doc.getElementById('cleitext-admin-bar'); return a ? a.offsetHeight : 0; };
    var unstick = function () {
      bars.forEach(function (b) { b.wrap.style.minHeight = ''; b.bar.classList.remove('zn-sticky-bar'); b.bar.style.top = ''; });
      mh.classList.remove('zn-header-sticked', 'zn-sticky-hidden');
      mh.removeAttribute('data-sticky-height');
      stuck = hidden = false;
    };
    var stick = function () {
      var top = adminBar();
      bars.forEach(function (b) {
        b.wrap.style.minHeight = b.wrap.offsetHeight + 'px';
        b.bar.classList.add('zn-sticky-bar');
        b.bar.style.top = top + 'px';
        top += b.bar.offsetHeight;
      });
      mh.classList.add('zn-header-sticked');
      mh.setAttribute('data-sticky-height', String(top));
      mh.style.setProperty('--zn-sticky-height', top + 'px');
      stuck = true;
    };
    var measure = function () {
      if (stuck) unstick();
      bars = wanted() ? barsNow() : [];
      start = bars.length ? bars[0].wrap.getBoundingClientRect().top + window.pageYOffset - adminBar() : 0;
      onScroll();
    };
    var onScroll = function () {
      var y = window.pageYOffset;
      if (!bars.length) return;
      if (y > start && !stuck) stick();
      else if (y <= start && stuck) unstick();
      if (stuck && hideOnDown) {
        var down = y > lastY && y > start + 200;
        if (down !== hidden) { hidden = down; mh.classList.toggle('zn-sticky-hidden', down); }
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    measure();
  }

  // Load more (Zenit Pro): the next page's posts are added to the list.
  var more = doc.querySelector('.zn-load-more');
  if (more && window.fetch && window.DOMParser) {
    var list = doc.querySelector('#main .zn-row');
    var busy = false;
    var load = function () {
      var next = more.getAttribute('data-next');
      if (busy || !next || !list) return;
      busy = true;
      more.classList.add('zn-loading');
      fetch(next, { credentials: 'same-origin' }).then(function (res) { return res.text(); }).then(function (html) {
        var page = new DOMParser().parseFromString(html, 'text/html');
        $$('#main .zn-row > article', page).forEach(function (a) { list.appendChild(doc.importNode(a, true)); });
        var nextMore = page.querySelector('.zn-load-more');
        var url = nextMore && nextMore.getAttribute('data-next');
        if (url) { more.setAttribute('data-next', url); more.firstElementChild.setAttribute('href', url); }
        else more.parentNode.removeChild(more);
        busy = false;
        more.classList.remove('zn-loading');
      }).catch(function () { busy = false; more.classList.remove('zn-loading'); });
    };
    more.addEventListener('click', function (e) { if (e.target.closest('a')) { e.preventDefault(); load(); } });
    if (more.getAttribute('data-event') === 'scroll' && window.IntersectionObserver) {
      new IntersectionObserver(function (seen) { if (seen[0].isIntersecting) load(); }, { rootMargin: '400px' }).observe(more);
    }
  }

  // Language switcher dropdowns close on a click elsewhere and on Escape (focus back on them).
  doc.addEventListener('click', function (e) {
    $$('.zn-lang-dropdown[open]').forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); });
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $$('.zn-lang-dropdown[open]').forEach(function (d) {
      d.removeAttribute('open');
      if (d.contains(doc.activeElement)) d.querySelector('summary').focus();
    });
  });

  // Smooth scrolling to the sections of a page.
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    var target = doc.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    if (!target) return;
    e.preventDefault();
    var offset = 0;
    var sticky = doc.querySelector('.zn-header-sticked');
    if (sticky) offset = Number(sticky.getAttribute('data-sticky-height')) || sticky.offsetHeight;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
    history.pushState(null, '', a.getAttribute('href'));
  });
})();`;
