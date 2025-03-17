// new
import { createDojoConfig } from "@dojoengine/core";

import manifest from "../../../onchain/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
