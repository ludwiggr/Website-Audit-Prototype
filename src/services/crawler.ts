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
    // Use a CORS proxy to bypass CORS restrictions
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const response = await fetch(corsProxy + url, {
      headers: {
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract basic information
    const title = doc.querySelector('title')?.textContent || '';
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    // Extract headings
    const headings = {
      h1: Array.from(doc.querySelectorAll('h1')).map(h => h.textContent || ''),
      h2: Array.from(doc.querySelectorAll('h2')).map(h => h.textContent || ''),
      h3: Array.from(doc.querySelectorAll('h3')).map(h => h.textContent || ''),
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
    throw new Error('Failed to analyze website. Please ensure the URL is accessible and try again.');
  }
}; 