import e from "express";
import { findName } from "../findAnimeName";
import { findPoster } from '../findAnimePoster';
import { storyCreator } from '../storyCreator'

import axios from 'axios';

// Convert to string
var BiliLink = 'https://bili.im/TalWaSH';

async function mainTest(BiliLink: string) {
    console.log('Function got',BiliLink)

    if (!BiliLink || BiliLink === undefined) throw new Error("BiliLink not found")

    const linkRegex = /(https?:\/\/[^\s]+)/;
    const match = BiliLink.match(linkRegex);


    if (match) {
        const link = match[1];
        const title = BiliLink.replace(link, '').trim();

        BiliLink = link;

        if (BiliLink) {
            const animeName: string = await findName(BiliLink) as string; //Anime Name
            console.log(animeName);
            if (!animeName || animeName === undefined) throw new Error("anime not found")

            const biliSearch: string = `https://www.bilibili.tv/search-result?q=${animeName}`

            var animePoster;
            try {
                const response = await axios.get(biliSearch);

                if (response.status === 200) {
                    animePoster = 'OK';
                } else throw new Error("poster not found")
            } catch {
                throw new Error('Unable to fetch data findPoster');
            }
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
        } else throw new Error('Invalid parameter');
    } else {
        if (BiliLink) {
            const animeName: string = BiliLink;
            if (!animeName || animeName === undefined) throw new Error("anime not found")
            console.log(animeName);

            const biliSearch: string = `https://www.bilibili.tv/search-result?q=${animeName}`
            var animePoster;
            try {
                const response = await axios.get(biliSearch);

                if (response.status === 200) {
                    animePoster = 'OK';
                } else throw new Error("poster not found")
            } catch {
                throw new Error('Unable to fetch data findPoster');
            }
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
        } else throw new Error('Invalid parameter');
    }
}

mainTest(BiliLink)