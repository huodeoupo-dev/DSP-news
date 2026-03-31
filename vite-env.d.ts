import { Clock, ExternalLink, RefreshCw, FileText, ChevronDown, Check, Sun, Filter, X, Music } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

// Types
interface NewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  sourceIcon: string;
  date: string;
  summaryEn: string;
  summaryCn: string;
}

interface Platform {
  name: string;
  icon: 'apple' | 'youtube' | 'spotify' | 'musically' | 'mbw';
  color: string;
  borderClass: string;
  news: NewsItem[];
}

// Real news data with bilingual summaries - Article publication dates
const platformNews: Platform[] = [
  {
    name: 'Apple Music',
    icon: 'apple',
    color: '#FA243C',
    borderClass: 'column-border-apple',
    news: [
      {
        id: 1,
        title: 'Apple Music to add Transparency Tags to distinguish AI music',
        url: 'https://techcrunch.com/2026/03/04/apple-music-to-add-transparency-tags-to-distinguish-ai-music-says-report/',
        source: 'TechCrunch',
        sourceIcon: 'TechCrunch',
        date: 'March 4, 2026',
        summaryEn: 'Apple Music is implementing a new system to allow record labels and distributors to flag AI-generated or AI-assisted content when uploading music to the platform.',
        summaryCn: 'Apple Music 正在实施新系统，允许唱片公司和分销商在上传音乐时标记 AI 生成或 AI 辅助的内容。'
      },
      {
        id: 2,
        title: "Apple's iOS 26.4 arrives with AI music playlists, video podcasts",
        url: 'https://techcrunch.com/2026/02/20/apples-ios-26-4-arrives-in-public-beta-with-ai-music-playlists-video-podcasts-and-more/',
        source: 'TechCrunch',
        sourceIcon: 'TechCrunch',
        date: 'February 20, 2026',
        summaryEn: 'Apple released iOS 26.4 in public beta with new Apple Music AI Playlist feature, Concerts Near You section, and video podcasts support.',
        summaryCn: 'Apple 在公测版中发布了 iOS 26.4，新增 Apple Music AI 播放列表功能、附近演唱会部分以及视频播客支持。'
      },
      {
        id: 3,
        title: "Apple Music adds 'transparency tags' for uses of AI with music",
        url: 'https://musically.com/2026/03/05/apple-music-adds-transparency-tags-for-uses-of-ai-with-music/',
        source: 'Music Ally',
        sourceIcon: 'Musically',
        date: 'March 5, 2026',
        summaryEn: 'Apple Music is the latest streaming service trying to ensure people know when they are listening to music where AI has been used.',
        summaryCn: 'Apple Music 是最新尝试确保用户知道何时正在收听使用 AI 制作的音乐的流媒体服务。'
      },
      {
        id: 4,
        title: "Apple Music tipped to launch 'Playlist Playground' AI feature",
        url: 'https://musically.com/2026/02/18/apple-music-tipped-to-launch-playlist-playground-ai-feature/',
        source: 'Music Ally',
        sourceIcon: 'Musically',
        date: 'February 18, 2026',
        summaryEn: 'Apple Music is reportedly planning to launch an AI-powered playlist feature called Playlist Playground.',
        summaryCn: '据报道，Apple Music 计划推出名为 Playlist Playground 的 AI 驱动播放列表功能。'
      },
      {
        id: 5,
        title: 'Behind Kyle Hanagami\'s viral dance creations edited with Final Cut Pro',
        url: 'https://www.apple.com/newsroom/2026/01/behind-kyle-hanagamis-viral-dance-creations-edited-with-final-cut-pro/',
        source: 'Apple Newsroom',
        sourceIcon: 'Apple Newsroom',
        date: 'January 28, 2026',
        summaryEn: 'Apple Newsroom features Kyle Hanagami\'s journey creating viral dance content using Final Cut Pro, showcasing Apple\'s creative tools for content creators.',
        summaryCn: 'Apple Newsroom 专题报道 Kyle Hanagami 使用 Final Cut Pro 创作病毒式舞蹈内容的历程，展示 Apple 为内容创作者提供的创意工具。'
      }
    ]
  },
  {
    name: 'YouTube',
    icon: 'youtube',
    color: '#FF0000',
    borderClass: 'column-border-youtube',
    news: [
      {
        id: 1,
        title: 'YouTube Premium Lite gets background play and downloads',
        url: 'https://blog.youtube/news-and-events/youtube-premium-lite-background-play-downloads/',
        source: 'YouTube Blog',
        sourceIcon: 'YouTube Blog',
        date: 'February 24, 2026',
        summaryEn: 'YouTube Premium Lite subscribers can now watch videos ad-free, offline, and in the background. This update brings requested features to the service.',
        summaryCn: 'YouTube Premium Lite 订阅用户现在可以无广告、离线和在后台观看视频。此更新为服务带来了用户请求的功能。'
      },
      {
        id: 2,
        title: 'YouTube TV Plans launching early 2026',
        url: 'https://blog.youtube/news-and-events/introducing-youtube-tv-plans-launching-early-2026/',
        source: 'YouTube Blog',
        sourceIcon: 'YouTube Blog',
        date: 'January 15, 2026',
        summaryEn: 'Early next year, we will launch YouTube TV Plans, bringing more choice and flexibility to our subscribers with over 10 genre-specific packages.',
        summaryCn: '明年年初，我们将推出 YouTube TV Plans，通过超过 10 个针对特定类型的订阅包为用户提供更多选择和灵活性。'
      },
      {
        id: 4,
        title: 'YouTube becomes latest DSP to launch AI-generated playlists',
        url: 'https://musically.com/2026/02/13/youtube-becomes-latest-dsp-to-launch-ai-generated-playlists/',
        source: 'Music Ally',
        sourceIcon: 'Musically',
        date: 'February 13, 2026',
        summaryEn: 'YouTube becomes the latest digital service provider to launch AI-generated playlists, joining Spotify, Amazon Music and Deezer.',
        summaryCn: 'YouTube 成为最新推出 AI 生成播放列表的数字服务提供商，加入了 Spotify、Amazon Music 和 Deezer 的行列。'
      },
      {
        id: 5,
        title: 'Another post-Super-Bowl spike for Bad Bunny – this time on YouTube',
        url: 'https://musically.com/2026/02/13/another-post-super-bowl-spike-for-bad-bunny-this-time-on-youtube/',
        source: 'Music Ally',
        sourceIcon: 'Musically',
        date: 'February 13, 2026',
        summaryEn: 'Bad Bunny sees another spike in streams post-Super Bowl, this time on YouTube following his performance.',
        summaryCn: 'Bad Bunny 在超级碗后再次出现流媒体激增，这次是在 YouTube 上。'
      },
      {
        id: 6,
        title: 'YouTube Creators Take On the Milan Winter Olympics 2026',
        url: 'https://blog.youtube/news-and-events/youtube-creators-milan-olympics/',
        source: 'YouTube Blog',
        sourceIcon: 'YouTube Blog',
        date: 'January 20, 2026',
        summaryEn: 'For the second time, YouTube is teaming up with NBCUniversal to send top creators to the Milano Cortina 2026 Winter Olympics.',
        summaryCn: 'YouTube 第二次与 NBCUniversal 合作，将顶级创作者送到 2026 年米兰科尔蒂纳冬季奥运会。'
      },
      {
        id: 7,
        title: 'Update to Advertiser-friendly content guidelines - 30-round magazines',
        url: 'https://support.google.com/youtube/answer/6162278',
        source: 'YouTube Policy',
        sourceIcon: 'YT Policy',
        date: 'February 2026',
        summaryEn: 'Content featuring 30-round magazines (whether attached or separate from a firearm) is now eligible to earn ad revenue. This updates the previous policy, which limited monetization to content displaying up to 29 rounds.',
        summaryCn: '包含30发弹匣的内容（无论是否附着在枪支上）现在有资格获得广告收入。这更新了之前的政策，该政策将盈利限制在显示最多29发的内容。'
      },
      {
        id: 8,
        title: 'Updates to Advertiser-friendly guidelines on shocking content',
        url: 'https://support.google.com/youtube/answer/6162278',
        source: 'YouTube Policy',
        sourceIcon: 'YT Policy',
        date: 'March 2026',
        summaryEn: 'Content featuring subjects that appear to be young, whether human or non-human, in distress featuring shock or disgust like body parts or gore is not eligible to earn ad revenue.',
        summaryCn: '包含看起来年轻的受试者（无论是人类还是非人类）处于痛苦中且涉及身体部位或血腥内容的内容，没有资格获得广告收入。'
      },
      {
        id: 9,
        title: 'Safeguards for search results - protecting younger viewers',
        url: 'https://www.youtube.com/howyoutubeworks/kids-and-teens/',
        source: 'YouTube Policy',
        sourceIcon: 'YT Policy',
        date: 'January 2026',
        summaryEn: 'To protect younger viewers, YouTube is adding a new search safety protection for teens that will prevent results from appearing for search terms linked to content that is either age-restricted or violative.',
        summaryCn: '为了保护年轻观众，YouTube 正在为青少年添加新的搜索安全保护措施，以防止与限制年龄或违规内容相关的搜索词结果显示出来。'
      },
      {
        id: 10,
        title: 'Upcoming changes to the number of concurrent live streams',
        url: 'https://support.google.com/youtube/answer/10008196',
        source: 'YouTube Policy',
        sourceIcon: 'YT Policy',
        date: 'February 2026',
        summaryEn: 'YouTube is reducing the number of maximum concurrent live streams allowed. An individual stream key or channel will be limited in the number of concurrent live streams it can broadcast. This update will roll out in the next few months.',
        summaryCn: 'YouTube 正在减少允许的最大并发直播数量。单个流密钥或频道的并发直播数量将受到限制。此更新将在未来几个月内推出。'
      }
    ]
  },
  {
    name: 'Spotify',
    icon: 'spotify',
    color: '#1DB954',
    borderClass: 'column-border-spotify',
    news: [
      {
        id: 1,
        title: 'Mon Laferte Leads All-Women Spotify Session as EQUAL Celebrations Kick Off',
        url: 'https://newsroom.spotify.com/2026-03-10/mon-laferte-spotify-session-equal-latin-america/',
        source: 'Spotify Newsroom',
        sourceIcon: 'Spotify Newsroom',
        date: 'March 10, 2026',
        summaryEn: 'Mon Laferte leads all-women Spotify Session as EQUAL celebrations kick off in Latin America.',
        summaryCn: 'Mon Laferte 领衔全女性 Spotify 音乐会，EQUAL 庆祝活动在拉丁美洲拉开帷幕。'
      },
      {
        id: 2,
        title: "Spotify's Creator Milestone Awards Honor the Latest Slate of Record-Breaking Podcasts",
        url: 'https://newsroom.spotify.com/2026-03-05/creator-milestone-awards-podcasts-q4-2025/',
        source: 'Spotify Newsroom',
        sourceIcon: 'Spotify Newsroom',
        date: 'March 5, 2026',
        summaryEn: "Spotify's Creator Milestone Awards honor the latest slate of record-breaking podcasts.",
        summaryCn: 'Spotify 创作者里程碑奖表彰最新一批打破纪录的播客。'
      },
      {
        id: 3,
        title: 'FKA twigs and Jordan Hemingway Explore the Making of HARD',
        url: 'https://newsroom.spotify.com/2026-03-04/fka-twigs-jordan-hemmingway-directed-by-music-video/',
        source: 'Spotify Newsroom',
        sourceIcon: 'Spotify Newsroom',
        date: 'March 4, 2026',
        summaryEn: "A new episode follows British artist FKA twigs and director Jordan Hemingway as they develop the video for 'HARD'.",
        summaryCn: '新一集跟随英国艺术家 FKA twigs 和导演 Jordan Hemingway 制作"HARD"音乐视频。'
      },
      {
        id: 4,
        title: 'Spotify Kicks Off Our 20th Anniversary at SXSW',
        url: 'https://newsroom.spotify.com/2026-03-03/spotify-20th-anniversary-sxsw/',
        source: 'Spotify Newsroom',
        sourceIcon: 'Spotify Newsroom',
        date: 'March 3, 2026',
        summaryEn: 'Spotify kicks off its 20th anniversary at SXSW with a celebration of artists, creators, and fans.',
        summaryCn: 'Spotify 在 SXSW 举办 20 周年庆典，庆祝艺术家、创作者和粉丝。'
      },
      {
        id: 5,
        title: 'HYBE and Spotify strike global content partnership for K-pop video podcasts',
        url: 'https://www.musicbusinessworldwide.com/hybe-and-spotify-team-up-on-k-pop-video-podcasts/',
        source: 'MBW',
        sourceIcon: 'MBW',
        date: 'March 10, 2026',
        summaryEn: 'HYBE and Spotify have announced a global content partnership that will put original K-pop video podcasts on the streaming platform.',
        summaryCn: 'HYBE 和 Spotify 宣布建立全球内容合作关系，将原创 K-pop 视频播客引入流媒体平台。'
      },
      {
        id: 6,
        title: 'Indie artists sue Google, claiming it mined music from YouTube to train Lyria',
        url: 'https://www.musicbusinessworldwide.com/indie-artists-sue-google-claiming-it-used-youtubes-own-catalog-to-train-lyria-3-ai-music-tool/',
        source: 'MBW',
        sourceIcon: 'MBW',
        date: 'March 10, 2026',
        summaryEn: 'Independent artists are suing Google, claiming it used YouTube catalog to train its Lyria AI music tool without permission.',
        summaryCn: '独立音乐人起诉 Google，指控其未经许可使用 YouTube 目录训练 Lyria AI 音乐工具。'
      },
      {
        id: 7,
        title: "Spotify hits a record 751M monthly users thanks to Wrapped, new free features",
        url: 'https://techcrunch.com/2026/02/10/spotify-hits-a-record-751m-monthly-users-thanks-to-wrapped-new-free-features/',
        source: 'TechCrunch',
        sourceIcon: 'TechCrunch',
        date: 'February 10, 2026',
        summaryEn: 'Swedish music streaming giant Spotify achieved a record 751 million monthly active users in Q4, representing an 11% increase from the previous year.',
        summaryCn: '瑞典流媒体巨头 Spotify 在第四季度创下了 7.51 亿月活跃用户的纪录，同比增长 11%。'
      },
      {
        id: 8,
        title: "Spotify says its best developers haven't written a line of code since December, thanks to AI",
        url: 'https://techcrunch.com/2026/02/12/spotify-says-its-best-developers-havent-written-a-line-of-code-since-december-thanks-to-ai/',
        source: 'TechCrunch',
        sourceIcon: 'TechCrunch',
        date: 'February 12, 2026',
        summaryEn: 'Spotify revealed during its fourth-quarter earnings call that its best developers have not written a single line of code since December 2025, thanks to AI.',
        summaryCn: 'Spotify 在第四季度财报电话会议上透露，由于 AI 技术，自 2025 年 12 月以来，其最优秀的开发者没有编写过一行代码。'
      },
      {
        id: 9,
        title: "Spotify rolls out AI-powered Prompted Playlists to the UK and other markets",
        url: 'https://techcrunch.com/2026/02/23/spotify-ai-prompted-playlists-uk-markets/',
        source: 'TechCrunch',
        sourceIcon: 'TechCrunch',
        date: 'February 23, 2026',
        summaryEn: 'Spotify announced it is rolling out its AI-powered "Prompted Playlist" feature to Premium subscribers in the U.K., Ireland, Australia, and Sweden.',
        summaryCn: 'Spotify 宣布将其 AI 驱动的"提示播放列表"功能扩展到英国、爱尔兰、澳大利亚和瑞典的 Premium 订阅用户。'
      },
      {
        id: 11,
        title: "Spotify is rolling out Audiobook Charts",
        url: 'https://techcrunch.com/2026/02/27/spotify-is-rolling-out-audiobook-charts/',
        source: 'TechCrunch',
        sourceIcon: 'TechCrunch',
        date: 'February 27, 2026',
        summaryEn: 'Spotify is launching Audiobook Charts for the U.S. and U.K. Similar to Music and Podcast Charts, the Audiobook Charts will be updated weekly.',
        summaryCn: 'Spotify 宣布推出美国和英国的有声读物排行榜。与音乐和播客排行榜类似，有声读物排行榜将每周更新。'
      },
      {
        id: 12,
        title: 'Spotify Paid Out a Record $11 Billion to the Music Industry in 2025',
        url: 'https://variety.com/2026/digital/news/spotify-paid-out-11-billion-to-music-industry-2025-1236642550/',
        source: 'Variety',
        sourceIcon: 'Variety',
        date: 'January 28, 2026',
        summaryEn: 'Spotify paid out a record $11 billion to the music industry in 2025, topping its previous-year total by $1 billion.',
        summaryCn: 'Spotify 在 2025 年向音乐产业支付了创纪录的 110 亿美元。'
      }
    ]
  }
];

