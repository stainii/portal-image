import {applyTransformationDefinition} from "../services/transformation.js";
import {readImage, saveImages} from "../services/io.js";
import {DATA_FOLDER, IMAGE_LABEL_ORIGINAL} from "../configuration/constants.js";

/**
 * REST service with which you can
 *   1) store an image
 *   2) generate and store one or multiple transformations of an image
 *   3) perform and store additional transformation on an earlier stored image
 *
 * Form data:
 *
 * |field name | type   | required | meaning |
 * |-----------|--------| -------- |-----|
 * | image     | file   | only if imageName is not provided      | image you want to (transform and) store |
 * | imageName | file   | only if image is not provided      | image you want to (transform and) retrieve |
 * | transformationDefinitions   | json | no      | JSON object containing the description of the transformations you would like to apply to the image. See [transformations](#transformations).   |
 *
 *
 * Returns: an array of image metadata
 */
export default async (req, res, next) => {
    try {
        const originalImage = await readOriginalImage(req);
        const transformedImages = await applyTransformations(originalImage, JSON.parse(req.body.transformationDefinitions));
        const images = [originalImage, ...transformedImages];

        saveImages(...images);

        res.send(images.map(image => image.getMetaData()));
    } catch (error) {
        next(error);
    }
}

async function readOriginalImage(req) {
    if (req.file) {
        return await readImage(IMAGE_LABEL_ORIGINAL, req.file.path);
    } else if (req.body.imageName) {
        return await readImage(DATA_FOLDER + req.body.imageName);
    } else {
        throw new Error("Neither image nor imageName provided");
    }
}

async function applyTransformations(originalImage, transformationDefinitions) {
    if (!transformationDefinitions) {
        return [];
    }
    const transformationPromises = transformationDefinitions.map(async transformationDefinition =>
        await applyTransformationDefinition(originalImage, transformationDefinition)
    );
    return Promise.all(transformationPromises);
}

