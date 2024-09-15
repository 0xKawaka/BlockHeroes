import { setup, SetupResult } from "../dojo/setup.ts";
import { DojoProvider } from "../dojo/DojoContext.tsx"; // Ensure useDojo is imported
import { dojoConfig } from "../../dojoConfig.ts";
import GamePage from "./GamePage.tsx";
import { useEffect, useState } from "react";
import "./DojoWrapper.css";
import { useDojo } from "../dojo/useDojo.tsx";

export default function DojoWrapper() {
  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);

  // Fetch the setup result once on mount
  useEffect(() => {
    setup(dojoConfig).then(setSetupResult);
  }, []);

  if (!setupResult) {
    console.log("Loading...");
    return <div className="dojoWrapperLoading">Loading game...</div>;
  }

  // Inner component to use `useDojo` after the provider has been set
  function WrappedGamePage() {
    const { setup: { toriiClient }, account } = useDojo();
    console.log("WrappedGamePage")
    return <GamePage toriiClient={toriiClient} account={account} />;
  }

  return (
    <DojoProvider value={setupResult}>
      {/* Pass toriiClient and account to GamePage */}
      <WrappedGamePage />
    </DojoProvider>
  );
}
