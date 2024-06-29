const fs = require('fs');
const file = "data/cleaned_vocab.json";

// Function to sort and capitalize the first letter of each word in the JSON file
function sortAndCapitalizeFirstLetter() {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            // Parse JSON data
            const vocabularies = JSON.parse(data);

            // Sort vocabularies by word (case insensitive)
            vocabularies.sort((a, b) => a.word.localeCompare(b.word, 'en', { sensitivity: 'base' }));

            // Capitalize first letter of each word
            vocabularies.forEach(entry => {
                entry.word = entry.word.charAt(0).toUpperCase() + entry.word.slice(1).toLowerCase();
            });

            // Write updated data back to file
            fs.writeFile(file, JSON.stringify(vocabularies, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('JSON file sorted and first letters capitalized successfully.');
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
}

// Example usage: Call this function wherever needed in your application
sortAndCapitalizeFirstLetter();