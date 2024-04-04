import axios from 'axios';

import { findName } from "../findAnimeName";

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
            const animeName: string[] = await findName(BiliLink) //Anime Name
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
            //Result
            console.log('');
            console.log('');
            console.log(`++++++++++++++++++++++++++++
            RESULT`);
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
            //Result
            console.log('');
            console.log('');
            console.log(`++++++++++++++++++++++++++++
            RESULT`);
            console.log('Function got',BiliLink)
            console.log('Anime Name', animeName);
            console.log('Poster Image', animePoster);
            console.log('Status OK');
            return;
        } else throw new Error('Invalid parameter');
    }
}

mainTest(BiliLink)