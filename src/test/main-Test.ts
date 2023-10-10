import { workCouter } from '../workCounter';
import { findName } from "../findAnimeName";
import { findPoster } from '../findAnimePoster';
import { storyCreator } from '../storyCreator'

// Convert to string
var BiliLink = 'https://bili.im/TalWaSH';

async function mainTest(BiliLink: string) {
    console.log('Function got',BiliLink)

    const linkRegex = /(https?:\/\/[^\s]+)/;
    const match = BiliLink.match(linkRegex);


    if (match) {
        const link = match[1];
        const title = BiliLink.replace(link, '').trim();

        BiliLink = link;

        if (BiliLink) {
            const animeName: string = await findName(BiliLink) as string; //Anime Name
            console.log(animeName);
            if (!animeName) {
                return console.error('anime not found')
            }
            const animePoster: string = await findPoster(animeName) as string; //Anime Poster
            const storyImageBase64: string = await storyCreator(animePoster, animeName) as string;

            //Build Base64
            const exStoryImageBase64 = storyImageBase64.slice(0, 200);
            //Result
            console.log('');
            console.log('');
            console.log(`++++++++++++++++++++++++++++
            RESULT`);
            console.log('Base64 200C', exStoryImageBase64);
            console.log('Function got',BiliLink)
            console.log('Anime Name', animeName);
            console.log('Poster Image', animePoster);
            console.log('Status OK');
            return;
        } else return console.error('Invalid parameter');
    } else {
        if (BiliLink) {
            const animeName: string = BiliLink;
            console.log(animeName);

            const animePoster: string = await findPoster(animeName) as string; //Anime Poster
            const storyImageBase64: string = await storyCreator(animePoster, animeName) as string;

            const exStoryImageBase64 = storyImageBase64.slice(0, 200);
            //Result
            console.log('');
            console.log('');
            console.log(`++++++++++++++++++++++++++++
            RESULT`);
            console.log('Base64 200C', exStoryImageBase64);
            console.log('Function got',BiliLink)
            console.log('Anime Name', animeName);
            console.log('Poster Image', animePoster);
            console.log('Status OK');
            return;
        } else return console.error('Invalid parameter');
    }
}

mainTest(BiliLink)