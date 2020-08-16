import Jimp from "jimp";

export default async function (file, transformationDefinition) {
    console.info("Vintage!");

    let image = await Jimp.read(file);
    image = await image.sepia();
    return new Promise((resolve, reject) => {
        image.getBuffer(Jimp.MIME_PNG, (error, stream) => {
            if (error) {
                reject(error);
            } else {
                resolve(stream);
            }
        });
    });
};