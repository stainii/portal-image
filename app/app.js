import {DATA_FOLDER, PORT} from "./configuration/constants.js";
import express from "express";
import multer from "multer";
import Eureka from "./services/eureka.js";
import transform from "./controllers/transform.js";

// middleware
const upload = multer({dest: '/tmp/uploads/'});
const app = express();
const router = express.Router();

// routes
app.get('/', (req, res) => res.send('Portal image is up and running.'));
app.get('/status', (req, res) => res.send('OK'));
app.use("/api", router);

router.post("/transform", upload.single("image"), transform);
router.use("/retrieve", express.static(DATA_FOLDER));

// register with Eureka
Eureka.start();

// start server
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));