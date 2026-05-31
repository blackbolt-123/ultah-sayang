(function () {
  window.Components = window.Components || {};

  window.Components.slideshow = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-slideshow";

      // Slideshow container with gradient border effect
      const slideshowContainer = document.createElement("div");
      slideshowContainer.className = "slideshow-container";

      // Image wrapper for clipping and effects
      const imgWrapper = document.createElement("div");
      imgWrapper.className = "slideshow-img-wrapper";

      const img = document.createElement("img");
      img.className = "slideshow-image";
      img.alt = "";

      // Gradient overlay for style
      const gradientOverlay = document.createElement("div");
      gradientOverlay.className = "slideshow-gradient";

      // Heart overlay for romantic touch
      const heartTop = document.createElement("div");
      heartTop.className = "slideshow-heart";
      heartTop.innerHTML = "🩷";
      heartTop.style.opacity = "0";

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(gradientOverlay);
      imgWrapper.appendChild(heartTop);

      // Caption with glass effect
      const caption = document.createElement("div");
      caption.className = "slideshow-caption";

      slideshowContainer.appendChild(imgWrapper);
      slideshowContainer.appendChild(caption);

      // Navigation
      const nav = document.createElement("div");
      nav.className = "slideshow-nav";

      const prevBtn = document.createElement("button");
      prevBtn.className = "slideshow-prev";
      prevBtn.innerHTML = "&#10094;";
      prevBtn.setAttribute("aria-label", "Previous photo");

      const dotsContainer = document.createElement("div");
      dotsContainer.className = "slideshow-dots";

      const nextBtn = document.createElement("button");
      nextBtn.className = "slideshow-next";
      nextBtn.innerHTML = "&#10095;";
      nextBtn.setAttribute("aria-label", "Next photo");

      // Photo counter
      const counter = document.createElement("div");
      counter.className = "slideshow-counter";

      nav.appendChild(prevBtn);
      nav.appendChild(dotsContainer);
      nav.appendChild(nextBtn);

      div.appendChild(slideshowContainer);
      div.appendChild(counter);
      div.appendChild(nav);

      container.appendChild(div);

      // Store elements
      div._img = img;
      div._imgWrapper = imgWrapper;
      div._heartTop = heartTop;
      div._caption = caption;
      div._dotsContainer = dotsContainer;
      div._counter = counter;
      div._prevBtn = prevBtn;
      div._nextBtn = nextBtn;
      div._photos = section.photos || [];
      div._interval = section.interval || 2000;
      div._autoplay = section.autoplay !== false;
      div._currentIndex = 0;
      div._timer = null;
      div._cycleCount = 0;

      // Initialize dots
      this._updateDots(div);

      // Show first photo immediately
      this._showPhoto(div, 0, false);

      // Event listeners
      prevBtn.addEventListener("click", () => {
        this._resetTimer(div);
        this._prevPhoto(div);
      });
      nextBtn.addEventListener("click", () => {
        this._resetTimer(div);
        this._nextPhoto(div);
      });

      // NOTE: Timer starts in animate(), not here!
      // Calculate total duration for timeline wait
      const photoCount = (section.photos || []).length;
      const intervalMs = section.interval || 2000;
      div._totalDuration = (photoCount * intervalMs) / 1000 + 1; // in seconds

      return div;
    },

    _showPhoto(div, index, animate = true, direction = "next") {
      const photos = div._photos;
      if (!photos.length) return;

      // Clamp index
      let clampedIndex = index;
      if (clampedIndex < 0) clampedIndex = photos.length - 1;
      if (clampedIndex >= photos.length) {
        clampedIndex = 0;
        div._cycleCount++;
      }

      div._currentIndex = clampedIndex;
      const photo = photos[clampedIndex];

      // Update image source
      div._img.src = photo.src;
      div._img.alt = photo.caption || "";

      // Handle image load errors
      const handleError = () => {
        const existingError = div._imgWrapper.querySelector(".slideshow-error");
        if (existingError) existingError.remove();
        const errorOverlay = document.createElement("div");
        errorOverlay.className = "slideshow-error";
        errorOverlay.textContent = "📷";
        errorOverlay.style.cssText = `
          position:absolute;top:0;left:0;width:100%;height:100%;
          display:flex;align-items:center;justify-content:center;
          font-size:3rem;background:rgba(0,0,0,0.3);pointer-events:none;
          z-index:2;
        `;
        div._imgWrapper.appendChild(errorOverlay);
      };
      div._img.removeEventListener("error", handleError);
      div._img.addEventListener("error", handleError, { once: true });

      // Update caption
      div._caption.textContent = photo.caption || "";

      // Update counter
      div._counter.textContent = `${clampedIndex + 1} / ${photos.length}`;

      if (animate) {
        const enterFrom = direction === "next" ? 40 : -40;

        gsap.killTweensOf(div._img);
        gsap.killTweensOf(div._caption);
        gsap.killTweensOf(div._heartTop);

        // Sembunyikan dulu sambil nunggu load
        gsap.set(div._img, { opacity: 0 });

        const runAnim = () => {
          gsap.fromTo(div._img,
            { opacity: 0, x: enterFrom, scale: 1.05, filter: "blur(4px)" },
            { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power2.out" }
          );
          gsap.fromTo(div._caption,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: "power2.out" }
          );
          gsap.fromTo(div._heartTop,
            { opacity: 0.6, scale: 0.3, y: 20 },
            { opacity: 0, scale: 1.2, y: -30, duration: 1.2, ease: "power2.out" }
          );
        };

        if (div._img.complete && div._img.naturalWidth > 0) {
          // Foto udah di-cache, langsung animasi
          runAnim();
        } else {
          // Tunggu foto selesai load baru animasi
          div._img.onload = () => {
            div._img.onload = null;
            runAnim();
          };
        }
      } else {
        // Initial load - visible immediately
        div._img.style.opacity = "1";
        div._img.style.transform = "none";
        div._img.style.filter = "none";
        div._caption.style.opacity = "1";
        div._caption.style.transform = "none";
      }

      // Update dots
      this._updateDots(div);
    },

    _updateDots(div) {
      const dotsContainer = div._dotsContainer;
      dotsContainer.innerHTML = "";
      for (let i = 0; i < div._photos.length; i++) {
        const dot = document.createElement("div");
        dot.className = i === div._currentIndex ? "dot active" : "dot";
        dot.addEventListener("click", () => {
          this._resetTimer(div);
          const direction = i > div._currentIndex ? "next" : "prev";
          this._showPhoto(div, i, true, direction);
        });
        dotsContainer.appendChild(dot);
      }
    },

    _startTimer(div) {
      this._stopTimer(div);
      div._timer = setInterval(() => {
        this._nextPhoto(div);
      }, div._interval);
    },

    _stopTimer(div) {
      if (div._timer) {
        clearInterval(div._timer);
        div._timer = null;
      }
    },

    _resetTimer(div) {
      this._stopTimer(div);
      if (div._autoplay) {
        this._startTimer(div);
      }
    },

    _nextPhoto(div) {
      this._showPhoto(div, div._currentIndex + 1, true, "next");
    },

    _prevPhoto(div) {
      this._showPhoto(div, div._currentIndex - 1, true, "prev");
    },

    animate(tl, el, config) {
      const slideshowContainer = el.querySelector(".slideshow-container");
      const nav = el.querySelector(".slideshow-nav");
      const counter = el.querySelector(".slideshow-counter");

      // Reset to first photo
      this._stopTimer(el);
      this._showPhoto(el, 0, false);

      // Fade in slideshow
      tl.from(slideshowContainer, { duration: 1, opacity: 0, y: 30, ease: "power3.out" });
      tl.from(counter, { duration: 0.6, opacity: 0, y: 10 }, "-=0.3");
      tl.from(nav, { duration: 0.6, opacity: 0, y: 10 }, "-=0.4");

      // Start auto-slide timer AFTER fade-in completes
      tl.call(() => {
        if (el._autoplay) {
          this._startTimer(el);
        }
      });

      // Wait for all photos to cycle
      if (el._totalDuration) {
        tl.to({}, { duration: el._totalDuration });
      }
    },

    exit(tl, el) {
      // Stop the timer
      this._stopTimer(el);
      // Kill GSAP tweens
      gsap.killTweensOf(el._img);
      gsap.killTweensOf(el._caption);
      gsap.killTweensOf(el._heartTop);
      // Fade out the section
      tl.to(el, { duration: 0.8, opacity: 0, y: 20, ease: "power2.in" });
    },
  };
})();