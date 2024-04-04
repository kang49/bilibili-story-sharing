import axios from 'axios';
import cheerio from 'cheerio';

export async function findName(biliLink: string) {
  const fetchPageName = async (url: string) => {
    try {
      const { data, status } = await axios.get(url);
      if (status !== 200) throw new Error('Failed to fetch page data, findname');
      
      const $ = cheerio.load(data);
      const elementSelector = '#app > div > div > section > main > div > section > div.video-play__meta.video-play__meta--ogv > section > header > h1 > a';
      const element = $(elementSelector);

      return element.length > 0 ? element.text().trim() : 'No data found, findname';
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error, 'findname');
      return 'Error fetching data, findname';
    }
  };

  try {
    // Fetch the original page to get the response URL for possible redirection
    const { request } = await axios.get(biliLink);
    const originalLink = request.res.responseUrl;
    const thBiliLink = originalLink.replace('/en/', '/th/');

    const names = await Promise.all([
      fetchPageName(originalLink),
      fetchPageName(thBiliLink)
    ]);

    return names;
  } catch (error) {
    console.error('An error occurred while fetching data:', error, 'findname');
    return ['Error fetching data', 'Error fetching data', 'findname'];
  }
}
