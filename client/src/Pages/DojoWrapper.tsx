import { setup, SetupResult } from "../dojo/setup.ts";
import { DojoProvider } from "../dojo/DojoContext.tsx";
import { dojoConfig } from "../../dojoConfig.ts";
import GamePage from "./GamePage.tsx";

const setupResult = await setup(dojoConfig);

export default function DojoWrapper() {
  return (
    <DojoProvider value={setupResult}>
      <GamePage />
    </DojoProvider>
  );
}