// Platform Icon Component
const PlatformIcon = ({ platform, color, size = 24 }: { platform: string; color: string; size?: number }) => {
  if (platform === 'spotify') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    );
  }
  if (platform === 'youtube') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  if (platform === 'apple') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    );
  }
  if (platform === 'musically') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    );
  }
  return null;
};

// Source Badge Component
const SourceBadge = ({ source, icon }: { source: string; icon: string }) => {
  const getBadgeStyle = () => {
    switch (icon) {
      case 'Spotify': return { bg: '#1DB95420', color: '#1DB954', text: 'Spotify' };
      case 'Spotify Newsroom': return { bg: '#1DB95430', color: '#1DB954', text: 'Spotify Newsroom' };
      case 'YouTube': return { bg: '#FF000020', color: '#FF0000', text: 'YouTube' };
      case 'YouTube Blog': return { bg: '#FF000030', color: '#FF0000', text: 'YouTube Blog' };
      case 'MBW': return { bg: '#00000010', color: '#333333', text: 'MBW' };
      case 'Musically': return { bg: '#FF6B0020', color: '#FF6B00', text: 'Musically' };
      case 'YT Policy': return { bg: '#FF000010', color: '#FF0000', text: 'YT Policy' };
      case 'TechCrunch': return { bg: '#00000020', color: '#000000', text: 'TechCrunch' };
      case 'The Verge': return { bg: '#00ABC020', color: '#00ABCA', text: 'The Verge' };
      case 'Variety': return { bg: '#00000020', color: '#000000', text: 'Variety' };
      case 'Apple': return { bg: '#00000020', color: '#000000', text: 'Apple' };
      case 'Apple Newsroom': return { bg: '#A2AAAD30', color: '#A2AAAD', text: 'Apple Newsroom' };
      default: return { bg: '#E5E7EB', color: '#6B7280', text: source };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.text}
    </span>
  );
};

