import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("App");
logger.info("Starting App...");

import React from "react";

import { Input } from "./components/Input";
import { Output } from "./components/Output";
import { Button } from "./components/Button";

import { useHandler } from "./hooks/useHandler";

function App() {
  logger.debug("Rendering App...");

  const handler = useHandler(
    React.useMemo(() => {
      return {
        model: "gemini-1.5-pro-latest",
      };
    }, [])
  );

  return (
    <div className="m-4 p-4">
      <Input handler={handler} />
      <Button handler={handler} />
      <Output handler={handler} />
    </div>
  );
}

export default App;
