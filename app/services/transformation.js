import Image from "../model/Image.js";

export async function applyTransformationDefinition(initialImage, transformationDefinition) {
    let transformationFunctions = transformationDefinition.transformations.map(transformationDefinition => {
        return async (imageBytes) => {
            let service = await import("../transformations/" + transformationDefinition.name + ".js");
            return await service.default(imageBytes, transformationDefinition);
        };
    });

    const transformedImageBytes = await transformationFunctions.reduce((currentImagePromise, currentTransformation) => {
            return currentImagePromise.then(currentImage => currentTransformation(currentImage));
        }, Promise.resolve(initialImage.bytes))

    return new Image(transformationDefinition.label, transformedImageBytes);
}