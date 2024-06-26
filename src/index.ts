import express from 'express';
import bodyParser from 'body-parser';
const fs = require('fs').promises; // Use the promise-based version of 'fs'

import { workCounter } from './workCounter';
import { findName } from "./findAnimeName";
import { findPoster } from './findAnimePoster';
import { storyCreator } from './storyCreator';

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
    let biliLink;

    if (req.headers.bililink) {
        biliLink = req.headers.bililink;
    } else {
        biliLink = req.body.biliLink || req.query.biliLink || '';
    }

    // Convert to string
    var BiliLink = String(biliLink || '').replace(/%20/g, ' ');
    // Handle not support bilbili.com
    if (BiliLink.includes("bilibili.com")) {
        return res.status(400).json({ error: `We do not support the Chinese version of Bilibili url.` });
    }
    console.log(BiliLink);

    const linkRegex = /(https?:\/\/[^\s]+)/;
    const match = BiliLink.match(linkRegex);

    if (match) {
        const link = match[1];
        const title = BiliLink.replace(link, '').trim();

        BiliLink = link;

        if (BiliLink) {
            const animeName: string[] = await findName(BiliLink) //Anime Name
            console.log(animeName);
            if (!animeName) return res.status(400).json({ error: 'anime not found' });
            const animePoster: string = await findPoster(animeName[1]) as string; //Anime Poster
            if (!animePoster || animePoster === undefined) return res.status(400).json({ error: 'anime poster not found' });
            const storyImageBase64: string = await storyCreator(animePoster, animeName[0]) as string;

            //response main API
            res.json({ title: title, imageBase64: storyImageBase64 });
            await workCounter();
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
            res.json({ title: animeName, imageBase64: storyImageBase64 });
            await workCounter();
            return;
        } else return res.status(400).json({ error: 'Invalid parameter' });
    }
});

app.get(/\/worktimes$/, async (req, res) => {
    const filePath = 'assets/json/worktimes.json'; // Read json file

    try {
        // Read the file
        const data = await fs.readFile(filePath, 'utf8');
        
        // Parse the JSON
        const jsonObject = JSON.parse(data);
        
        // Send a response back
        const pre_responseJson = {
            "schemaVersion": 1,
            "label": "Card generated",
            "message": `${jsonObject.process.worktimes} Times`,
            "color": "blue",
            "style": "for-the-badge",
            
        }
        res.json(pre_responseJson);
    } catch (error) {
        // Handle errors (file not found, JSON parse error, etc.)
        console.error(error);
        res.status(500).send('An error occurred');
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
