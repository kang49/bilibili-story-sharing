const fs = require('fs').promises; // Use the promise-based version of 'fs'
const path = require('path');


export async function workCouter() {
    const filePath = 'assets/json/worktimes.json'; // Read json file

    try {
        // Read the file
        const data = await fs.readFile(filePath, 'utf8');
        
        // Parse the JSON
        const jsonObject = JSON.parse(data);
        
        // Increment the 'worktimes' value
        if (typeof jsonObject.process.worktimes === 'number') {
            jsonObject.process.worktimes += 1;
        } else return;
        
        // Convert the jsonObjectect back to JSON
        const updatedJson = JSON.stringify(jsonObject, null, 2); // null and 2 are for formatting
        
        // Write the JSON back to the file
        await fs.writeFile(filePath, updatedJson, 'utf8');
    } catch {
        return;
    }
}
