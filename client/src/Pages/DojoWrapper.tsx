import { setup, SetupResult } from "../dojo/setup.ts";
import { DojoProvider } from "../dojo/DojoContext.tsx";
import { dojoConfig } from "../../dojoConfig.ts";
import GamePage from "./GamePage.tsx";
import { useEffect, useState } from "react";
import "./DojoWrapper.css"

export default function DojoWrapper() {
  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);

  useEffect(() => {
    setup(dojoConfig).then(setSetupResult);
  }),[];

  if(!setupResult) {
    console.log("Loading...")
    return <div className="dojoWrapperLoading">Loading game...</div>
  }
  return (
    <DojoProvider value={setupResult}>
      <GamePage />
    </DojoProvider>
  );
}