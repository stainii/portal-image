import fs from "fs";
import Jimp from "jimp";
import {DATA_FOLDER} from "../configuration/constants.js";
import Image from "../model/Image.js";

export function saveImages(...images) {
    images.forEach(image => {
        const path = DATA_FOLDER + image.name;
        console.info("Creating or updating " + path);

        const stream = fs.createWriteStream(path);
        stream.write(image.bytes);
        stream.end();
    });
}
/**
 * Reads and returns bytes of an image.
 * @param imagePath path to the image
 * @returns {Promise<Image>}
 */
export function readImage(label, imagePath) {
    return new Promise((resolve, reject) => {
        return Jimp.read(imagePath)
            .then(image => image.getBuffer(Jimp.MIME_PNG, (error, stream) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(new Image(label, stream));
                }
            }));
    });
}