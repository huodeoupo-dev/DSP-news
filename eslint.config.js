# DSPNews - Music Industry News Dashboard

A real-time music industry news dashboard that auto-updates daily at 10:00 AM.

## Features

- 5 platform columns: Apple Music, YouTube, Spotify, Music Ally, MBW
- Bilingual news summaries (English + Chinese)
- Dark theme inspired by Spotify
- Manual refresh button
- **Automatic daily updates via GitHub Actions**

## Setup Instructions

### Step 1: Push to GitHub

1. Create a new GitHub repository
2. Push this project to your repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/dsp-news-dashboard.git
git push -u origin main
```

### Step 2: Enable GitHub Actions

The GitHub Actions workflow is already configured in `.github/workflows/update-news.yml`.

The workflow will automatically:
- Run every day at 10:00 AM UTC (18:00 Beijing time)
- Fetch the latest news from RSS feeds
- Commit the updated news data to the repository

To enable it:
1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. You should see the "Daily News Update" workflow
4. Click **Enable Actions** if prompted

### Step 3: Trigger Initial News Fetch

You can manually trigger the workflow to fetch news immediately:

1. Go to **Actions** tab
2. Click on "Daily News Update"
3. Click **Run workflow** button
4. Select "main" branch and click **Run workflow**

### Step 4: Deploy the Dashboard

You have two options:

#### Option A: Deploy to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite + React project
5. Click **Deploy**

Your dashboard will be live at: `https://your-project.vercel.app`

#### Option B: Deploy to GitHub Pages

1. Go to repository **Settings** > **Pages**
2. Under "Source", select **GitHub Actions**
3. Create a new workflow file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    concurrency:
      group: "pages"
      cancel-in-progress: true
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - run: pnpm install --prefer-offline
      - run: pnpm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - uses: angushi/ghaction-pages@v4
        if: github.ref == 'refs/heads/main'
```

4. Your site will be at: `https://YOUR_USERNAME.github.io/dsp-news-dashboard`

## How the Auto-Update Works

```
GitHub Actions (Daily @ 10:00 AM UTC)
         │
         ▼
scripts/fetch-news.mjs
  - Fetches RSS feeds from 5 music platforms
  - Aggregates and deduplicates articles
  - Saves to public/news-data.json
         │
         ▼
Git Commit (auto-commits updated data)
         │
         ▼
Vercel/GitHub Pages (auto-deploys)
```

## RSS Feed Sources

- **Apple Music**: Apple Newsroom, 9to5Mac
- **YouTube**: YouTube Blog
- **Spotify**: Spotify Newsroom
- **Music Ally**: Musically
- **MBW**: Music Business Worldwide

## Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Fetch news manually
pnpm run fetch-news
```

## Manual Refresh

If you want to update news immediately without waiting for the daily schedule:

1. Go to the **Actions** tab on GitHub
2. Click on "Daily News Update"
3. Click **Run workflow** > **Run workflow**

The workflow will fetch the latest news and commit the changes, which will automatically trigger a new deployment.

## License

MIT
