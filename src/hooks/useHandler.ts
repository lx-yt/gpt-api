import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("useHandler");

import React from "react";

import { createHandler } from "../util/ai";
import type { Config, Handler } from "../util/ai";

export interface HandlerWithSetPrompt extends Handler {
  setPrompt: (value: string) => void;
}

interface Store<Type> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => Type;
}

function createStoredHandler(config: Config): Store<HandlerWithSetPrompt> {
  logger.debug("Creating StoredHandler...");

  const handler = createHandler(config);

  let _prompt = handler.prompt;
  let _output = handler.output;
  let _config = handler.config;

  Object.defineProperties(handler, {
    prompt: {
      get: () => _prompt,
      set: (value: string) => {
        logger.debug(`setPrompt: ${value} -> ${_prompt} -> ${handler.prompt}`);
        _prompt = value;
        emit();
      },
    },
    output: {
      get: () => _output,
      set: (value: string) => {
        _output = value;
        emit();
      },
    },
    config: {
      get: () => _config,
      set: (value: Config) => {
        _config = value;
        emit();
      },
    },
  });

  // Redefining for typescript because it doesn't understand Object.defineProperties
  let snapshot = {
    ...handler,
    setPrompt: (value: string) => {
      handler.prompt = value;
    },
  };

  const listeners: (() => void)[] = [];

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  };

  const getSnapshot = () => {
    return snapshot;
  };

  const emit = () => {
    logger.debug("Emitting...");
    snapshot = {
      ...handler,
      setPrompt: (value: string) => {
        handler.prompt = value;
      },
    };
    listeners.forEach((l) => {
      l();
    });
  };

  return { subscribe, getSnapshot };
}

export function useHandler(initialConfig: Config): HandlerWithSetPrompt {
  logger.debug("Rendering useHandler");

  const storedHandler_memo = React.useMemo(() => {
    return createStoredHandler(initialConfig);
  }, [initialConfig]);

  const synchedHandler = React.useSyncExternalStore(
    storedHandler_memo.subscribe,
    storedHandler_memo.getSnapshot
  );

  return synchedHandler;
}
