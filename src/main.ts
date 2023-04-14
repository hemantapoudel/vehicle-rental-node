import express from "express";
import cors from "cors";

import config from "./config/env";
import { join } from "path";
import { router } from "./routes";
import { notFound, customErrorHandler } from "./middlewares/error.middleware";
import { isLoggedIn } from "./middlewares/auth.middleware";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", isLoggedIn, express.static(join(__dirname, "uploads")));
app.use("/api/v1", router);
app.use(customErrorHandler);
app.use(notFound);

const port = config.PORT;
app.listen(port, () => console.log(`listening in port:${port}`));
