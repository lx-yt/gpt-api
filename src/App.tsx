import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("App");
logger.info("Starting App...");

import React from "react";

import { Input } from "./components/Input";
import { Output } from "./components/Output";
import { Button } from "./components/Button";
import { ConfigView } from "./components/ConfigView";

import { useHandler } from "./hooks/useHandler";

function App() {
  logger.debug("Rendering App...");

  const handler = useHandler(
    React.useMemo(() => {
      return {
        llm: "gemini",
        model: "gemini-1.5-pro-latest",
      };
    }, [])
  );

  return (
    <div className="m-4 p-4 flex flex-col">
      <ConfigView handler={handler} />
      <Input
        handler={handler}
        className="min-h-52 m-4 p-4 text-black border-2 border-black rounded shadow shadow-slate-300"
      />
      <Button
        handler={handler}
        className="m-4 p-4 rounded bg-sky-300"
      />
      <Output
        handler={handler}
        className="min-h-52 m-4 p-4 text-slate-500 border-2 rounded shadow shadow-slate-300"
      />
    </div>
  );
}

export default App;
