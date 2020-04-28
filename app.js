import {PORT} from "./configuration/constants.js";
import express from "express";
import multer from "multer";
import Eureka from "./configuration/Eureka.js";
import Jimp from "jimp";

let upload = multer({dest: '/tmp/uploads/'});
let app = express();

// routes
app.get('/', (req, res) => res.send('Hello World!'));

app.post('/api/', upload.single('image'), async (req, res) => {

    // get transformation definitions
    let transformationDefinitions = [];
    if (req.body.transformations) {
        transformationDefinitions = JSON.parse(req.body.transformations);
    }

    let image = await from(req.file)
        .then(image => applyAllTransformations(image, ...transformationDefinitions))
        .catch(error => res.send(error));

    if (image) {
        res.setHeader('content-type', 'image/png');
        res.send(image);
    }
});


/*
app.post('/composite/',
    /*upload.fields([{name: 'backgroundImage', maxCount: 1}, {name: 'foregroundImage', maxCount: 1}]),
    (req, res) => {
    gm(req.files["backgroundImage"][0].path)
        .composite(req.files["foregroundImage"][0].path)
        .geometry('+' + req.body.x + '+' + req.body.y)
        .stream(function(err,stdout){
            if (err) return next(err);
            stdout.pipe(res);
        });

});
*/
app.get('/status', (req, res) => res.send('OK'));


// register with Eureka
Eureka.start();

// start server
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));


// todo get rid of globals
function from(image) {
    return new Promise((resolve, reject) => {
        return Jimp.read(image.path)
            .then(image => image.getBuffer(Jimp.MIME_PNG, (error, stream) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stream);
                }
            }));
    })
}

async function applyAllTransformations(initialImage, ...transformationDefinitions) {
    let transformations = transformationDefinitions.map(transformationDefinition => {
        return async (image) => {
            let service = await import("./services/" + transformationDefinition.name + ".js");
            return await service.default(image, transformationDefinition);
        };
    });

    return await transformations.reduce((currentImagePromise, currentTransformation) => {
        return currentImagePromise.then(currentImage => currentTransformation(currentImage));
    }, Promise.resolve(initialImage));
}