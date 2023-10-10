import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

function openApiPortTest() {
    try {
        // API Route
        app.get('/api', async (req, res) => {
            const { biliLink } = req.query;
        });

        // Open port testing
        app.listen(port, async () => {
            console.log(`Server is running on port ${port}`);
            console.log('Status OK');
            
            // End the program
            process.exit();
        });
    } catch (error) {
        console.error('Open port Error', error);
        // End the program with a non-zero exit code to indicate an error
        process.exit(1);
    }
}

openApiPortTest();
