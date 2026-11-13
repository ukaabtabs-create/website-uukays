/* ==========================================================================
   UKASYAH 'ABDURROHMAN — Legendo-style behaviors (vanilla JS, shared)
   ========================================================================== */
(function () {
    "use strict";

    var body = document.body;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Preloader ---------- */
    function hidePreloader() {
        var pre = document.querySelector(".preloader");
        if (pre) pre.classList.add("is-done");
    }
    window.addEventListener("load", function () {
        setTimeout(hidePreloader, 250);
    });
    /* Fallback so the page never stays blocked */
    setTimeout(hidePreloader, 3500);

    /* ---------- Frame borders slide in ---------- */
    setTimeout(function () {
        var borders = document.querySelectorAll(".frame-border.pos-off");
        for (var i = 0; i < borders.length; i++) borders[i].classList.remove("pos-off");
    }, 800);

    /* ---------- Scroll states ---------- */
    var heroTitle = document.querySelector(".home-page-title");
    var ticking = false;
    function onScroll() {
        var y = window.scrollY || window.pageYOffset;
        body.classList.toggle("is-scrolled", y > 400);
        if (heroTitle) heroTitle.classList.toggle("title-hide", y > 100);
        updateEnllax(y);
        ticking = false;
    }
    window.addEventListener("scroll", function () {
        if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    /* ---------- Enllax ghost-word horizontal parallax ---------- */
    var enllaxEls = Array.prototype.slice.call(document.querySelectorAll(".enllax-all"));
    function updateEnllax(y) {
        if (reduceMotion) return;
        enllaxEls.forEach(function (el) {
            var ratio = parseFloat(el.getAttribute("data-enllax-ratio") || "0.5");
            var rect = el.parentElement.getBoundingClientRect();
            var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            var shift = (progress - 0.5) * rect.width * ratio;
            el.style.transform = "translateX(calc(-50% + " + shift.toFixed(1) + "px))";
        });
    }

    /* ---------- Mobile navigation ---------- */
    var toggle = document.querySelector(".navbar-toggle");
    if (toggle) {
        toggle.addEventListener("click", function () {
            var open = body.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        document.querySelectorAll(".navbar-nav a").forEach(function (link) {
            link.addEventListener("click", function () {
                body.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
        document.addEventListener("click", function (e) {
            if (body.classList.contains("nav-open") &&
                !e.target.closest(".navbar-nav") && !e.target.closest(".navbar-toggle")) {
                body.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---------- To top ---------- */
    var toTop = document.querySelector(".to-top");
    if (toTop) {
        toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
    }

    /* ---------- Fade-in on scroll ---------- */
    var fadeEls = document.querySelectorAll(".fade-in-element");
    if ("IntersectionObserver" in window && !reduceMotion) {
        var fadeObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    fadeObs.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -10% 0px", threshold: 0 });
        fadeEls.forEach(function (el) { fadeObs.observe(el); });
    } else {
        fadeEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* ---------- Animated counters ---------- */
    var counters = document.querySelectorAll(".fact-number[data-count]");
    function animateCount(el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        if (reduceMotion) { el.textContent = target; return; }
        var start = null;
        var duration = 1800;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
        var countObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    countObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { countObs.observe(el); });
    } else {
        counters.forEach(animateCount);
    }

    /* ---------- Skill bars ---------- */
    var skillLines = document.querySelectorAll(".skill-line i[data-width]");
    if ("IntersectionObserver" in window) {
        var skillObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.getAttribute("data-width") + "%";
                    skillObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        skillLines.forEach(function (el) { skillObs.observe(el); });
    } else {
        skillLines.forEach(function (el) { el.style.width = el.getAttribute("data-width") + "%"; });
    }

    /* ---------- Testimonial / hadith slider ---------- */
    var stage = document.querySelector(".testimonial-stage");
    if (stage) {
        var slides = Array.prototype.slice.call(stage.querySelectorAll(".testimonial-slide"));
        var dotsWrap = document.querySelector(".testimonial-dots");
        var current = 0;
        var timer = null;
        function showSlide(n) {
            current = (n + slides.length) % slides.length;
            slides.forEach(function (s, i) { s.classList.toggle("is-active", i === current); });
            if (dotsWrap) {
                Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
                    d.classList.toggle("is-active", i === current);
                });
            }
        }
        function startAuto() {
            if (reduceMotion) return;
            stopAuto();
            timer = setInterval(function () { showSlide(current + 1); }, 6000);
        }
        function stopAuto() { if (timer) clearInterval(timer); }
        if (dotsWrap) {
            slides.forEach(function (_, i) {
                var dot = document.createElement("button");
                dot.type = "button";
                dot.setAttribute("aria-label", "Hadist " + (i + 1));
                dot.addEventListener("click", function () { showSlide(i); startAuto(); });
                dotsWrap.appendChild(dot);
            });
        }
        showSlide(0);
        startAuto();
        stage.addEventListener("mouseenter", stopAuto);
        stage.addEventListener("mouseleave", startAuto);
    }

    /* ---------- News carousel ---------- */
    var carousel = document.querySelector(".news-carousel");
    if (carousel) {
        var track = carousel.querySelector(".news-track");
        var cards = track ? Array.prototype.slice.call(track.children) : [];
        var prevBtn = document.querySelector(".carousel-nav .car-prev");
        var nextBtn = document.querySelector(".carousel-nav .car-next");
        var index = 0;
        function visibleCount() {
            var w = window.innerWidth;
            if (w <= 640) return 1;
            if (w <= 1024) return 2;
            return 3;
        }
        function maxIndex() { return Math.max(0, cards.length - visibleCount()); }
        function cardStep() {
            if (!cards.length) return 0;
            var gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap) || 0;
            return cards[0].getBoundingClientRect().width + gap;
        }
        function render() {
            index = Math.min(Math.max(index, 0), maxIndex());
            track.style.transform = "translateX(" + (-index * cardStep()) + "px)";
            if (prevBtn) prevBtn.disabled = index <= 0;
            if (nextBtn) nextBtn.disabled = index >= maxIndex();
        }
        if (prevBtn) prevBtn.addEventListener("click", function () { index--; render(); });
        if (nextBtn) nextBtn.addEventListener("click", function () { index++; render(); });
        window.addEventListener("resize", render);
        render();
        setTimeout(render, 900);
    }

    /* ---------- Fullscreen modals ---------- */
    var openModal = null;
    function lockScroll() { body.classList.add("modal-open"); }
    function unlockScroll() { body.classList.remove("modal-open"); }
    document.querySelectorAll("[data-modal-target]").forEach(function (trigger) {
        trigger.addEventListener("click", function (e) {
            e.preventDefault();
            var modal = document.getElementById(trigger.getAttribute("data-modal-target"));
            if (!modal) return;
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            lockScroll();
            openModal = modal;
            var closeBtn = modal.querySelector(".close-modal");
            if (closeBtn) closeBtn.focus();
        });
    });
    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        unlockScroll();
        openModal = null;
    }
    document.querySelectorAll(".modal .close-modal").forEach(function (btn) {
        btn.addEventListener("click", function () { closeModal(btn.closest(".modal")); });
    });

    /* ---------- Lightbox ---------- */
    var lightbox = document.querySelector(".lightbox");
    var lbItems = [];
    var lbIndex = 0;
    function collectGroup(group) {
        return Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + group + '"]'));
    }
    function openLightbox(item) {
        var group = item.getAttribute("data-lightbox");
        lbItems = collectGroup(group);
        lbIndex = lbItems.indexOf(item);
        renderLightbox();
        lightbox.classList.add("is-open");
        body.classList.add("lightbox-open");
    }
    function renderLightbox() {
        var item = lbItems[lbIndex];
        if (!item) return;
        var img = lightbox.querySelector("img");
        var cap = lightbox.querySelector("figcaption");
        var count = lightbox.querySelector(".lb-count");
        var src = item.getAttribute("data-full") || (item.querySelector("img") ? item.querySelector("img").src : item.href);
        var caption = item.getAttribute("data-caption") || "";
        img.src = src;
        img.alt = caption;
        cap.textContent = caption;
        count.textContent = (lbIndex + 1) + " / " + lbItems.length;
    }
    function closeLightbox() {
        lightbox.classList.remove("is-open");
        body.classList.remove("lightbox-open");
    }
    function lbStep(dir) {
        lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
        renderLightbox();
    }
    if (lightbox) {
        document.querySelectorAll("[data-lightbox]").forEach(function (item) {
            item.addEventListener("click", function (e) {
                e.preventDefault();
                openLightbox(item);
            });
        });
        lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
        lightbox.querySelector(".lb-prev").addEventListener("click", function () { lbStep(-1); });
        lightbox.querySelector(".lb-next").addEventListener("click", function () { lbStep(1); });
        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    /* ---------- Global keyboard ---------- */
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (lightbox && lightbox.classList.contains("is-open")) closeLightbox();
            else if (openModal) closeModal(openModal);
            else if (body.classList.contains("nav-open")) body.classList.remove("nav-open");
        }
        if (lightbox && lightbox.classList.contains("is-open")) {
            if (e.key === "ArrowLeft") lbStep(-1);
            if (e.key === "ArrowRight") lbStep(1);
        }
    });

    /* ---------- Share: copy link ---------- */
    document.querySelectorAll("[data-copy-link]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            var url = window.location.href;
            function done() {
                var original = btn.innerHTML;
                btn.innerHTML = "&#10003;";
                btn.setAttribute("aria-label", "Tersalin");
                setTimeout(function () { btn.innerHTML = original; }, 1600);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(done).catch(done);
            } else {
                var tmp = document.createElement("textarea");
                tmp.value = url; document.body.appendChild(tmp);
                tmp.select();
                try { document.execCommand("copy"); } catch (err) {}
                document.body.removeChild(tmp);
                done();
            }
        });
    });

    /* ---------- Contact form -> mailto ---------- */
    var form = document.querySelector(".contact-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var name = form.querySelector('[name="name"]').value.trim();
            var email = form.querySelector('[name="email"]').value.trim();
            var message = form.querySelector('[name="message"]').value.trim();
            var status = form.querySelector(".form-status");
            if (!name || !message) {
                if (status) status.textContent = "Mohon isi nama dan pesan terlebih dahulu.";
                return;
            }
            var subject = encodeURIComponent("Pesan dari " + name + " — Website Ukasyah");
            var bodyText = encodeURIComponent(message + "\n\n— " + name + (email ? " (" + email + ")" : ""));
            window.location.href = "mailto:ukaabtabs@gmail.com?subject=" + subject + "&body=" + bodyText;
            if (status) status.textContent = "Membuka aplikasi email… Terima kasih, " + name + "!";
        });
    }

    /* ---------- Custom cursor: dot + trailing ring ---------- */
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (finePointer && !reduceMotion) {
        var cursorDot = document.createElement("div");
        var cursorRing = document.createElement("div");
        cursorDot.className = "cursor-dot";
        cursorRing.className = "cursor-ring";
        cursorDot.setAttribute("aria-hidden", "true");
        cursorRing.setAttribute("aria-hidden", "true");
        body.appendChild(cursorDot);
        body.appendChild(cursorRing);
        body.classList.add("has-cursor");

        var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        var ringX = mouseX, ringY = mouseY;

        document.addEventListener("mousemove", function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = "translate(" + mouseX + "px," + mouseY + "px) translate(-50%,-50%)";
        });

        (function cursorFollow() {
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;
            cursorRing.style.transform = "translate(" + ringX.toFixed(1) + "px," + ringY.toFixed(1) + "px) translate(-50%,-50%)";
            window.requestAnimationFrame(cursorFollow);
        })();

        var cursorHoverSel = "a, button, [data-lightbox], input, textarea, select, .foto-item, .karya-cover";
        document.addEventListener("mouseover", function (e) {
            var t = e.target.closest(cursorHoverSel);
            if (t && !(e.relatedTarget && t.contains(e.relatedTarget))) body.classList.add("is-cursor-hover");
        });
        document.addEventListener("mouseout", function (e) {
            var t = e.target.closest(cursorHoverSel);
            if (t && !(e.relatedTarget && t.contains(e.relatedTarget))) body.classList.remove("is-cursor-hover");
        });
        document.addEventListener("mousedown", function () { body.classList.add("is-cursor-down"); });
        document.addEventListener("mouseup", function () { body.classList.remove("is-cursor-down"); });
        document.addEventListener("mouseleave", function () { body.classList.add("is-cursor-hidden"); });
        document.addEventListener("mouseenter", function () { body.classList.remove("is-cursor-hidden"); });
    }

    /* Initial paint */
    onScroll();
})();