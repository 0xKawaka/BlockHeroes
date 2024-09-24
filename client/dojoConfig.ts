import { createDojoConfig } from "@dojoengine/core";
import manifest from "./src/dojo/manifest.json";

 let dojoConfig = createDojoConfig({
    manifest,
});

dojoConfig.rpcUrl = "https://api.cartridge.gg/x/blockheroesdev/katana";
dojoConfig.toriiUrl = "https://api.cartridge.gg/x/blockheroesdev/torii";
dojoConfig.masterAddress = "0x6267c19517dc17f8dd7c00d873f2790421667fb5e062af4660ac9580087689d";
dojoConfig.masterPrivateKey  = "0x156d2da31751e3c9fb07ea8778af86b4931381e5f009f584265e85bc14c55e9";

export {dojoConfig};

