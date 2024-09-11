import { createDojoConfig } from "@dojoengine/core";
import manifest from "./src/dojo/manifest.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
