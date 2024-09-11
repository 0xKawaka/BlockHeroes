import './App.css'
import Home from './Pages/Home'
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom'
import GamePage from './Pages/GamePage'

import { setup, SetupResult } from "./dojo/setup.ts";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { dojoConfig } from "../dojoConfig.ts";

const setupResult = await setup(dojoConfig);

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={
            <DojoProvider value={setupResult}>
              <GamePage />
            </DojoProvider>
          } />
        </Routes>
    </Router>
  )
}

export default App

// import "./App.css";
// import { useComponentValue, useQuerySync } from "@dojoengine/react";
// import { Entity } from "@dojoengine/recs";
// import { useEffect, useState } from "react";
// import { Direction } from "./utils";
// import { getEntityIdFromKeys } from "@dojoengine/utils";
// import { useDojo } from "./dojo/useDojo";

// function App() {
//     const {
//         setup: {
//             systemCalls: { spawn, move },
//             clientComponents: { Position, Moves, DirectionsAvailable },
//             toriiClient,
//             contractComponents,
//         },
//         account,
//     } = useDojo();

//     useQuerySync(toriiClient, contractComponents as any, []);

//     const [clipboardStatus, setClipboardStatus] = useState({
//         message: "",
//         isError: false,
//     });

//     // entity id we are syncing
//     const entityId = getEntityIdFromKeys([
//         BigInt(account?.account.address),
//     ]) as Entity;

//     // get current component values
//     const position = useComponentValue(Position, entityId);
//     const moves = useComponentValue(Moves, entityId);
//     const directions = useComponentValue(DirectionsAvailable, entityId);

//     const handleRestoreBurners = async () => {
//         try {
//             await account?.applyFromClipboard();
//             setClipboardStatus({
//                 message: "Burners restored successfully!",
//                 isError: false,
//             });
//         } catch (error) {
//             setClipboardStatus({
//                 message: `Failed to restore burners from clipboard`,
//                 isError: true,
//             });
//         }
//     };

//     useEffect(() => {
//         if (clipboardStatus.message) {
//             const timer = setTimeout(() => {
//                 setClipboardStatus({ message: "", isError: false });
//             }, 3000);

//             return () => clearTimeout(timer);
//         }
//     }, [clipboardStatus.message]);

//     return (
//         <>
//             <button onClick={() => account?.create()}>
//                 {account?.isDeploying ? "deploying burner" : "create burner"}
//             </button>
//             {account && account?.list().length > 0 && (
//                 <button onClick={async () => await account?.copyToClipboard()}>
//                     Save Burners to Clipboard
//                 </button>
//             )}
//             <button onClick={handleRestoreBurners}>
//                 Restore Burners from Clipboard
//             </button>
//             {clipboardStatus.message && (
//                 <div className={clipboardStatus.isError ? "error" : "success"}>
//                     {clipboardStatus.message}
//                 </div>
//             )}

//             <div className="card">
//                 <div>{`burners deployed: ${account.count}`}</div>
//                 <div>
//                     select signer:{" "}
//                     <select
//                         value={account ? account.account.address : ""}
//                         onChange={(e) => account.select(e.target.value)}
//                     >
//                         {account?.list().map((account, index) => {
//                             return (
//                                 <option value={account.address} key={index}>
//                                     {account.address}
//                                 </option>
//                             );
//                         })}
//                     </select>
//                 </div>
//                 <div>
//                     <button onClick={() => account.clear()}>
//                         Clear burners
//                     </button>
//                     <p>
//                         You will need to Authorise the contracts before you can
//                         use a burner. See readme.
//                     </p>
//                 </div>
//             </div>

//             <div className="card">
//                 <button onClick={() => spawn(account.account)}>Spawn</button>
//                 <div>
//                     Moves Left: {moves ? `${moves.remaining}` : "Need to Spawn"}
//                 </div>
//                 <div>
//                     Position:{" "}
//                     {position
//                         ? `${position?.vec.x}, ${position?.vec.y}`
//                         : "Need to Spawn"}
//                 </div>

//                 <div>{moves && moves.last_direction}</div>

//                 <div>
//                     <div>Available Positions</div>
//                     {directions?.directions.map((a: any, index: any) => (
//                         <div key={index} className="">
//                             {a}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="card">
//                 <div>
//                     <button
//                         onClick={() =>
//                             position && position.vec.y > 0
//                                 ? move(account.account, Direction.Up)
//                                 : console.log("Reach the borders of the world.")
//                         }
//                     >
//                         Move Up
//                     </button>
//                 </div>
//                 <div>
//                     <button
//                         onClick={() =>
//                             position && position.vec.x > 0
//                                 ? move(account.account, Direction.Left)
//                                 : console.log("Reach the borders of the world.")
//                         }
//                     >
//                         Move Left
//                     </button>
//                     <button
//                         onClick={() => move(account.account, Direction.Right)}
//                     >
//                         Move Right
//                     </button>
//                 </div>
//                 <div>
//                     <button
//                         onClick={() => move(account.account, Direction.Down)}
//                     >
//                         Move Down
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default App;