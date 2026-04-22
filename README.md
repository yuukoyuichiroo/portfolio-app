# 🚀 Premium Glassmorphism Portfolio

A stunning, high-performance personal portfolio website built with **Next.js 14**, **Framer Motion**, and **React Icons**. Featuring a sleek glassmorphism design system, smooth animations, and a secure custom admin panel.

![Portfolio Preview](https://via.placeholder.com/1200x600?text=Premium+Glassmorphism+Portfolio+Preview)

## ✨ Key Features

- **💎 Glassmorphism UI**: Beautiful, modern design with backdrop blurs, subtle borders, and glowing accents.
- **🛠️ Custom Admin Panel**: Manage all your content (About, Experience, Projects) via a secure, password-protected dashboard.
- **⚡ Interactive Elements**:
  - Lightning-slash "View Work" button.
  - Pulsing, glowing CV Download button.
  - Typewriter effect on the hero name.
  - Interactive tag/badge management in the admin panel.
- **⏳ Premium Loading Splash**: A smooth, animated slide-up loading screen with custom branding.
- **📱 Mobile First**: Fully responsive navigation with a smooth hamburger menu overlay.
- **☁️ MockAPI Integration**: Uses MockAPI for easy data persistence without complex database setup.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS (Global Design System)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Backend**: [MockAPI](https://mockapi.io/)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed.
- A free project on [MockAPI](https://mockapi.io/).

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your credentials:
```env
MOCK_API_URL=https://your-project-id.mockapi.io/your-resource/1
ADMIN_PASSWORD=your_master_password
```

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your site!

## 🔐 Admin Panel
Access your dashboard at `/admin`. 
- Use your `ADMIN_PASSWORD` to log in.
- Update your info, add new projects, or manage work experience directly from the UI.
- Changes are instantly synced to MockAPI.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
