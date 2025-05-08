import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import logger from '../config/logger.mjs';
import routes from "./routes/index.mjs";
import session_middle from '../config/session.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session_middle);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors());

//ルーティング処理
app.use("/", routes);

app.listen(3000, () => {
  logger.info("server started");
});