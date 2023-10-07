import express from 'express';
import bodyParser from 'body-parser';

import { findName } from "./findAnimeName";
import { findPoster } from './findAnimePoster';
import { storyCreator } from './storyCreator'

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// API Route
app.get('/api', async (req, res) => {
    const { biliLink } = req.query;

    // Convert to string
    const BiliLink = biliLink?.toString() || '';
    console.log(biliLink)

    if (biliLink) {
        const animeName: string = await findName(BiliLink) as string; //Anime Name
        const animePoster: string = await findPoster(animeName) as string; //Anime Poster
        console.log(animeName);
        const storyImageBase64 = await storyCreator(animePoster, animeName);

        //response main API
        res.json({ imageBase64: storyImageBase64 });
    } else {
        res.status(400).json({ error: 'Invalid parameter' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
