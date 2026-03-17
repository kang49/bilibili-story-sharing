import axios from 'axios';
import * as cheerio from 'cheerio';

function isAllowedBilibiliUrl(url: URL): boolean {
  return url.protocol === 'https:' && url.hostname === 'www.bilibili.tv';
}

export async function regenerate_path(orgin_biliLink: string) {
  const domain = 'https://www.bilibili.tv';

  try {
    const url = new URL(orgin_biliLink);

    // Enforce allowed scheme and host to mitigate SSRF
    if (!isAllowedBilibiliUrl(url)) {
      throw new Error('Unsupported Bilibili URL domain or protocol.');
    }

    // Normalize the path: turn /en/ or /th/ into /play/ within the pathname
    const normalizedPath = url.pathname.replace(/\/(en|th)\//, '/play/');

    // Reconstruct the URL using the trusted domain and normalized path
    const normalizedUrl =
      domain +
      normalizedPath +
      (url.search || '') +
      (url.hash || '');

    return normalizedUrl;
  } catch (e) {
    // If URL parsing or validation fails, propagate the error to be handled by the caller
    throw new Error('Invalid Bilibili URL provided.');
  }
}

export async function findName(biliLink: string) {
  biliLink = await regenerate_path(biliLink); // Ensure we have a consistent URL format for fetching names (Security)
  const fetchPageName = async (url: string) => {
    try {
      const response = await axios.get(url);
      if (response.status !== 200) throw new Error('Failed to fetch page data, findname');
      
      const $ = cheerio.load(response.data);
      const elementSelector = '#app > div > div > section > main > div > section > div.video-play__meta.video-play__meta--ogv > section > header > h1 > a';
      const element = $(elementSelector);

      if (element.length > 0) {
        // Normalize whitespace characters (e.g. \u00A0 to \u0020)
        return element.text().trim().replace(/\s+/g, ' ');
      }
      return 'No data found, findname';
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error, 'findname');
      return 'Error fetching data, findname';
    }
  };

  try {
    // Fetch the original page to get the response URL for possible redirection
    const initialResponse = await axios.get(biliLink);
    const redirectedLink: string =
      (initialResponse.request && initialResponse.request.res && initialResponse.request.res.responseUrl) ||
      biliLink;

    let parsedRedirectUrl: URL;
    try {
      parsedRedirectUrl = new URL(redirectedLink);
    } catch {
      throw new Error('Invalid redirect URL from Bilibili.');
    }

    // Enforce allowed scheme and host on redirect to mitigate SSRF
    if (!isAllowedBilibiliUrl(parsedRedirectUrl)) {
      throw new Error('Unsupported redirect domain or protocol from Bilibili.');
    }
    
    // Ensure we have both /en/ and /th/ versions
    let enBiliLink: string;
    let thBiliLink: string;

    if (redirectedLink.includes('/th/')) {
        thBiliLink = redirectedLink;
        enBiliLink = redirectedLink.replace('/th/', '/en/');
    } else if (redirectedLink.includes('/en/')) {
        enBiliLink = redirectedLink;
        thBiliLink = redirectedLink.replace('/en/', '/th/');
    } else {
        // Fallback for other regions, try to force en and th
        enBiliLink = redirectedLink.replace(/\/play\//, '/en/play/');
        thBiliLink = redirectedLink.replace(/\/play\//, '/th/play/');
    }

    const names = await Promise.all([
      fetchPageName(enBiliLink),
      fetchPageName(thBiliLink)
    ]);

    return names;
  } catch (error) {
    console.error('An error occurred while fetching data:', error, 'findname');
    return ['Error fetching data', 'Error fetching data', 'findname'];
  }
}
