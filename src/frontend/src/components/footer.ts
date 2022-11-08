import { html } from "lit-html";
import { icSymbol } from "./icons";

const splitString = (str: string) =>
  str
    .split("")
    .map(
      (c, i) =>
        html`<i style="--i: ${(i / str.length).toFixed(2)};"
          >${c === " " ? html`&nbsp;` : c}</i
        >`
    );

export const footer = html`<footer class="l-footer c-footer">
  <ul class="c-list--flex">
    <li>
      <a
        class="c-footer__logo c-signature"
        aria-label="Internet Computer, 100% on chain"
        href="https://internetcomputer.org/"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span class="c-signature__text" aria-hidden="true">
          <span class="c-signature__part">
            ${splitString("Internet Computer")}
          </span>
          <span class="c-signature__part c-signature__part--second">
            ${splitString("100% On-chain")}
          </span>
        </span>
        ${icSymbol}
      </a>
    </li>
    <li>
      <a
        href="/about"
        target="_blank"
        class="t-link t-link--discreet"
        id="aboutLink"
        rel="noopener noreferrer"
        >About</a
      >
    </li>
    <li>
      <a
        href="/faq"
        target="_blank"
        class="t-link t-link--discreet"
        id="faqLink"
        rel="noopener noreferrer"
        >FAQ</a
      >
    </li>
  </ul>
</footer>`;
