import GamePage from "./GamePage.tsx";
import { useEffect, useState } from "react";
import { dojoConfig } from "../dojo/dojoConfig.ts";
import { setupWorld } from '../dojo/generated/contracts.gen.ts';
import { SchemaType } from '../dojo/generated/models.gen.ts';
import { init, SDK } from '@dojoengine/sdk';
import { DojoSdkProvider } from '@dojoengine/sdk/react';
import StarknetProvider from "../dojo/starknet-provider.tsx";
import "./DojoWrapper.css";

export default function DojoWrapper() {
  const [sdk, setSdk] = useState<SDK<SchemaType> | null>(null);

  useEffect(() => {
    init<SchemaType>({
      client: {
        toriiUrl: dojoConfig.toriiUrl,
        relayUrl: dojoConfig.relayUrl,
        worldAddress: dojoConfig.manifest.world.address,
      },
      domain: {
        name: "BLOCKHEROES",
        version: "1.0",
        chainId: "KATANA",
        revision: "1",
      },
    }).then(setSdk);
  }, []);

  if (!sdk) {
    console.log("Loading...");
    return (
      <div className="dojoWrapperLoading">
        <div className="loading-text">Loading game</div>
        <div className="loading-bar">
          <div className="loading-bar-inner"></div>
        </div>
      </div>
    );
  }

  return (
    <StarknetProvider>
      <DojoSdkProvider sdk={sdk} dojoConfig={dojoConfig} clientFn={setupWorld}>
        <GamePage />
      </DojoSdkProvider>
    </StarknetProvider>
  );
}
