import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("useHandler");

import React from "react";

import { createHandler } from "../util/ai";

import type { Config, Handler } from "../util/ai";

export interface ReactiveHandler extends Handler {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

/**
 * @deprecated
 */
interface Store<Type> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => Type;
}

/**
 * @deprecated
 */
function createHandlerStore(config: Config): Store<ReactiveHandler> {
  logger.debug("Creating StoredHandler...");

  const handler = createHandler(config, () => {
    emit();
  });

  let _prompt = handler.prompt;
  let _config = handler.config;

  Object.defineProperties(handler, {
    prompt: {
      get() {
        return _prompt;
      },
      set(value: string) {
        logger.debug(`prompt = ${handler.prompt} -> ${_prompt}`);
        _prompt = value;
        emit();
      },
    },
    config: {
      get() {
        return _config;
      },
      set(value: Config) {
        _config = value;
        emit();
      },
    },
  });

  // Redefining for typescript because it doesn't understand Object.defineProperties
  let snapshot: ReactiveHandler;
  const updateSnapshot = () => {
    snapshot = {
      ...handler,
      setPrompt: (value) => {
        logger.debug("setPrompt: ", value);
        if (typeof value === "function") {
          value = value(handler.prompt);
        }
        handler.prompt = value;
      },
      setConfig: (value) => {
        logger.debug("setConfig: ", value);
        if (typeof value === "function") {
          value = value(handler.config);
        }
        handler.config = value;
      },
    };
  };
  updateSnapshot();

  const listeners: (() => void)[] = [];

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  };

  const getSnapshot = () => {
    logger.debug("getSnapshot: ", snapshot);
    return snapshot;
  };

  const emit = () => {
    logger.debug("Emitting...");
    const old = snapshot;
    updateSnapshot();
    const n = snapshot;
    logger.debug(
      "Change Snapshot: ",
      old,
      "->",
      n,
      Object.is(old, n),
      old === n
    );
    listeners.forEach((l) => {
      l();
    });
  };

  return { subscribe, getSnapshot };
}

/**
 * @deprecated
 */ // @ts-expect-error This is deprecated so it's not used.
function useHandlerStore(initialConfig: Config): ReactiveHandler {
  logger.debug("Rendering useHandler");

  const storedHandler_memo = React.useMemo(() => {
    return createHandlerStore(initialConfig);
  }, [initialConfig]);

  const synchedHandler = React.useSyncExternalStore(
    storedHandler_memo.subscribe,
    storedHandler_memo.getSnapshot
  );

  logger.debug("synchedHandler: ", {
    ...synchedHandler,
    prompt: synchedHandler.prompt,
    config: synchedHandler.config,
  });

  return synchedHandler;
}

export function useHandler(
  initialConfig?: Config,
  onOutputChange?: (output: string) => void
): ReactiveHandler {
  logger.debug("Rendering useHandler");

  const [output, setOutput] = React.useState("");

  const handler = React.useMemo(() => {
    return createHandler(initialConfig, (output) => {
      setOutput(output);
      onOutputChange?.(output);
    });
  }, [initialConfig, onOutputChange]);

  const [prompt, setPrompt] = React.useState(handler.prompt);
  const [config, setConfig] = React.useState(handler.config);

  handler.prompt = prompt;
  handler.config = config;

  const setPromptWrapper: React.Dispatch<React.SetStateAction<string>> =
    React.useCallback((value) => {
      logger.debug("setPrompt:", value);
      setPrompt(value);
    }, []);

  const setConfigWrapper: React.Dispatch<React.SetStateAction<Config>> =
    React.useCallback((value) => {
      logger.debug("setConfig:", value);
      setConfig(value);
    }, []);

  return {
    prompt,
    setPrompt: setPromptWrapper,
    config,
    setConfig: setConfigWrapper,
    run: handler.run,
    output: output,
  };
}
