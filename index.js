const express = require('express');
const natural = require('natural');

const app = express();
app.use(express.json({ limit: '1000kb' }));

//Classifier example from http://naturalnode.github.io/natural/bayesian_classifier.html
const classifier = new natural.BayesClassifier();
classifier.addDocument('my unit-tests failed.', 'software')
classifier.addDocument('tried the program, but it was buggy.', 'software')
classifier.addDocument('the drive has a 2TB capacity.', 'hardware')
classifier.addDocument('i need a new power supply.', 'hardware')
classifier.train()

app.get('/classify', (req, res) => {
    const { text } = req.query;
    return res.send({ category: classifier.classify(text) });
});

app.get('/persist/classifier', (req, res) => {
    classifier.save('classifier.json', function(err, classifier) {

        if (err) {
            return res.status(400).send("Save failed! Error: "+err);
        }
        // the classifier is saved to the classifier.json file!
        return res.send("Successfully saved classifier for re-usability!");
    });
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("server running on: ",PORT);
})