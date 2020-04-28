import Jimp from "jimp";

export default async function (file, transformationDefinition) {
    const expectedWidth = parseInt(transformationDefinition.width);
    const expectedHeight = transformationDefinition.height ? parseInt(transformationDefinition.height) : undefined;
    const crop = !!transformationDefinition.crop;

    let image = await Jimp.read(file);

    if (expectedHeight && crop) {
        image = await image.cover(expectedWidth, expectedHeight);
    } else {
        image = await image.resize(expectedWidth, expectedHeight ? expectedHeight : Jimp.AUTO);
    }

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