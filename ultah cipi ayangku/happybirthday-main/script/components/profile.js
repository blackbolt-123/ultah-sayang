(function () {
  window.Components = window.Components || {};

  window.Components.profile = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-profile";
      div.innerHTML = `
        <div class="profile-wrapper">
          <img src="${config.photo}" alt="profile" class="profile-picture" />
        </div>
        <div class="wish">
          <h3 class="wish-hbd">${section.wishTitle || "Happy Birthday!"}</h3>
          <h5 class="wish-text">${section.wishText || ""}</h5>
        </div>
      `;
      // Split wish title into spans for stagger animation
      const hbd = div.querySelector(".wish-hbd");
      hbd.innerHTML = hbd.textContent
        .split("")
        .map((ch) => `<span>${ch}</span>`)
        .join("");

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      // Photo appears with gentle scale - slower and smoother
      tl.from(el.querySelector(".profile-picture"), {
        duration: 1.2, scale: 0.5, opacity: 0, ease: "back.out(1.4)",
      }, "-=3")
      // Wish title letters stagger in - slower
      .from(el.querySelectorAll(".wish-hbd span"), {
        duration: 0.7, opacity: 0, y: -30,
        ease: "back.out(1.7)", stagger: 0.08,
      })
      // Color each letter
      .to(el.querySelectorAll(".wish-hbd span"), {
        color: "var(--primary)", duration: 0.5,
        stagger: 0.05, ease: "none",
      }, "-=0.4")
      // Wish text fades in - slower
      .from(el.querySelector(".wish-text"), {
        duration: 0.7, opacity: 0, y: 10,
      }, "-=0.3")

      // Wait 4 seconds so wish text is fully readable
      .to({}, { duration: 4 });
    },

    exit(tl, el) {
      tl.to(el, {
        duration: 0.6, opacity: 0, y: 20,
      });
    },
  };
})();
