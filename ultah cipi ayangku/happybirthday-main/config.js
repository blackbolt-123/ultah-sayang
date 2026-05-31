/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 *
 * This is the ONLY file you need to modify.
 * No need to touch HTML, CSS, or any other JavaScript files.
 *
 * AVAILABLE SECTION TYPES:
 *   "greeting"      → Opening greeting with recipient's name
 *   "announcement"  → Birthday announcement text
 *   "chatbox"       → Chat message with typing animation
 *   "ideas"         → Sequential text reveals, one by one
 *   "quote"         → Styled quote card with optional author
 *   "countdown"     → Animated 3-2-1 countdown
 *   "stars"         → Twinkling stars background
 *   "fireworks"     → Colorful firework sparks burst
 *   "balloons"      → Floating balloon animation
 *   "profile"       → Profile photo with birthday wish
 *   "confetti"      → Confetti burst animation
 *   "closing"       → Closing message with replay button
 *
 * HOW TO USE:
 *   REMOVE a section  → Delete its object from the sections array
 *   DUPLICATE          → Copy-paste any section object
 *   REORDER            → Move the section object up/down in the array
 *   EDIT TEXT          → Change the string values
 */

const CONFIG = {
  name: "sayangku",
  photo: "./img/cipi.jpg",
  music: "./music/lagu.mp3",  // ← GANTI nama file sesuai file musikmu

  colors: {
    primary: "#f472b6",
    accent: "#60a5fa",
    dark: {
      background: "#0f172a",
      text: "#f1f5f9",
    },
    light: {
      background: "#fafaf9",
      text: "#1e293b",
    },
  },

  defaultMode: "dark",

  sections: [
    {
      type: "greeting",
      title: "Hai cipi",
      subtitle: "ada yang pengen aku bilang hari ini...",
    },
    {
      type: "countdown",
      from: 3,
      goText: "🎉",
    },
    {
      type: "announcement",
      text: "Selamat ulang tahun!! 🎂",
    },
    {
      type: "chatbox",
      message:
        "happy birthday sayang! semoga hari ini dan seterusnya selalu menyenangkan buat kamu. kamu layak dapet semua yang terbaik 💕",
      buttonText: "Kirim",
    },
    {
      type: "ideas",
      lines: [
        "waktu itu kamu yang duluan.",
        "dan aku... telat sadar.",
        "tapi sekarang aku ngerti,",
        "aku yang paling <strong>beruntung</strong>.",
        "kamu baik. tulus. gak pernah neko-neko.",
        "kamu selalu ada, selalu ngusahain.",
        "dan kamu banggain aku — padahal aku yang harusnya banggain <strong>kamu</strong>.",
        "makasih udah milih aku, <span>sayang</span> 💕",
      ],
      bigLetters: "♡",
    },
    {
      type: "quote",
      text: "cinta yang tulus itu gak berisik. dia cukup hadir — ngusahain, jagain, dan banggain orang yang dia sayang. kamu ngajarin aku itu, ayang.",
      author: "dari aku, buat kamu 💕",
    },
    {
      type: "stars",
      count: 40,
    },
    {
      type: "balloons",
      count: 25,
    },
    {
      type: "profile",
      wishTitle: "Happy Birthday, Sayang! 🎉",
      wishText: "semoga semua yang kamu impiin tercapai tahun ini 💕",
    },
    {
      type: "slideshow",   // ← SECTION BARU (lihat Tugas 2)
      photos: [
        { src: "./img/slide (1).jpg", caption: "Yang paling aku suka dari kamu..." },
        { src: "./img/slide (2).jpg", caption: "Senyum yang bikin aku tenang" },
        { src: "./img/slide (3).jpg", caption: "Momen ini... aku gak mau lupa" },
        { src: "./img/slide (4).jpg", caption: "Sama kamu rasanya beda" },
        { src: "./img/slide (5).jpg", caption: "Ini salah satu favorit aku" },
        { src: "./img/slide (6).jpg", caption: "Selamat ulang tahun, sayangku 🩷" },
      ],
      interval: 2000,     // ganti foto tiap 2 detik (pas biar caption kebaca)
      autoplay: true,
    },
    {
      type: "video",       // ← SECTION BARU (lihat Tugas 3)
      src: "./video/kita.mp4",   // ← GANTI nama file sesuai file videomu
      title: "Ini kita 🩷",
    },
    {
      type: "fireworks",
      count: 24,
    },
    {
      type: "confetti",
      count: 9,
    },
    {
      type: "closing",
      text: "selamat ulang tahun, ayang. semoga kamu tahu betapa berartinya kamu — buat orang-orang di sekitarmu, dan buat aku yang paling beruntung bisa kenal kamu 💕",
      replayText: "atau klik di sini kalau mau nonton ulang.",
    },
  ],
};