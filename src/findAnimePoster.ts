import axios from 'axios';
import cheerio from 'cheerio';

export async function findPoster(animeName: string) {
    const biliSearch: string = `https://www.bilibili.tv/search-result?q=${animeName}`

    try {
        const response = await axios.get(biliSearch);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
        
            // Find the element with the original selector
            let element = $('#app > div > div > section > main > div > section > div.search-result__main > ul > li.all-sheet__item.all-sheet__ogv > div > div > ul > li:nth-child(1) > div > div.ogv__cover-wrap > div > a > img');
        
            // Check if the element was found
            if (element.length === 0) {
                // If the element was not found, try the new selector
                element = $('#app > div > div > section > main > div > section > div.search-result__main > ul > li.all-sheet__item.all-sheet__ogv_subject > div > div > div > div > ul > li:nth-child(1) > div > div.ogv__cover-wrap > div > a > img');
            }
        
            if (element.length > 0) {
                // Get the text content of the element
                let animePoster = element.attr('src');
        
                if (animePoster?.endsWith('.webp')) {
                    // Replace .webp with .png
                    animePoster = animePoster?.replace('.webp', '.png');
        
                    // Now pngPoster contains the URL with .png extension
                    return animePoster as string;
                } else {
                    // If the URL doesn't end with .webp, return it as is
                    return animePoster;
                }
            } else {
                return console.error('No data found, findPoster');
            }
        } else {
            return console.error('Unable to fetch data', 'findPoster');
        }        
    } catch (error) {
        return console.error('An error occurred while fetching data:', error, 'findPoster');
    }
}