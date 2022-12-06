import { Connection } from "../../utils/iiConnection";
import { unknownToString } from "../../utils/utils";
import { promptCaptcha } from "./captcha";
import {
  apiResultToLoginFlowResult,
  LoginFlowResult,
  cancel,
} from "../../utils/flowResult";
import { constructIdentity } from "./construct";
import { promptDeviceAlias } from "./alias";

/** Registration (anchor creation) flow for new users */
export const register = async ({
  connection,
}: {
  connection: Connection;
}): Promise<LoginFlowResult> => {
  try {
    const alias = await promptDeviceAlias();
    if (alias === null) {
      return cancel;
    }

    const [captcha, identity] = await Promise.all([
      connection.createChallenge(),
      constructIdentity(),
    ]);

    const result = await promptCaptcha({
      connection,
      challenge: Promise.resolve(captcha),
      identity,
      alias,
    });

    if ("tag" in result) {
      return result;
    } else {
      const foo = apiResultToLoginFlowResult(result);
      // TODO: displayUserNumber + setAnchorUsed here
      return foo;
    }
  } catch (e) {
    return {
      tag: "err",
      title: "Failed to create anchor",
      message: "An error occurred during anchor creation.",
      detail: unknownToString(e, "unknown error"),
    };
  }
};
