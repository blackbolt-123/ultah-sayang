(function () {
  window.Components = window.Components || {};

  // ── Fade helpers ──────────────────────────────────────────────
  function fadeOutMusic(duration, callback) {
    const bgMusic = document.querySelector(".song");
    if (!bgMusic || bgMusic.paused) {
      if (callback) callback();
      return;
    }
    const startVol = bgMusic.volume;
    const steps = Math.round(duration * 60); // 60fps
    const delta = startVol / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const newVol = Math.max(0, startVol - delta * step);
      bgMusic.volume = newVol;
      if (step >= steps) {
        clearInterval(interval);
        bgMusic.volume = 0;
        if (callback) callback();
      }
    }, 1000 / 60);
  }

  function fadeInMusic(duration) {
    const bgMusic = document.querySelector(".song");
    if (!bgMusic || bgMusic.paused) return;
    const targetVol = 1;
    const startVol = bgMusic.volume;
    const steps = Math.round(duration * 60);
    const delta = (targetVol - startVol) / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const newVol = Math.min(targetVol, startVol + delta * step);
      bgMusic.volume = newVol;
      if (step >= steps) {
        clearInterval(interval);
        bgMusic.volume = targetVol;
      }
    }, 1000 / 60);
  }

  // ── Component ─────────────────────────────────────────────────
  window.Components.video = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-video";

      // Title
      const title = document.createElement("div");
      title.className = "video-title";
      title.textContent = section.title || "Video";

      // Video container
      const videoContainer = document.createElement("div");
      videoContainer.className = "video-container";
      videoContainer.style.cssText = `
        position: relative;
        background: var(--bg);
        border-radius: 12px;
        overflow: hidden;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        border: 2px solid rgba(244, 114, 182, 0.2);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      `;

      const video = document.createElement("video");
      video.className = "video-element";
      video.src = section.src || "";
      video.setAttribute("preload", "auto");
      video.setAttribute("playsinline", "");
      video.controls = false;
      video.style.cssText = `
        width: 100%;
        height: auto;
        display: block;
      `;

      // Click to toggle pause/resume
      video.addEventListener("click", () => {
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });

      // Error handling
      video.addEventListener("error", () => {
        const err = document.createElement("div");
        err.style.cssText = `
          position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          color:var(--text);text-align:center;font-size:1rem;opacity:0.8;
          pointer-events:none;z-index:5;
        `;
        err.textContent = "Video tidak tersedia";
        videoContainer.appendChild(err);
      });

      videoContainer.appendChild(video);
      div.appendChild(title);
      div.appendChild(videoContainer);

      container.appendChild(div);

      // Store reference
      div._video = video;
      div._played = false;

      return div;
    },

    animate(tl, el, config) {
      const videoContainer = el.querySelector(".video-container");
      const title = el.querySelector(".video-title");
      const video = el._video;

      // Animasi masuk: fade in + slide up
      tl.from(el, {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: "power3.out",
      });

      // Setelah animasi masuk selesai: fade out musik + auto-play video + pause timeline
      tl.call(() => {
        // Fade out background music ~1.5 detik
        fadeOutMusic(1.5, () => {
          // Musik sudah fade out, sekarang play video
          video.play().then(() => {
            el._played = true;
          }).catch(() => {
            // Browser mungkin blok auto-play, tidak apa — user bisa klik
          });
        });

        // Pause timeline, tunggu video selesai
        tl.pause();

        const onEnded = () => {
          video.removeEventListener("ended", onEnded);
          fadeInMusic(2);
          gsap.to(el, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            ease: "power2.in",
            onComplete: () => {
              tl.resume();
            }
          });
        };

        video.addEventListener("ended", onEnded);
      });
    },

    exit(tl, el) {
      const video = el._video;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      // Pastikan musik balik ke volume normal jika belum
      const bgMusic = document.querySelector(".song");
      if (bgMusic && bgMusic.volume < 0.5) {
        fadeInMusic(1);
      }
      // Fade out section
      tl.to(el, {
        duration: 0.8,
        opacity: 0,
        y: 20,
        ease: "power2.in",
      });
    },
  };
})();