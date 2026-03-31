name: Daily News Update

on:
  schedule:
    # Run at 10:00 AM UTC every day (18:00 Beijing time)
    - cron: '0 10 * * *'
  workflow_dispatch:
    # Allow manual trigger for testing

jobs:
  update-news:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --prefer-offline

      - name: Fetch latest news
        run: pnpm run fetch-news

      - name: Commit and push changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add public/news-data.json
          git diff --staged --quiet || git commit -m "Update news data $(date +'%Y-%m-%d %H:%M:%S')"
          git push
