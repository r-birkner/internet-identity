import { html } from "lit-html";
import badgeImgUrl from "$assets/ic-badge.svg";

export const footer = html`<footer class="l-footer">
  <a
    class="page-signature"
    aria-label="Internet Computer homepage"
    href="https://internetcomputer.org/"
    rel="noopener noreferrer"
    target="_blank"
    ><img src=${badgeImgUrl} alt="Built on Crypto | Internet Computer"
  /></a>
</footer>`;
