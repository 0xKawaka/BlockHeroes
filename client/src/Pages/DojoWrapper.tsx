import { setup, SetupResult } from "../dojo/setup.ts";
import { DojoProvider } from "../dojo/DojoContext.tsx"; // Ensure useDojo is imported
import { dojoConfig } from "../../dojoConfig.ts";
import GamePage from "./GamePage.tsx";
import { useEffect, useState } from "react";
import "./DojoWrapper.css";
import { useDojo } from "../dojo/useDojo.tsx";

export default function DojoWrapper() {
  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);

  useEffect(() => {
    setup(dojoConfig).then(setSetupResult);
  }, []);

  if (!setupResult) {
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

  function WrappedGamePage() {
    const { setup: { toriiClient }, account } = useDojo();
    console.log("WrappedGamePage")
    return <GamePage toriiClient={toriiClient} account={account} />;
  }

  return (
    <DojoProvider value={setupResult}>
      <WrappedGamePage />
    </DojoProvider>
  );
}

