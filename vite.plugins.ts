import { readFileSync } from "fs";

/**
 * Read the II canister ID from dfx's local state
 */
const readCanisterId = (): string => {
  const canisterIdsJsonFile = "./.dfx/local/canister_ids.json";

  try {
    const { internet_identity: canisterId } = JSON.parse(
      readFileSync(canisterIdsJsonFile, "utf-8")
    );

    const assertNonNullish: (
      value: string
    ) => asserts value is NonNullable<string> = (value: string): void => {
      if (value === null || value === undefined) {
        throw new Error("Internet identity canister ID undefined");
      }
    };

    assertNonNullish(canisterId);

    console.log("Read canister ID:", canisterId);

    return canisterId;
  } catch (e) {
    throw Error(`Could not get canister ID from ${canisterIdsJsonFile}: ${e}`);
  }
};

/**
 * Inject the II canister ID as a <script /> tag in index.html for local development.
 */
export const injectCanisterIdPlugin = (): {
  name: "html-transform";
  transformIndexHtml(html: string): string;
} => ({
  name: "html-transform",
  transformIndexHtml(html): string {
    return html.replace(
      `<script id="setupJs"></script>`,
      `<script data-canister-id="${readCanisterId()}" id="setupJs"></script>`
    );
  },
});
