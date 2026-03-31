@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.75rem;
    --apple-color: #FA243C;
    --youtube-color: #FF0000;
    --spotify-color: #1DB954;
    --bg-primary: #FFFFFF;
    --bg-surface: #F9FAFB;
    --bg-surface-hover: #F3F4F6;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --border-color: #E5E7EB;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  body {
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-surface);
  }

  ::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }
}

@layer components {
  .news-item-hover {
    transition: all 0.2s ease;
  }

  .news-item-hover:hover {
    background: var(--bg-surface-hover);
  }

  .news-item-hover:hover .news-title {
    color: var(--spotify-color);
  }

  .fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
    opacity: 0;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: toastFadeInUp 0.3s ease-out forwards;
  }

  @keyframes toastFadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }
  .stagger-5 { animation-delay: 0.25s; }

  .column-border-apple {
    border-top: 3px solid var(--apple-color);
  }

  .column-border-youtube {
    border-top: 3px solid var(--youtube-color);
  }

  .column-border-spotify {
    border-top: 3px solid var(--spotify-color);
  }

  .column-border-wechat {
    border-top: 3px solid #07C160;
  }
}
