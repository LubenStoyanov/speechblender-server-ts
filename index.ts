import type { Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { loggerMiddleware } from "./middleware/logger.js";
import podcastRouter from "./routes/podcast.js";
import recordingRouter from "./routes/recording.js";
import { authMiddleware } from "./middleware/auth.js";

import multer, { memoryStorage } from "multer";
const storage = memoryStorage();
const upload = multer({ storage });

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

app.use("/api/v1", authRouter);
app.use("/api/v1/podcast", authMiddleware, podcastRouter);
app.use("/api/v1/recording", authMiddleware, recordingRouter);

app.get("/", (_, res: Response) => res.json({ message: "Hello there" }));

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
