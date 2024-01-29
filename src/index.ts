import express from 'express';
import bodyParser from 'body-parser';

import { workCouter } from './workCounter';
import { findName } from "./findAnimeName";
import { findPoster } from './findAnimePoster';
import { storyCreator } from './storyCreator'

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all hosts
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, Authorization');
    next();
});

// API Route
app.get(/\/api$/, async (req, res) => {
    const { biliLink } = req.body.biliLink ?? req.query;

    // Convert to string
    var BiliLink = biliLink?.toString() || '';
    console.log(BiliLink)

    const linkRegex = /(https?:\/\/[^\s]+)/;
    const match = BiliLink.match(linkRegex);

    if (match) {
        const link = match[1];
        const title = BiliLink.replace(link, '').trim();

        BiliLink = link;

        if (BiliLink) {
            const animeName: string = await findName(BiliLink) as string; //Anime Name
            console.log(animeName);
            if (!animeName) return res.status(400).json({ error: 'anime not found' });
            const animePoster: string = await findPoster(animeName) as string; //Anime Poster
            if (!animePoster || animePoster === undefined) return res.status(400).json({ error: 'anime poster not found' });
            const storyImageBase64: string = await storyCreator(animePoster, animeName) as string;

            //response main API
            res.json({ imageBase64: storyImageBase64 });
            await workCouter();
            return;
        } else return res.status(400).json({ error: 'Invalid parameter' });
    } else {
        if (BiliLink) {
            const animeName: string = BiliLink;
            console.log(animeName);

            const animePoster: string = await findPoster(animeName) as string; //Anime Poster
            if (!animePoster || animePoster === undefined) return res.status(400).json({ error: 'anime poster not found' });
            const storyImageBase64: string = await storyCreator(animePoster, animeName) as string;

            //response main API
            res.json({ imageBase64: storyImageBase64 });
            await workCouter();
            return;
        } else return res.status(400).json({ error: 'Invalid parameter' });
    }
});

app.get(/\/ping$/, async (req, res) => {
    res.send('pong');
});

app.get('/', async (req, res) => {
    res.send('Welcome to Bilibili Story Builder API');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
