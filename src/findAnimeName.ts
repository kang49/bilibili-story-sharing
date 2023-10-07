import axios from 'axios';
import cheerio from 'cheerio';

export async function findName(BiliLink: string) {
    try {
        const response = await axios.get(BiliLink);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            // Find the element with the specified selector
            const element = $('#app > div > div > section > main > div > section > div.video-play__meta.video-play__meta--ogv > section > header > h1 > a');

            // Check if the element was found
            if (element.length > 0) {
                // Get the text content of the element
                const animeName = element.text();
                return animeName as string;
            } else {
                return console.error('No data found, findName');
            }

            // Add code to retrieve additional data from the website as needed.
        } else {
            return console.error('Unable to fetch data');
        }
    } catch (error) {
        return console.error('An error occurred while fetching data:', error);
    }
}
