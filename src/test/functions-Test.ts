import fs from 'fs';
import { findName } from '../findAnimeName';
import { findPoster } from '../findAnimePoster';
import { storyCreator } from '../storyCreator';

async function testLink(link: string) {
    console.log(`Testing Link: ${link}`);
    try {
        const names = await findName(link);
        console.log('Extracted Names:', names);
        
        if (!names || names.length === 0) throw new Error('No names found');

        let animePoster: string | undefined;
        let usedName = '';
        
        for (const name of names) {
            if (!name || name.includes('Error') || name.includes('No data found')) continue;
            console.log(`Trying name: "${name}"`);
            animePoster = await findPoster(name) as string;
            if (animePoster) {
                usedName = name;
                break;
            }
        }

        if (!animePoster) {
            console.log('Poster not found on Bilibili or Jikan fallback.');
            return;
        }

        console.log('Creating story image...');
        const base64 = await storyCreator(animePoster, usedName) as string;
        
        const buffer = Buffer.from(base64, 'base64');
        fs.writeFileSync('test_link_1003031.png', buffer);
        console.log('Success! Image saved as test_link_1003031.png');
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

// Fixed the malformed link by adding '?' before bstar_from
const targetLink = 'https://www.bilibili.tv/th/play/1003031?bstar_from=bstar-web.mylist-video.0.0';
testLink(targetLink);
// run test file: npx ts-node src/test/test-new-link.ts