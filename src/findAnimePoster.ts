import axios from 'axios';
import * as cheerio from 'cheerio';

export async function findPoster(animeName: string) {
    // Normalize whitespace (replaces NBSP and other whitespace with regular space)
    animeName = animeName.replace(/\s+/g, ' ').trim();
    const query = `${animeName} Anime`;
    const biliSearch: string = `https://www.bilibili.tv/search-result?q=${encodeURIComponent(query)}`
    console.log('Searching Bilibili for poster:', biliSearch);

    try {
        const response = await axios.get(biliSearch, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
        
            // Look for OGV items (Official Genre Videos)
            let ogvItem = $('.all-sheet__item.all-sheet__ogv li:nth-child(1), .all-sheet__item.all-sheet__ogv_subject li:nth-child(1)').first();
            
            if (ogvItem.length > 0) {
                let animePoster = ogvItem.find('img').attr('src');
                let foundTitle = ogvItem.find('.ogv__content-title, .ogv__title, .highlights').text().trim();

                // If we found a title and it seems valid, or if we have a poster and no better option
                if (animePoster) {
                    // Check if the title is a reasonable match for the animeName
                    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
                    const cleanName = clean(animeName);
                    const cleanFoundTitle = clean(foundTitle);

                    // Basic fuzzy check: ignore "Season", "Part", "TV" etc. for matching
                    const simplify = (s: string) => s.replace(/\b(season|part|tv|anime|special|ova|ona)\b/gi, '').replace(/\s+/g, ' ').trim();
                    const simpleName = clean(simplify(animeName));
                    const simpleFoundTitle = clean(simplify(foundTitle));

                    // Check if all words of simpleFoundTitle are in cleanName
                    const wordsFound = simpleFoundTitle.split(' ').filter(w => w.length > 1);
                    const wordsSearch = simpleName.split(' ').filter(w => w.length > 1);
                    
                    const intersection = wordsFound.filter(w => wordsSearch.includes(w));
                    // Calculate Jaccard-like similarity: intersection / union
                    const union = new Set([...wordsFound, ...wordsSearch]);
                    const similarity = intersection.length / union.size;

                    // Also check if one is a significant substring of the other
                    const isSubset = cleanFoundTitle.includes(simpleName) || simpleName.includes(cleanFoundTitle);
                    
                    // User requested 70% threshold
                    const isMatch = (similarity >= 0.7) || (isSubset && similarity >= 0.5);

                    if (foundTitle && isMatch) {
                         if (animePoster.endsWith('.webp')) {
                            animePoster = animePoster.replace('.webp', '.png');
                        }
                        console.log(`Poster found on Bilibili: "${foundTitle}" (Similarity: ${(similarity * 100).toFixed(1)}%)`);
                        return animePoster;
                    }
                    console.log(`Bilibili: "${foundTitle}" (${(similarity * 100).toFixed(1)}% match), "${animeName}". Trying Jikan.`);

                    // If title doesn't match well, try Jikan first before settling for Bilibili
                    const jikanResult = await findPosterJikan(animeName);
                    if (jikanResult) return jikanResult;

                    // Final fallback to Bilibili if Jikan failed
                    if (animePoster.endsWith('.webp')) {
                        animePoster = animePoster.replace('.webp', '.png');
                    }
                    console.log(`Poster found on Bilibili (No strong title match: "${foundTitle}")`);
                    return animePoster;
                }
            } else {
                console.error('No data found on Bilibili, findPoster');
            }
            
            return await findPosterJikan(animeName);
        } else {
            console.error('Unable to fetch data from Bilibili', 'findPoster');
            return await findPosterJikan(animeName);
        }        
    } catch (error) {
        console.error('An error occurred while fetching from Bilibili:', error, 'findPoster');
        return await findPosterJikan(animeName);
    }
}

async function findPosterJikan(animeName: string) {
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`);
        console.log('Searching Jikan for poster:', `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`);
        if (response.status === 200 && response.data.data && response.data.data.length > 0) {
            const animeData = response.data.data[0];
            console.log('Poster found on Jikan fallback');
            // Prefer JPG as node-canvas on Windows might not support WebP
            console.log(`Image urls from Jikan: JPG: ${animeData.images.jpg.large_image_url}, WebP: ${animeData.images.webp.large_image_url}`);
            return animeData.images.jpg.large_image_url || animeData.images.webp.large_image_url;
        }
    } catch (error) {
        console.error('An error occurred while fetching from Jikan:', error, 'findPosterJikan');
    }
    return undefined;
}