// News Item Component with Summary
const NewsItemComponent = ({ news, index }: { news: NewsItem; index: number }) => {
  const handleClick = () => {
    window.open(news.url, '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className="news-item-hover cursor-pointer border-b border-gray-100 fade-in-up"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="px-4 py-3">
        <h3 className="news-title text-gray-900 font-medium text-sm leading-snug hover:underline decoration-1 underline-offset-2">
          {news.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-xs">
          <Clock size={12} />
          <span>{news.date}</span>
          <span>•</span>
          <SourceBadge source={news.source} icon={news.sourceIcon} />
        </div>
        <div className="mt-2 p-2 bg-gray-50 rounded-md">
          <div className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-blue-600">EN:</span> {news.summaryEn}
          </div>
          <div className="text-xs text-gray-600 leading-relaxed mt-1">
            <span className="font-semibold text-red-500">中文:</span> {news.summaryCn}
          </div>
        </div>
      </div>
    </div>
  );
};

// Platform Column Component
const PlatformColumn = ({ platform, index, filteredSources }: { platform: Platform; index: number; filteredSources: string[] }) => {
  const filteredNews = filteredSources.length === 0
    ? platform.news
    : platform.news.filter(item => filteredSources.includes(item.sourceIcon));

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${platform.borderClass} fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlatformIcon platform={platform.icon} color={platform.color} size={24} />
          <h2 className="text-lg font-bold text-gray-900">{platform.name}</h2>
        </div>
        <span className="text-xs text-gray-400 font-medium">{filteredNews.length} articles</span>
      </div>
      <div className="max-h-[700px] overflow-y-auto">
        {filteredNews.length > 0 ? (
          filteredNews.map((item, idx) => (
            <NewsItemComponent key={item.id} news={item} index={idx} />
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No articles match the selected filters
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
function App() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showAutoRefreshMenu, setShowAutoRefreshMenu] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<string>('daily');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Get all unique sources
  const allSources = Array.from(new Set(platformNews.flatMap(p => p.news.map(n => n.sourceIcon))));

  const getTimeUntil10AM = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    if (now.getHours() < 10) {
      const today = new Date(now);
      today.setHours(10, 0, 0, 0);
      return today;
    }
    return tomorrow;
  };

  useEffect(() => {
    const saved = localStorage.getItem('autoRefreshInterval');
    if (saved) {
      setAutoRefreshInterval(saved);
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextRefresh = () => {
      const next10AM = getTimeUntil10AM();
      const msUntil10AM = next10AM.getTime() - Date.now();

      timeoutId = setTimeout(() => {
        handleRefresh();
        scheduleNextRefresh();
      }, msUntil10AM);
    };

    if (autoRefreshInterval === 'daily') {
      scheduleNextRefresh();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [autoRefreshInterval]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    setLastUpdated(new Date());
    setIsRefreshing(false);

    setToastMessage('新闻已更新完成！');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, [isRefreshing]);

  const handleAutoRefreshChange = (value: string) => {
    setAutoRefreshInterval(value);
    localStorage.setItem('autoRefreshInterval', value);
    setShowAutoRefreshMenu(false);

    const messages: Record<string, string> = {
      off: '已关闭自动刷新',
      daily: '已设置为每日 10:00 自动刷新',
    };
    setToastMessage(messages[value] || '设置已更新');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return '刚刚更新';
    if (minutes < 60) return `${minutes} 分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小时前`;
    return lastUpdated.toLocaleDateString('zh-CN');
  };

  const toggleSourceFilter = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const clearFilters = () => {
    setSelectedSources([]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
                <Music className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DSPNews</h1>
                <p className="text-xs text-gray-500">Digital Service Provider News</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  showFilterPanel || selectedSources.length > 0
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Filter size={14} />
                <span>
                  {selectedSources.length > 0 ? `筛选 (${selectedSources.length})` : '筛选来源'}
                </span>
              </button>

              <div className="flex items-center gap-1.5 text-gray-500 bg-green-50 px-3 py-1.5 rounded-md">
                <Sun size={14} className="text-green-600" />
                <span className="text-xs">下次更新: 10:00</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowAutoRefreshMenu(!showAutoRefreshMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Clock size={14} />
                  <span>
                    {autoRefreshInterval === 'off' && '自动刷新: 关闭'}
                    {autoRefreshInterval === 'daily' && '每日 10:00'}
                  </span>
                  <ChevronDown size={12} />
                </button>

                {showAutoRefreshMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => handleAutoRefreshChange('off')}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between ${autoRefreshInterval === 'off' ? 'text-green-600' : 'text-gray-700'}`}
                    >
                      关闭
                      {autoRefreshInterval === 'off' && <Check size={12} />}
                    </button>
                    <button
                      onClick={() => handleAutoRefreshChange('daily')}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between ${autoRefreshInterval === 'daily' ? 'text-green-600' : 'text-gray-700'}`}
                    >
                      每日 10:00
                      {autoRefreshInterval === 'daily' && <Check size={12} />}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isRefreshing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:from-rose-600 hover:to-purple-700'
                }`}
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                <span>{isRefreshing ? '更新中...' : '立即更新'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-gray-500">
                <span className="text-xs">上次更新: {formatLastUpdated()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 animate-fade-in-up">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">筛选新闻来源</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <X size={12} />
                清除筛选
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allSources.map(source => (
                <button
                  key={source}
                  onClick={() => toggleSourceFilter(source)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    selectedSources.includes(source)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Bar */}
      {isRefreshing && (
        <div className="h-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 animate-pulse" />
      )}

      {/* Main Content - Three Columns */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformNews.map((platform, index) => (
            <PlatformColumn
              key={platform.name}
              platform={platform}
              index={index}
              filteredSources={selectedSources}
            />
          ))}
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up z-50">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-xs text-gray-400">
            News sources: Spotify Newsroom, YouTube Blog, YouTube Policy, Apple Newsroom, Music Ally (Musically), Music Business Worldwide (MBW), TechCrunch, Variety
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
