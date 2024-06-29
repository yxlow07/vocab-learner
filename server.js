const express = require('express');
const fs = require('fs');
const axios = require('axios');
const path = require('path'); // Node.js module for working with file and directory paths

const app = express();
const port = 3000;
const vocabFile = 'data/cleaned_vocab.json';
let vocabularies = [];

function formatDefinitions(data) {
    const meanings = data[0]?.meanings;
    if (!meanings || meanings.length === 0) {
        return 'No definition found';
    }

    const formattedDefinitions = meanings.map(meaning => {
        const partOfSpeech = meaning.partOfSpeech || 'Unknown';
        const definitions = meaning.definitions.map(def => def.definition).join('; ');
        return `${partOfSpeech}: ${definitions}`;
    });

    return formattedDefinitions.join('; ');
}

function saveVocabularies() {
    fs.writeFile(vocabFile, JSON.stringify(vocabularies, null, 2), err => {
        if (err) {
            console.error('Error saving vocabularies:', err);
        }
    });
}

// Load vocabularies from JSON file
fs.readFile(vocabFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading vocabularies file:', err);
        return;
    }
    vocabularies = JSON.parse(data);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to search vocabularies
app.get('/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send('Query parameter is required');
    }

    if (query == "*") {
        res.json(vocabularies);
        return;
    }

    const results = vocabularies.filter(vocab =>
        vocab.word.toLowerCase().includes(query.toLowerCase())
    );

    res.json(results);
});

app.get('/save/:word', async (req, res) => {
    let word = req.params.word;
    let apiEndpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await axios.get(apiEndpoint);
        const data = response.data;
        const formattedDefinitions = formatDefinitions(data);

        vocabularies.push({"word": word, "definition": formattedDefinitions});

        res.json({ message: `Word '${word}' saved successfully!`, word: word });
        saveVocabularies();
    } catch (error) {
        console.error('Error fetching definition:', error);
        return res.status(404).send('Word not found and definition could not be fetched.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app