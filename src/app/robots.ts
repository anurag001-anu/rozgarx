import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rozgarx.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',         // Payload CMS Dashboard
        '/profile',       // User Dashboard
        '/login',         // Auth Routes
        '/register',      // Auth Routes
        '/employer',      // Employer Dashboard
        '/api',           // Internal APIs
        // Note: We DO NOT disallow /jobs?* here. We let bots crawl them and rely on 
        // canonical tags & noindex inside the pages to handle indexing logic safely.
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
