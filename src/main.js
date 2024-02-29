import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

web.listen(process.env.PORT, () => {
    logger.info(`App start at ${process.env.PORT}` )
})