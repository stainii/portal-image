import crypto from "crypto";

export default class Image {
    label; // temporary label, used in the context of the current request
    name; // the file name of the image when it is saved
    bytes; // the contents of the image

    constructor(label, bytes) {
        this.label = label;
        this.bytes = bytes;
        this.name = Image._calculateName(bytes);
    }

    getMetaData() {
        return {
            label: this.label,
            name: this.name
        };
    }

    static _calculateName(bytes) {
        const imageHash = crypto.createHash('sha256');
        imageHash.update(bytes);
        return imageHash.digest("hex") + ".png";
    }
}