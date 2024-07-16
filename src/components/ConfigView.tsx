import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("ConfigView");

import React from "react";

import { ReactiveHandler } from "../hooks/useHandler";
import { LLMS, getModels } from "../util/ai";

export function ConfigView({
  handler,
  className,
  style,
}: {
  handler: ReactiveHandler;
  className?: string;
  style?: React.CSSProperties;
}) {
  logger.debug("Rendering ConfigView...", handler);

  const MODELS = getModels(handler.config.llm);

  const changeLLM = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      logger.debug(`setLLM: ${event.target.value}`);
      const newLLM = event.target.value;
      if ((LLMS as readonly string[]).includes(newLLM)) {
        handler.setConfig({
          ...handler.config,
          llm: newLLM as (typeof LLMS)[number],
        });
      }
    },
    [handler]
  );

  const changeModel = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      logger.debug(`setModel: ${event.target.value}`);
      const newModel = event.target.value;
      if ((MODELS as readonly string[]).includes(newModel)) {
        handler.setConfig({
          ...handler.config,
          model: newModel as (typeof MODELS)[number],
        });
      }
    },
    [handler, MODELS]
  );

  return (
    <div
      className={className}
      style={style}
    >
      <label className="m-2 p-2 pr-0 text-xl font-bold text-center border-2 border-black rounded shadow shadow-slate-300 bg-sky-300">
        LLM
        <select
          value={handler.config.llm}
          onChange={changeLLM}
          className="m-1 p-1 border border-black rounded"
        >
          <option value="gemini">Gemini</option>

          <option
            value="gpt"
            disabled
          >
            GPT
          </option>

          <option
            value="claude"
            disabled
          >
            Claude
          </option>
        </select>
      </label>

      <label className="m-2 p-2 pr-0 text-xl font-bold text-center border-2 border-black rounded shadow shadow-slate-300 bg-sky-200">
        Model
        <select
          value={handler.config.model}
          onChange={changeModel}
          className="m-1 p-1 border border-black rounded"
        >
          {MODELS.map((model) => (
            <option
              key={model}
              value={model}
            >
              {model}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
