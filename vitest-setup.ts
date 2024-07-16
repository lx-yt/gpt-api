import { RootLogger } from "@lx-yt/logging";
const logger = RootLogger.getLogger("vitest-setup");

logger; //.getLogger("*:useHandler").minLevel = "debug";

import "@testing-library/jest-dom/vitest";

import { themes } from "@lx-yt/logging";

for (const key in themes) {
  delete themes[key]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
}
