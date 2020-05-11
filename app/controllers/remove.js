import {DATA_FOLDER} from "../configuration/constants.js";
import {removeImage} from "../services/io.js";

/**
 * REST service with which you can remove an uploaded image.
 */
export default (req, res, next) => {
    removeImage(DATA_FOLDER + req.params.name)
        .then(() => {
            console.info("Image " + req.params.name + " removed");
            res.status(200).send()
        })
        .catch(error => {
            console.error("Could not delete image with name " + req.params.name, error);
            res.status(404).send();
        });
}
