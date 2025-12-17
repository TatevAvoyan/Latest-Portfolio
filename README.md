# 🎮 Gameplay Programmer Portfolio

A fun, interactive portfolio website for a gameplay programmer. Features interactive games, animated backgrounds, and a modern dark theme perfect for showcasing game development work.

## 🎯 What Makes It Special?

- **🎮 Interactive Games** - Play a bug-hitting game on the home page and a Snake game in the contact section!
- **✨ Animated Background** - Watch C++ Unreal Engine code snippets float across the screen
- **🎨 Beautiful Dark Theme** - GitHub-inspired dark mode design
- **📱 Fully Responsive** - Looks great on any device
- **🔊 Sound Effects** - Satisfying audio feedback for game interactions

## 🚀 Quick Start

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   npm install
   ```

2. **Run locally**
   ```bash
   npm start
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎮 Try the Games!

- **Home Page**: Click anywhere to grab the hammer and hit bugs! 🐛🔨
- **Contact Section**: Play Snake with WASD keys and eat code bugs! 🐍

## 📝 Customize It

### Personal Info
Edit `index.html` to update:
- Your name and title
- Contact links (LinkedIn, GitHub, Email, Phone, WhatsApp)
- About section

### Add Projects
Edit the `projects` array in `public/js/main.js`:

```javascript
const projects = [
    {
        title: "Your Awesome Game",
        description: "What makes it cool...",
        image: "public/images/project1.jpg",
        video: "public/videos/demo.mp4", // optional
        github: "https://github.com/you/project",
        details: "More details here..."
    }
];
```

### Add Media
- Drop images in `public/images/`
- Drop videos in `public/videos/` (optional)
- Add your resume PDF to `public/resume/`

## 🌐 Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to Settings → Pages
3. Select `main` branch → `/ (root)`
4. Your site goes live! 🎉

For detailed steps, see [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md)

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js + Express (local dev only)
- **Deployment**: GitHub Pages (static hosting)

## 📧 Get in Touch

- **LinkedIn**: [Tatev Avoyan](https://www.linkedin.com/in/tatev-avoyan)
- **GitHub**: [@TatevAvoyan](https://github.com/TatevAvoyan)
- **Email**: tatevik.avoian@gmail.com

---

⭐ **Like this portfolio?** Feel free to star the repo and use it for your own!

Made with ❤️ for gameplay programmers
