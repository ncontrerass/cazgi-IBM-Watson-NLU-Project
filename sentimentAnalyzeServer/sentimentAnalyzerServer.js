const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
}


const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

// ENDPOINTS START
//ENDPOINT 1: For the webserver ending with /url/emotion
app.get("/url/emotion", (req, res) => {

    const analyzeParams = {
        url: req.query.url,
        features: {
            emotion: {}
        }
    };
    let response = getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
            let resultAnalysis = JSON.stringify(
                analysisResults.result.emotion.document.emotion
                , null, 2);
            return res.send(resultAnalysis);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send(err);
        });

});

//ENDPOINT 2: For the webserver ending with /url/sentiment
app.get("/url/sentiment", (req,res) => {
const analyzeParams = {
 "url": req.query.url,
 "features": {
 
 "keywords": {
 "sentiment": true,
 "limit": 1
 }
 }
 }
 const naturalLanguageUnderstanding = getNLUInstance();
 
 naturalLanguageUnderstanding.analyze(analyzeParams)
 .then(analysisResults => {
 console.log(analysisResults);
 console.log(JSON.stringify(analysisResults.result.keywords[0].sentiment,null,2));
 return res.send(analysisResults.result.keywords[0].sentiment,null,2);
 })
 .catch(err => {
 return res.send("Could not do desired operation "+err);
 });
 
});

//ENDPOINT 3: For the webserver ending with /text/emotion
app.get("/text/emotion", (req, res) => {

    const analyzeParams = {
        text: req.query.text,
        features: {
            emotion: {}
        }
    };
    let response = getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
            let resultAnalysis = JSON.stringify(
                analysisResults.result.emotion.document.emotion
                , null, 2);
            return res.send(resultAnalysis);
        })
        .catch(err => {
            console.log('error:', err);
            return res.send(err);
        });

});

//ENDPOINT 4: For the webserver ending with /text/sentiment
app.get("/text/sentiment", (req, res) => {

    const analyzeParams = 
        {
            "text": req.query.text,
            "features": {
                "keywords": {
                                "sentiment": true,
                                // "limit": 1
                            }
            }
        }

    const naturalLanguageUnderstanding = getNLUInstance();
    let response = getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.keywords[0].sentiment,null,2);

        })
        .catch(err => {
            console.log('error:', err);
            return res.send(err);
        });
});
// ENDPOINTS END

// SERVER
let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
});
