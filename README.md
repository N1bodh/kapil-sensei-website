# 🌸 Kapil Sensei Japanese Academy Website

Official responsive web portal for **Kapil Sensei (Kapil Giri)** — Japanese Language Academy & SSW (Specified Skilled Worker) Career Hub.

Hosted live on Cloudflare Workers: [cold-frost-17ce.kapilsensei.workers.dev](https://cold-frost-17ce.kapilsensei.workers.dev/)

---

## 🌟 Key Features

- **📱 Fully Responsive Design**: Seamless desktop and smartphone user experience with fluid typography, adaptive cards, and touch-friendly navigation.
- **📚 Compact Topic & Subject Navigator**: Dynamic explorer that allows students to view the entire website or focus exclusively on a single subject (Videos, Flashcards, Quiz, SSW, Courses, etc.).
- **🌸 Interactive Falling Sakura Blossoms**: Lightweight HTML5 Canvas particle animation with toggle control.
- **🗂️ Interactive 3D Audio Flashcards**: 3D flip card lab with Furigana readings, romaji, English meanings, example sentences, and native Web Speech API audio pronunciation.
- **⏱️ JFT-Basic & JLPT Mock Quiz Arena**: Timed real-exam simulation with instant scoring, Japanese furigana questions, and detailed explanations.
- **💼 SSW (Specified Skilled Worker) Visa Hub**: In-depth guidance, salary information, and roadmap for Caregiving (Kaigo), Agriculture, Food Service, and Hospitality.
- **🌓 Dark & Light Theme Modes**: Tokyo midnight dark mode and modern minimalist light mode.
- **⬆️ Floating Back-to-Top**: Quick floating action button for smooth navigation on smartphones.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with `<ruby>` and `<rt>` furigana pronunciation tags.
- **CSS3**: Modern custom properties (variables), Glassmorphism, CSS Grid & Flexbox, smooth transitions, and responsive media queries.
- **JavaScript (Vanilla ES6+)**: Interactive controllers, Web Speech API, Canvas animation, LocalStorage theme persistence.
- **Deployment**: Cloudflare Workers / Pages.

---

## 📁 Repository Structure

```text
├── assets/                          # Images, logo, banners, and gallery photos
├── index.html                       # Main single-page application structure
├── style.css                        # Complete aesthetic styling & responsive system
├── app.js                           # Interactive engine, flashcards, quiz, & navigation
├── video_production_hiragana_masterclass.md # Video curriculum notes
├── KAPIL SENSEI_INSTRUCTION.docx    # Course notes & background instructions
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

---

## 🚀 Running Locally

You can preview the website locally using any static web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx
npx serve .
```

Then open `http://localhost:8000` in your web browser.

---

## 👨‍🏫 About Kapil Sensei

Kapil Giri (Kapil Sensei) is a dedicated Japanese language educator empowering students and professionals from Nepal and worldwide to master Japanese, pass JFT-Basic and JLPT exams, and build successful careers in Japan.

- **YouTube**: [@KapilSensei](https://www.youtube.com/@KapilSensei)
