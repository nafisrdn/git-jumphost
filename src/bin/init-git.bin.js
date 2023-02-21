require("dotenv").config();

const gitService = require("../services/git.service");
const { logger } = require("../utils/logger.util");

(async () => {
  try {
    gitService.initRepositories(true);

    logger.info("Repository cloning successful");
  } catch (error) {
    logger.error(error);
  }
})();
