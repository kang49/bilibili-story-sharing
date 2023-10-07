import { createCanvas, loadImage } from 'canvas';
const StackBlur = require('stackblur-canvas');
import fs from 'fs';

export function storyCreator(animePoster: string, animeName: string) {
    return new Promise((resolve, reject) => {
        // Create canvas with a fixed size of 1080x1920
        const canvas = createCanvas(1080, 1920);
        const ctx = canvas.getContext('2d');

        // Load the blurred image
        loadImage(animePoster).then(async (image) => {
            // Calculate the scale factors for width and height to fit the canvas exactly
            const scaleWidth = canvas.width / image.width;
            const scaleHeight = canvas.height / image.height;

            // Use the larger scale factor to fit the image while maintaining proportions
            const scale = Math.max(scaleWidth, scaleHeight);
            const newWidth = image.width * scale;
            const newHeight = image.height * scale;

            // Calculate the position to center the image
            const x = (canvas.width - newWidth) / 2;
            const y = (canvas.height - newHeight) / 2;

            // Draw the image onto the canvas
            ctx.drawImage(image, x, y, newWidth, newHeight);

            // Apply StackBlur.js to the canvas
            StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, 100); // Adjust the blur radius as needed

            // Load the frame image
            loadImage('assets/img/bilibili_frame.png').then((frameImage) => {
                // Draw the frame image on top of the canvas
                ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

                // Fill anime name animeName
                ctx.fillStyle = 'black';
                ctx.font = 'bold 55px Arial';

                // Define the animeName position (adjust as needed)
                const animeNameX = 250; // X-coordinate
                const animeNameY = 1330; // Y-coordinate

                // Define the maximum line width and animeName
                const maxLineWidth = 600;

                // Function to split animeName into lines that fit within the maxLineWidth
                function splitTextIntoLines_Word(animeName: string, maxLineWidth: number) {
                    const words = animeName.split(' ');
                    const lines = [];
                    let currentLine = words[0];

                    for (let i = 1; i < words.length; i++) {
                        const word = words[i];
                        const testLine = currentLine + ' ' + word;
                        const testLineWidth = ctx.measureText(testLine).width;

                        if (testLineWidth <= maxLineWidth) {
                            currentLine = testLine;
                        } else {
                            // Check if adding the word would cut off the last word
                            const lastLine = lines[lines.length - 1];
                            const lastLineWidth = ctx.measureText(lastLine).width;
                            if (lastLineWidth + ctx.measureText(' ' + word).width <= maxLineWidth) {
                                // Add the word to the last line instead of starting a new one
                                lines[lines.length - 1] += ' ' + word;
                            } else {
                                // Start a new line
                                lines.push(currentLine);
                                currentLine = word;
                            }
                        }

                        // Limit to two lines
                        if (lines.length >= 2) {
                            break;
                        }
                    }

                    lines.push(currentLine);
                    return lines;
                }
                function splitTextIntoLines_Char(animeName: string, maxLineWidth: number) {
                    const characters = animeName.split('');
                    const lines = [];
                    let currentLine = characters[0];

                    for (let i = 1; i < characters.length; i++) {
                        const character = characters[i];
                        const testLine = currentLine + character;
                        // Measure the width of the line (you'll need to have the canvas conanimeName, ctx, defined)
                        const testLineWidth = ctx.measureText(testLine).width;

                        if (testLineWidth <= maxLineWidth) {
                            currentLine = testLine;
                        } else {
                            // Start a new line
                            lines.push(currentLine);
                            currentLine = character;
                        }

                        // Limit to two lines
                        if (lines.length >= 2) {
                            break;
                        }
                    }

                    lines.push(currentLine);
                    return lines;
                }

                function isThaiCharacter(char: string) {
                    const thaiUnicodeRange = /^[\u0E00-\u0E7F]+$/;
                    return thaiUnicodeRange.test(char);
                }

                function detectLanguage(animeName: string | any[]) {
                    for (let i = 0; i < animeName.length; i++) {
                        if (isThaiCharacter(animeName[i])) {
                            return true;
                        }
                    }
                    return false;
                }
                const language = detectLanguage(animeName);
                if (language === true) {
                    // Split the animeName into lines
                    var lines = splitTextIntoLines_Char(animeName, maxLineWidth);

                    const lineHeight = 65; // Adjust as needed
                    for (let i = 0; i < lines.length; i++) {
                        const line = i === 1 && lines.length > 2 ? `${lines[i].slice(0, -3)}...` : lines[i];
                        ctx.fillText(line, animeNameX, animeNameY + i * lineHeight);
                        if (i === 1) break;
                    }
                } else {
                    var lines = splitTextIntoLines_Word(animeName, maxLineWidth);

                    // Draw each line of animeName with an ellipsis if needed
                    const lineHeight = 65; // Adjust as needed
                    for (let i = 0; i < lines.length; i++) {
                        const line = i === 1 && lines.length > 2 ? `${lines[i].slice(0, -3)}...` : lines[i];
                        ctx.fillText(line, animeNameX, animeNameY + i * lineHeight);
                        if (i === 1) break;
                    }
                }

                // Define the position and size of the rounded rectangle
                const x = 245;
                const y = 440;
                const width = 600;
                const height = 800;
                const borderRadius = 27; // Adjust this value as needed for your desired border radius

                // Draw the rounded rectangle as a clipping mask
                ctx.beginPath();
                ctx.moveTo(x + borderRadius, y);
                ctx.lineTo(x + width - borderRadius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
                ctx.lineTo(x + width, y + height - borderRadius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
                ctx.lineTo(x + borderRadius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
                ctx.lineTo(x, y + borderRadius);
                ctx.quadraticCurveTo(x, y, x + borderRadius, y);
                ctx.closePath();
                ctx.clip();

                // Load the anime poster image
                loadImage(animePoster).then((posterImage) => {
                    // Draw the clipped image inside the rounded rectangle
                    ctx.drawImage(posterImage, x, y, width, height);

                    // Save the result as a file
                    const storyImageBuffer = canvas.toBuffer();
                    const storyImageBase64 = storyImageBuffer.toString('base64');
                    resolve(storyImageBase64);
                    // const outputFileName = 'output.png';
                    // const stream = fs.createWriteStream(outputFileName);
                    // const out = canvas.createPNGStream();
                    // out.pipe(stream);
                });
            });
        });
    });
}
