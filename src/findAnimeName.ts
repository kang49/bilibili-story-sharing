import axios from 'axios';
import * as cheerio from 'cheerio';

export async function regenerate_path(orgin_biliLink: string) {
  const domain = 'https://www.bilibili.tv';
  const path = orgin_biliLink.replace(domain, '');
  const newPath = path.replace(/\/(en|th)\//, '/play/');

  return domain + newPath;
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
    const redirectedLink = initialResponse.request.res.responseUrl;
    
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
