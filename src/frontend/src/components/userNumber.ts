import { html, TemplateResult } from "lit-html";

export type userNumberProps = {
  uuid?: string;
  cssClasses?: string[];
  placeholder?: string;
  value?: string;
};

export const userNumberInput = (
  props = {
    uuid: "userNumberInput",
    cssClasses: ["c-input", "c-input--vip"],
    placeholder: "Enter Anchor",
    value: "",
  }
): TemplateResult => html`<input
  type="text"
  id="${props.uuid}"
  class="${props.cssClasses.join(" ")}"
  placeholder="${props.placeholder}"
  value=${props.value}
/>`;
