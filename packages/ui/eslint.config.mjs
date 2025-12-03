import { globalIgnores } from "eslint/config";
import sharedConfig from "@smart-assistant/config/eslint.config.mjs";

export default [...sharedConfig, globalIgnores(["dist/**", ".next/**"])];
