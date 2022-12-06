import { Challenge } from "../../../generated/internet_identity_types";
import { spinner } from "../../components/icons";
import { asyncReplace } from "lit-html/directives/async-replace.js";
import { html, render, TemplateResult } from "lit-html";
import { withRef, autofocus } from "../../utils/lit-html";
import { Chan } from "../../utils/utils";
import { createRef, ref, Ref } from "lit-html/directives/ref.js";
import { LoginFlowCanceled, cancel } from "../../utils/flowResult";
import {
  IdentifiableIdentity,
  Connection,
  RegisterResult,
} from "../../utils/iiConnection";

export const badChallenge: unique symbol = Symbol("ii.bad_challenge");

export const promptCaptchaTemplate = <T>(props: {
  cancel: () => void;
  requestChallenge: () => Promise<Challenge>;
  verifyChallengeChars: (cr: {
    chars: string;
    challenge: Challenge;
  }) => Promise<T | typeof badChallenge>;
  onContinue: (result: T) => void;
}) => {
  const text = new Chan<TemplateResult>();
  const img = new Chan<TemplateResult>();

  const input: Ref<HTMLInputElement> = createRef();

  // The "next" button behavior
  const next = new Chan<(() => void) | undefined>();
  const [nextDisabled, nextf] = next.split((f) => [f === undefined, f]);

  // The "retry" button behavior
  const retry = new Chan<(() => void) | undefined>();
  const [retryDisabled, retryf] = retry.split((f) => [f === undefined, f]);

  const doRetry = async () => {
    update({ status: "requesting" });
    const challenge = await props.requestChallenge();
    update({ status: "prompting", challenge });
  };

  const doVerify = async (challenge: Challenge) => {
    update({ status: "verifying" });
    withRef(input, async (input) => {
      const res = await props.verifyChallengeChars({
        chars: input.value,
        challenge,
      });
      res === badChallenge ? update({ status: "bad" }) : props.onContinue(res);
    });
  };

  type State =
    | { status: "requesting" }
    | { status: "prompting"; challenge: Challenge }
    | { status: "verifying" }
    | { status: "bad" };

  const update = (state: State) => {
    switch (state.status) {
      case "requesting":
        text.send(html`<p>Requesting</p>`);
        img.send(html`<div class="c-spinner">${spinner}</div> `);
        next.send(undefined);
        retry.send(undefined);
        break;
      case "prompting":
        text.send(html`<p>What do you see</p>`);
        img.send(
          html`<img
            src="data:image/png;base64,${state.challenge.png_base64}"
            id="captchaImg"
            class="c-img-block l-stack"
            alt="captcha image"
          /> `
        );
        next.send(() => doVerify(state.challenge));
        retry.send(doRetry);
        break;
      case "verifying":
        text.send(html`<p>Verifying...</p>`);
        next.send(undefined);
        retry.send(undefined);
        break;
      case "bad":
        text.send(html`<p>BAD!</p>`);
        next.send(undefined);
        retry.send(doRetry);
        break;
    }
  };

  doRetry(); // kickstart everything

  return html`
    <article class="l-container c-card c-card--highlight">
      <h1 class="t-title t-title--main">Prove you're not a robot</h1>
      <form
        class="l-stack t-centered"
        @submit=${asyncReplace(
          nextf.map((f) => (e: SubmitEvent) => {
            e.preventDefault();
            e.stopPropagation();
            f?.();
          })
        )}
      >
        ${asyncReplace(text.recv())}
        <div class="c-input c-input--icon">
          ${asyncReplace(img.recv())}
          <i
            tabindex="0"
            id="seedCopy"
            class="c-button__icon c-input__icon"
            @click=${asyncReplace(retryf.recv())}
            ?disabled=${asyncReplace(retryDisabled.recv())}
          >
            <span>retry</span>
          </i>
        </div>
        <input ${autofocus} ${ref(input)} id="captchaInput" class="c-input" />
        <p class="t-paragraph confirm-paragraph"></p>
        <div class="c-button-group">
          <button
            type="button"
            @click=${() => props.cancel()}
            class="c-button c-button--secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="c-button"
            id="confirmRegisterButton"
            ?disabled=${asyncReplace(nextDisabled.recv())}
          >
            Next
          </button>
        </div>
      </form>
    </article>
  `;
};

export const promptCaptchaPage = <T>(
  props: Parameters<typeof promptCaptchaTemplate<T>>[0],
  container?: HTMLElement
): void => {
  const contain =
    container ?? (document.getElementById("pageContent") as HTMLElement);
  render(promptCaptchaTemplate(props), contain);
};

export const promptCaptcha = ({
  connection,
  identity,
  alias,
  challenge,
}: {
  connection: Connection;
  identity: IdentifiableIdentity;
  alias: string;
  challenge?: Promise<Challenge>;
}): Promise<RegisterResult | LoginFlowCanceled> => {
  let firstTime = true;

  return new Promise((resolve) => {
    promptCaptchaPage({
      cancel: () => resolve(cancel),
      verifyChallengeChars: async ({ chars, challenge }) => {
        const result = await connection.register(identity, alias, {
          key: challenge.challenge_key,
          chars,
        });

        switch (result.kind) {
          case "badChallenge":
            return badChallenge;
          default:
            return result;
        }
      },
      requestChallenge: () => {
        if (firstTime) {
          firstTime = false;
          return challenge ?? connection.createChallenge();
        } else {
          return connection.createChallenge();
        }
      },

      onContinue: resolve,
    });
  });
};
