export interface AuditResult {
  url: string;
  title: string;
  metaDescription: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  links: {
    internal: string[];
    external: string[];
  };
  images: {
    total: number;
    missingAlt: number;
  };
  performance: {
    loadTime: number;
    pageSize: number;
  };
  accessibility: {
    hasLang: boolean;
    hasSkipLink: boolean;
    hasAriaLabels: number;
    hasAriaRoles: number;
    hasFormLabels: number;
    hasTableHeaders: number;
    hasLandmarks: number;
    colorContrast: boolean;
    hasKeyboardNavigation: boolean;
  };
}

export const crawlWebsite = async (url: string): Promise<AuditResult> => {
  const startTime: number = performance.now();
  try {
    // Use a more reliable CORS proxy
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const response = await fetch(corsProxy + encodeURIComponent(url), {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    if (!html || html.length < 100) {
      throw new Error('Received empty or invalid response from the server');
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract basic information
    const title = doc.querySelector('title')?.textContent?.trim() || '';
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';

    // Extract headings
    const headings = {
      h1: Array.from(doc.querySelectorAll('h1')).map(h => h.textContent?.trim() || ''),
      h2: Array.from(doc.querySelectorAll('h2')).map(h => h.textContent?.trim() || ''),
      h3: Array.from(doc.querySelectorAll('h3')).map(h => h.textContent?.trim() || ''),
    };

    // Extract links
    const allLinks = Array.from(doc.querySelectorAll('a[href]'));
    const baseUrl = new URL(url);
    const links = {
      internal: allLinks
        .filter(link => {
          try {
            const href = link.getAttribute('href');
            if (!href) return false;
            const linkUrl = new URL(href, url);
            return linkUrl.hostname === baseUrl.hostname;
          } catch {
            return false;
          }
        })
        .map(link => link.getAttribute('href') || ''),
      external: allLinks
        .filter(link => {
          try {
            const href = link.getAttribute('href');
            if (!href) return false;
            const linkUrl = new URL(href, url);
            return linkUrl.hostname !== baseUrl.hostname;
          } catch {
            return false;
          }
        })
        .map(link => link.getAttribute('href') || ''),
    };

    // Analyze images
    const images = Array.from(doc.querySelectorAll('img'));
    const imageAnalysis = {
      total: images.length,
      missingAlt: images.filter(img => !img.hasAttribute('alt')).length,
    };

    // Accessibility checks
    const accessibility = {
      hasLang: !!doc.documentElement.getAttribute('lang'),
      hasSkipLink: !!doc.querySelector('a[href="#main-content"]'),
      hasAriaLabels: doc.querySelectorAll('[aria-label]').length,
      hasAriaRoles: doc.querySelectorAll('[role]').length,
      hasFormLabels: doc.querySelectorAll('form label').length,
      hasTableHeaders: doc.querySelectorAll('th').length,
      hasLandmarks: doc.querySelectorAll('[role="main"], [role="navigation"], [role="complementary"], [role="contentinfo"]').length,
      colorContrast: true, // This would require more complex analysis
      hasKeyboardNavigation: !!doc.querySelector('a:focus, button:focus, input:focus, select:focus, textarea:focus'),
    };

    const endTime: number = performance.now();
    const performanceMetrics = {
      loadTime: endTime - startTime,
      pageSize: html.length,
    };

    return {
      url,
      title,
      metaDescription,
      headings,
      links,
      images: imageAnalysis,
      performance: performanceMetrics,
      accessibility,
    };
  } catch (error) {
    console.error('Error crawling website:', error);
    throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the URL is accessible and try again.`);
  }
}; 