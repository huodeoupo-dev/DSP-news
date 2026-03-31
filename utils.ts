/**
 * RSS News Fetcher - Daily Auto Update Script
 *
 * This script fetches music industry news from various RSS feeds
 * and saves the results to public/news-data.json
 *
 * Usage: node scripts/fetch-news.mjs
 *
 * This script is designed to run via GitHub Actions daily at 10:00 AM UTC
 */

// RSS Feed sources for music industry news
const RSS_FEEDS = {
  apple: {
    name: 'Apple Music',
    color: '#FA243C',
    feeds: [
      'https://www.apple.com/newsroom/rss/feed.rss',
      'https://9to5mac.com/category/apple-music/feed/'
    ]
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    feeds: [
      'https://blog.youtube/news-and-events/rss/'
    ]
  },
  spotify: {
    name: 'Spotify',
    color: '#1DB954',
    feeds: [
      'https://newsroom.spotify.com/feed/'
    ]
  },
  musically: {
    name: 'Music Ally',
    color: '#FF6B00',
    feeds: [
      'https://musically.com/feed/'
    ]
  },
  mbw: {
    name: 'MBW',
    color: '#1A1A1A',
    feeds: [
      'https://www.musicbusinessworldwide.com/feed/'
    ]
  }
};

// Source mapping for URL patterns
const SOURCE_PATTERNS = {
  'apple.com': 'Apple Newsroom',
  '9to5mac.com': '9to5Mac',
  'youtube.com': 'YouTube Blog',
  'blog.youtube': 'YouTube Blog',
  'spotify.com': 'Spotify Newsroom',
  'newsroom.spotify': 'Spotify Newsroom',
  'musically.com': 'Music Ally',
  'musicbusinessworldwide.com': 'MBW',
  'techcrunch.com': 'TechCrunch',
  'theverge.com': 'The Verge',
  'variety.com': 'Variety',
  'billboard.com': 'Billboard'
};

/**
 * Determine source name from URL
 */
function getSourceFromUrl(url) {
  for (const [pattern, source] of Object.entries(SOURCE_PATTERNS)) {
    if (url.includes(pattern)) {
      return source;
    }
  }
  return 'Other';
}

/**
 * Determine platform from URL
 */
function getPlatformFromUrl(url) {
  if (url.includes('apple')) return 'apple';
  if (url.includes('youtube') || url.includes('goog')) return 'youtube';
  if (url.includes('spotify')) return 'spotify';
  if (url.includes('musically')) return 'musically';
  if (url.includes('musicbusinessworldwide')) return 'mbw';
  return null;
}

/**
 * Normalize date to consistent format
 */
function normalizeDate(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      const parsed = new Date(dateStr.replace(/Z$/, '+00:00'));
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Fetch RSS feed using rss2json API
 */
async function fetchFeed(feedUrl) {
  try {
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=20`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(`RSS parse error: ${data.message}`);
    }

    return data.items || [];
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error.message);
    return [];
  }
}

/**
 * Generate bilingual summaries using simple rule-based approach
 */
function generateSummaries(title, description) {
  const desc = description?.replace(/<[^>]*>/g, '').substring(0, 300) || '';

  // Simple translation patterns (mock - in production use a translation API)
  const summaryEn = desc || title;
  const summaryCn = `[中文摘要待翻译] ${desc.substring(0, 100)}...`;

  return { summaryEn, summaryCn };
}

/**
 * Fetch all feeds and aggregate news
 */
async function fetchAllNews() {
  console.log('Starting news fetch...');

  const allNews = {
    apple: [],
    youtube: [],
    spotify: [],
    musically: [],
    mbw: []
  };

  const seenUrls = new Set();
  let newsId = 1;

  for (const [platform, config] of Object.entries(RSS_FEEDS)) {
    console.log(`Fetching ${config.name} feeds...`);

    for (const feedUrl of config.feeds) {
      const items = await fetchFeed(feedUrl);

      for (const item of items) {
        const url = item.link || item.guid;
        if (!url || seenUrls.has(url)) continue;
        seenUrls.add(url);

        const platformKey = getPlatformFromUrl(url) || platform;
        if (!allNews[platformKey]) continue;

        const source = getSourceFromUrl(url);
        const { summaryEn, summaryCn } = generateSummaries(item.title, item.description);

        allNews[platformKey].push({
          id: newsId++,
          title: item.title,
          url: url,
          source: source,
          sourceIcon: source,
          date: normalizeDate(item.pubDate),
          summaryEn: summaryEn,
          summaryCn: summaryCn
        });
      }
    }

    // Sort by date, newest first
    allNews[platform].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return allNews;
}

/**
 * Save news to JSON file
 */
async function saveNews(news) {
  const fs = await import('fs');
  const path = await import('path');

  const outputPath = path.join(process.cwd(), 'public', 'news-data.json');

  const output = {
    lastUpdated: new Date().toISOString(),
    news: news
  };

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`News saved to ${outputPath}`);

  return outputPath;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('='.repeat(50));
    console.log('DSP News Fetcher - Daily Update Script');
    console.log('Time:', new Date().toISOString());
    console.log('='.repeat(50));

    const news = await fetchAllNews();
    await saveNews(news);

    // Print summary
    let total = 0;
    for (const [platform, items] of Object.entries(news)) {
      console.log(`${platform}: ${items.length} articles`);
      total += items.length;
    }
    console.log(`\nTotal: ${total} articles`);
    console.log('News fetch completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
