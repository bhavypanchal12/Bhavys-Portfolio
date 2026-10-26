/* ============================================================
   BHAVY PANCHAL — Immersive Portfolio Engine
   Lenis · GSAP ScrollTrigger · Three.js shader centerpiece
   ============================================================ */
(function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.matchMedia('(max-width: 860px)').matches;
    var isTouch = window.matchMedia('(hover: none)').matches;

    /* ============================================================
       1. LENIS SMOOTH SCROLL
       ============================================================ */
    var lenis = null;
    if (typeof Lenis !== 'undefined' && !reduce) {
        lenis = new Lenis({
            duration: 1.25,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            smoothWheel: true,
            touchMultiplier: 1.6
        });
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
            gsap.ticker.lagSmoothing(0);
        } else {
            (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
        }
    }

    /* ============================================================
       2. PRELOADER
       ============================================================ */
    var preloader = document.getElementById('preloader');
    var preCount = document.getElementById('preCount');
    var preBar = document.getElementById('preBar');
    var progress = { v: 0 };

    function startExperience() {
        if (preloader) preloader.classList.add('done');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
        playHero();
    }

    if (lenis) lenis.stop();

    if (typeof gsap !== 'undefined') {
        gsap.to(progress, {
            v: 100,
            duration: 1.9,
            ease: 'power2.inOut',
            onUpdate: function () {
                var p = Math.round(progress.v);
                if (preCount) preCount.textContent = p;
                if (preBar) preBar.style.width = p + '%';
            },
            onComplete: function () {
                gsap.delayedCall(0.25, startExperience);
            }
        });
    } else {
        var fake = setInterval(function () {
            progress.v += 7;
            if (progress.v >= 100) {
                progress.v = 100;
                clearInterval(fake);
                if (preCount) preCount.textContent = '100';
                if (preBar) preBar.style.width = '100%';
                setTimeout(startExperience, 300);
            } else {
                if (preCount) preCount.textContent = Math.round(progress.v);
                if (preBar) preBar.style.width = progress.v + '%';
            }
        }, 60);
    }
    // Hard fallback
    setTimeout(function () {
        if (preloader && !preloader.classList.contains('done')) startExperience();
    }, 4000);

    /* ============================================================
       3. CUSTOM CURSOR
       ============================================================ */
    var cursor = document.getElementById('cursor');
    var cursorLabel = document.getElementById('cursorLabel');
    if (cursor && !isTouch && !reduce) {
        var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        var tx = cx, ty = cy;
        window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
        (function cursorLoop() {
            cx += (tx - cx) * 0.18;
            cy += (ty - cy) * 0.18;
            cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
            requestAnimationFrame(cursorLoop);
        })();
        document.querySelectorAll('[data-cursor]').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('grow');
                if (cursorLabel) cursorLabel.textContent = el.getAttribute('data-cursor');
            });
            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('grow');
                if (cursorLabel) cursorLabel.textContent = '';
            });
        });
    } else if (cursor) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    /* ============================================================
       4. SPLIT TEXT HELPERS
       ============================================================ */
    function splitLines(el) {
        var original = el.innerHTML;
        try {
            var text = el.textContent.trim().replace(/\s+/g, ' ');
            var words = text.split(' ');
            el.innerHTML = '';
            var spans = words.map(function (w) {
                var s = document.createElement('span');
                s.textContent = w + ' ';
                s.style.display = 'inline-block';
                el.appendChild(s);
                return s;
            });
            // Group into visual lines by offsetTop
            var lines = [];
            var currentTop = null;
            var currentLine = [];
            spans.forEach(function (s) {
                var top = s.offsetTop;
                if (currentTop === null) currentTop = top;
                if (Math.abs(top - currentTop) > 4) {
                    lines.push(currentLine);
                    currentLine = [];
                    currentTop = top;
                }
                currentLine.push(s);
            });
            if (currentLine.length) lines.push(currentLine);
            el.innerHTML = '';
            return lines.map(function (lineWords) {
                var line = document.createElement('span');
                line.className = 'line';
                var inner = document.createElement('span');
                inner.className = 'line-inner';
                inner.textContent = lineWords.map(function (s) { return s.textContent; }).join('').replace(/\s+$/, '');
                line.appendChild(inner);
                el.appendChild(line);
                return inner;
            });
        } catch (err) {
            // Never leave the text destroyed — restore original
            el.innerHTML = original;
            return [];
        }
    }

    /* ============================================================
       5. HERO INTRO
       ============================================================ */
    function playHero() {
        if (typeof gsap === 'undefined') {
            document.querySelectorAll('.ht-word').forEach(function (w) { w.style.transform = 'none'; });
            document.querySelectorAll('.hero .reveal').forEach(function (el) { el.classList.add('in'); });
            return;
        }
        var tl = gsap.timeline();
        tl.to('.hero-title .ht-word', {
            rotateX: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.1
        })
        .from('.hero-top', { opacity: 0, y: -14, duration: 0.8, ease: 'power2.out' }, '-=0.8')
        .from('.hero-desc', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.7')
        .from('.hero-scroll', { opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-index', { opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.nav', { opacity: 0, y: -20, duration: 0.9, ease: 'power2.out' }, '-=1.1');
    }

    /* ============================================================
       5b. REVEAL SYSTEM (IntersectionObserver — runs FIRST so a
           later GSAP error can never leave sections blank)
       ============================================================ */
    (function revealSystem() {
        var els = document.querySelectorAll('.reveal');
        if (!els.length) return;
        if (!('IntersectionObserver' in window) || reduce) {
            els.forEach(function (el) { el.classList.add('in'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
        els.forEach(function (el) { io.observe(el); });
        // Safety: force-show anything in/near viewport after 3s, clear blocking inline styles
        var sweep = function () {
            document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
                var r = el.getBoundingClientRect();
                if (r.top < window.innerHeight * 1.25 && r.bottom > -150) {
                    el.classList.add('in');
                    if (el.style.opacity && parseFloat(el.style.opacity) < 0.05) el.style.opacity = '';
                    if (el.style.transform) el.style.transform = '';
                }
            });
        };
        setTimeout(sweep, 3000);
        setTimeout(sweep, 6000);
    })();

    /* ============================================================
       6. SCROLL ANIMATIONS (GSAP) — wrapped in try/catch so a
           failure here never breaks page visibility
       ============================================================ */
    try {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Scroll progress bar
        var sp = document.getElementById('scrollProgress');
        if (sp) {
            ScrollTrigger.create({
                start: 0, end: 'max',
                onUpdate: function (self) { sp.style.width = (self.progress * 100) + '%'; }
            });
        }

        // Nav bg on scroll
        var nav = document.getElementById('nav');
        ScrollTrigger.create({
            start: 60,
            onUpdate: function (self) {
                if (nav) nav.classList.toggle('scrolled', self.scroll() > 60);
            }
        });

        // Generic reveals handled by IntersectionObserver (section 6b) — no ScrollTrigger needed

        // Manifesto line-by-line reveal (robust: after fonts, with safety fallback)
        var mText = document.querySelector('[data-splitlines]');
        if (mText) {
            var setupManifesto = function () {
                try {
                    var inners = splitLines(mText);
                    if (!inners.length) return; // split failed → text untouched & visible
                    gsap.set(inners, { yPercent: 110 });
                    var played = false;
                    var play = function () {
                        if (played) return;
                        played = true;
                        gsap.to(inners, {
                            yPercent: 0,
                            duration: 1.1,
                            ease: 'expo.out',
                            stagger: 0.09
                        });
                    };
                    // Safety registered BEFORE ScrollTrigger — guarantees reveal
                    setTimeout(play, 1800);
                    ScrollTrigger.create({
                        trigger: mText,
                        start: 'top 85%',
                        once: true,
                        onEnter: play
                    });
                } catch (err) {
                    // Restore full visibility if anything fails
                    mText.style.opacity = '1';
                    mText.style.transform = 'none';
                    mText.querySelectorAll('.line-inner').forEach(function (w) {
                        w.style.transform = 'none';
                        w.style.opacity = '1';
                    });
                }
            };
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(function () {
                    try { setupManifesto(); } catch (e) {}
                    try { ScrollTrigger.refresh(); } catch (e) {}
                });
            } else {
                setupManifesto();
            }
        }

        // Portrait image parallax scale
        var mImg = document.querySelector('.m-img img');
        if (mImg) {
            gsap.fromTo(mImg,
                { yPercent: -8, scale: 1.25 },
                {
                    yPercent: 8, scale: 1.1,
                    ease: 'none',
                    scrollTrigger: { trigger: '.m-portrait', start: 'top bottom', end: 'bottom top', scrub: true }
                }
            );
        }

        // Counters
        document.querySelectorAll('[data-count]').forEach(function (el) {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: function () {
                    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
                    var obj = { v: 0 };
                    gsap.to(obj, {
                        v: target,
                        duration: 1.6,
                        ease: 'power3.out',
                        onUpdate: function () { el.textContent = Math.round(obj.v); }
                    });
                }
            });
        });

        // ===== HORIZONTAL WORK SCROLL =====
        var track = document.getElementById('workTrack');
        var pin = document.getElementById('workPin');
        if (track && pin && !isMobile) {
            var getDist = function () { return track.scrollWidth - window.innerWidth + 64; };
            gsap.to(track, {
                x: function () { return -getDist(); },
                ease: 'none',
                scrollTrigger: {
                    trigger: pin,
                    start: 'top top',
                    end: function () { return '+=' + getDist(); },
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });
            // 3D tilt per card based on viewport position
            var cards = gsap.utils.toArray('.w-card');
            ScrollTrigger.create({
                trigger: pin,
                start: 'top top',
                end: function () { return '+=' + getDist(); },
                scrub: true,
                onUpdate: function (self) {
                    var p = self.progress;
                    cards.forEach(function (card, i) {
                        var center = (i + 0.5) / cards.length;
                        var d = p - center;
                        gsap.set(card, {
                            rotationY: gsap.utils.clamp(-16, 16, d * -70),
                            rotationX: gsap.utils.clamp(-5, 5, d * 16),
                            z: -Math.abs(d) * 160,
                            transformPerspective: 1400
                        });
                    });
                }
            });
        } else if (track && pin) {
            // Mobile: horizontal free scroll
            pin.style.overflowX = 'auto';
        }

        // Expertise items — reveal handled by IntersectionObserver (.reveal class)
        // NOTE: do NOT gsap.from here — elements have .reveal (opacity:0) and a from-tween
        // would capture end value 0 and set inline opacity:0 forever (invisible).

        // Contact title lines (safe: CSS keeps them visible; animate only if gsap ok)
        var cWords = document.querySelectorAll('.c-title .ht-word');
        if (cWords.length) {
            gsap.set(cWords, { rotateX: -90, transformOrigin: 'center top' });
            var cPlayed = false;
            var cPlay = function () {
                if (cPlayed) return;
                cPlayed = true;
                gsap.to(cWords, { rotateX: 0, duration: 1.15, ease: 'expo.out', stagger: 0.1 });
            };
            ScrollTrigger.create({
                trigger: '.c-title',
                start: 'top 88%',
                once: true,
                onEnter: cPlay
            });
            setTimeout(function () {
                cPlay();
            }, 3000);
        }

        // Footer big text scrub
        gsap.fromTo('.f-big',
            { xPercent: 8 },
            {
                xPercent: -8,
                ease: 'none',
                scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true }
            }
        );

        // ===== GLOBAL SAFETY NET =====
        // After 4s, force-show any .reveal still hidden near/in viewport
        setTimeout(function () {
            document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
                var r = el.getBoundingClientRect();
                if (r.top < window.innerHeight * 1.05 && r.bottom > 0) el.classList.add('in');
            });
            ScrollTrigger.refresh();
        }, 4000);

        // Refresh after fonts fully load (prevents wrong measurements)
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () {
                ScrollTrigger.refresh();
            });
        }
        window.addEventListener('load', function () {
            ScrollTrigger.refresh();
        });
    }
    } catch (gsapErr) {
        if (typeof console !== 'undefined') console.warn('Scroll animations disabled:', gsapErr);
        // Reveal system (5b) already guarantees visibility — clear any stuck hidden text
        document.querySelectorAll('[data-splitlines], .c-title').forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.querySelectorAll('.ht-word, .line-inner').forEach(function (w) {
                w.style.transform = 'none';
                w.style.opacity = '1';
            });
        });
    }

    /* ============================================================
       7. MAGNETIC ELEMENTS
       ============================================================ */
    if (!isTouch && !reduce) {
        document.querySelectorAll('[data-magnetic]').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var x = e.clientX - r.left - r.width / 2;
                var y = e.clientY - r.top - r.height / 2;
                el.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.3 + 'px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });
    }

    /* ============================================================
       8. MOBILE MENU
       ============================================================ */
    var burger = document.getElementById('navBurger');
    var overlay = document.getElementById('menuOverlay');
    if (burger && overlay) {
        burger.addEventListener('click', function () {
            var open = overlay.classList.toggle('open');
            burger.classList.toggle('open', open);
            if (lenis) open ? lenis.stop() : lenis.start();
            document.body.style.overflow = open ? 'hidden' : '';
        });
        overlay.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                overlay.classList.remove('open');
                burger.classList.remove('open');
                if (lenis) lenis.start();
                document.body.style.overflow = '';
            });
        });
    }

    /* ============================================================
       9. ANCHOR SCROLL
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = a.getAttribute('href');
            if (id.length < 2) return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(target, { offset: -20, duration: 1.6 });
            } else {
                target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            }
        });
    });

    /* ============================================================
       10. YEAR
       ============================================================ */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ============================================================
       11. THREE.JS — IRIDESCENT SHADER CENTERPIECE
       ============================================================ */
    (function initGL() {
        if (typeof THREE === 'undefined' || reduce) return;
        var canvas = document.getElementById('gl');
        if (!canvas) return;
        try {

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 9);

        // ---------- Custom shader (simplex noise displaced icosphere) ----------
        var vert = [
            'uniform float uTime;',
            'uniform float uScroll;',
            'uniform vec2 uMouse;',
            'varying vec3 vNormalW;',
            'varying vec3 vViewDir;',
            'varying float vDisp;',
            // simplex noise 3d (Ashima)
            'vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}',
            'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}',
            'float snoise(vec3 v){',
            '  const vec2 C = vec2(1.0/6.0, 1.0/3.0);',
            '  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);',
            '  vec3 i  = floor(v + dot(v, C.yyy));',
            '  vec3 x0 = v - i + dot(i, C.xxx);',
            '  vec3 g = step(x0.yzx, x0.xyz);',
            '  vec3 l = 1.0 - g;',
            '  vec3 i1 = min(g.xyz, l.zxy);',
            '  vec3 i2 = max(g.xyz, l.zxy);',
            '  vec3 x1 = x0 - i1 + C.xxx;',
            '  vec3 x2 = x0 - i2 + C.yyy;',
            '  vec3 x3 = x0 - D.yyy;',
            '  i = mod(i, 289.0);',
            '  vec4 p = permute(permute(permute(',
            '        i.z + vec4(0.0, i1.z, i2.z, 1.0))',
            '      + i.y + vec4(0.0, i1.y, i2.y, 1.0))',
            '      + i.x + vec4(0.0, i1.x, i2.x, 1.0));',
            '  float n_ = 1.0/7.0;',
            '  vec3 ns = n_ * D.wyz - D.xzx;',
            '  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);',
            '  vec4 x_ = floor(j * ns.z);',
            '  vec4 y_ = floor(j - 7.0 * x_);',
            '  vec4 x = x_ * ns.x + ns.yyyy;',
            '  vec4 y = y_ * ns.x + ns.yyyy;',
            '  vec4 h = 1.0 - abs(x) - abs(y);',
            '  vec4 b0 = vec4(x.xy, y.xy);',
            '  vec4 b1 = vec4(x.zw, y.zw);',
            '  vec4 s0 = floor(b0) * 2.0 + 1.0;',
            '  vec4 s1 = floor(b1) * 2.0 + 1.0;',
            '  vec4 sh = -step(h, vec4(0.0));',
            '  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;',
            '  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;',
            '  vec3 p0 = vec3(a0.xy, h.x);',
            '  vec3 p1 = vec3(a0.zw, h.y);',
            '  vec3 p2 = vec3(a1.xy, h.z);',
            '  vec3 p3 = vec3(a1.zw, h.w);',
            '  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));',
            '  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;',
            '  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);',
            '  m = m * m;',
            '  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));',
            '}',
            'void main(){',
            '  vec3 pos = position;',
            '  float t = uTime * 0.35;',
            '  float n = snoise(position * 1.15 + vec3(t, t * 0.7, uScroll * 2.0));',
            '  float n2 = snoise(position * 2.6 - vec3(t * 0.6));',
            '  float disp = n * 0.32 + n2 * 0.12;',
            '  disp += uScroll * 0.25;',
            '  pos += normal * disp;',
            '  vDisp = disp;',
            '  vec4 world = modelMatrix * vec4(pos, 1.0);',
            '  vNormalW = normalize(mat3(modelMatrix) * normal);',
            '  vViewDir = normalize(cameraPosition - world.xyz);',
            '  gl_Position = projectionMatrix * viewMatrix * world;',
            '}'
        ].join('\n');

        var frag = [
            'uniform float uTime;',
            'uniform float uScroll;',
            'varying vec3 vNormalW;',
            'varying vec3 vViewDir;',
            'varying float vDisp;',
            'vec3 pal(float t){',
            '  return 0.5 + 0.5 * cos(6.28318 * (vec3(1.0, 1.0, 1.0) * t + vec3(0.0, 0.33, 0.67)));',
            '}',
            'void main(){',
            '  vec3 N = normalize(vNormalW);',
            '  vec3 V = normalize(vViewDir);',
            '  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.4);',
            '  float hue = vDisp * 0.9 + uScroll * 0.4 + uTime * 0.03 + dot(N, V) * 0.5;',
            '  vec3 iri = pal(hue);',
            '  vec3 base = vec3(0.035, 0.035, 0.045);',
            '  vec3 col = base + iri * fres * 1.15;',
            '  col += vec3(0.85, 1.0, 0.24) * fres * fres * 0.35;',
            '  float rim = smoothstep(0.35, 1.0, fres);',
            '  col = mix(col, iri * 1.4, rim * 0.5);',
            '  gl_FragColor = vec4(col, 1.0);',
            '}'
        ].join('\n');

        var uniforms = {
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) }
        };

        var geo = new THREE.IcosahedronGeometry(2.1, isMobile ? 3 : 5);
        var mat = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vert, fragmentShader: frag });
        var blob = new THREE.Mesh(geo, mat);
        scene.add(blob);

        // Wireframe halo shell
        var shellGeo = new THREE.IcosahedronGeometry(2.55, 2);
        var shellMat = new THREE.MeshBasicMaterial({
            color: 0xd8ff3e, wireframe: true, transparent: true, opacity: 0.07
        });
        var shell = new THREE.Mesh(shellGeo, shellMat);
        scene.add(shell);

        // Particle field
        var pCount = isMobile ? 320 : 900;
        var pGeo = new THREE.BufferGeometry();
        var pPos = new Float32Array(pCount * 3);
        var pRnd = new Float32Array(pCount);
        for (var i = 0; i < pCount; i++) {
            var r = 3.2 + Math.random() * 5.5;
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pPos[i * 3 + 2] = r * Math.cos(phi);
            pRnd[i] = Math.random();
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('aRnd', new THREE.BufferAttribute(pRnd, 1));
        var pMat = new THREE.PointsMaterial({
            size: 0.022,
            color: 0xf4f1ea,
            transparent: true,
            opacity: 0.55,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        var points = new THREE.Points(pGeo, pMat);
        scene.add(points);

        // Interaction state
        var mouseNX = 0, mouseNY = 0;
        var targetMouseNX = 0, targetMouseNY = 0;
        var scrollProg = 0, targetScrollProg = 0;

        window.addEventListener('mousemove', function (e) {
            targetMouseNX = (e.clientX / window.innerWidth) * 2 - 1;
            targetMouseNY = (e.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });

        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        var clock = new THREE.Clock();
        var blobVisible = true;

        function render() {
            requestAnimationFrame(render);
            var t = clock.getElapsedTime();
            var max = document.documentElement.scrollHeight - window.innerHeight;
            targetScrollProg = max > 0 ? window.scrollY / max : 0;

            mouseNX += (targetMouseNX - mouseNX) * 0.05;
            mouseNY += (targetMouseNY - mouseNY) * 0.05;
            scrollProg += (targetScrollProg - scrollProg) * 0.07;

            uniforms.uTime.value = t;
            uniforms.uScroll.value = scrollProg;
            uniforms.uMouse.value.set(mouseNX, mouseNY);

            // Blob: scroll drives rotation + subtle scale + drifts up
            blob.rotation.y = t * 0.12 + scrollProg * Math.PI * 1.6 + mouseNX * 0.4;
            blob.rotation.x = Math.sin(t * 0.2) * 0.2 + scrollProg * 0.9 + mouseNY * 0.25;
            blob.position.y = -scrollProg * 2.2;
            blob.position.x = mouseNX * 0.35;
            var s = 1 - scrollProg * 0.25;
            blob.scale.setScalar(s);

            shell.rotation.y = -t * 0.08 - scrollProg * Math.PI;
            shell.rotation.z = t * 0.05;
            shell.position.copy(blob.position);
            shell.scale.setScalar(s * (1 + Math.sin(t * 0.8) * 0.02));

            points.rotation.y = t * 0.03 + scrollProg * 0.8;
            points.rotation.x = mouseNY * 0.08;
            pMat.opacity = 0.55 * (1 - scrollProg * 0.6);

            // Camera subtle dolly
            camera.position.z = 9 - scrollProg * 1.8;
            camera.position.x = mouseNX * 0.4;
            camera.position.y = mouseNY * -0.25 + scrollProg * 0.6;
            camera.lookAt(0, -scrollProg * 1.2, 0);

            renderer.render(scene, camera);
        }
        render();
        } catch (err) {
            // WebGL/shader failure should never blank the page
            if (canvas) canvas.style.display = 'none';
            if (typeof console !== 'undefined') console.warn('WebGL disabled:', err);
        }
    })();

})();
