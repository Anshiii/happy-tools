import { parse } from "html-to-ast";
import generator from "./generator";

export interface IOption {
  forceNewLine: boolean;
}

export function html2go(html: string, option: IOption) {
  /**
   * clean the blank between the text,and between tag and text,
   */
  const cleanHtml = html
    .replace(/\s+(?=<)|(?<=>)\s+|\n/g, "")
    .replace(/\s{2,}/g, " ");

  const ast = parse(cleanHtml);

  return generator(ast, option);
}

function copyResult(values: string) {
  navigator.clipboard.writeText(values);
}

const htmlEle = document.querySelector(
  "textarea[name='html']"
) as HTMLTextAreaElement;

const resultEle = document.querySelector(
  "textarea[name='go']"
) as HTMLTextAreaElement;

const MOCK_DATA = `<header class="container-instance container-header" data-navigation-color="black">
<div class="container-wrapper">
    <a class="container-header-logo" href="#">
        <svg viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.399 10.054V0L0 10.054V29.73h28.792V0L14.4 10.054z"
                fill="currentColor">
                <title>The Plant</title>
            </path>
        </svg>
    </a>
    <ul class="container-header-links" data-list-unset="true">
        <li><a href="#">What we do</a></li>
        <li data-dropdown>
            <a href="#">Projects</a>
            <ul class="container-header-sublinks" data-list-unset="true">
                <li><a href="#">Commerce</a></li>
                <li><a href="#">Contents</a></li>
            </ul>
        </li>
        <li><a href="#">Why clients choose us</a></li>
        <li><a href="#">Our company</a></li>
    </ul>
    <button class="container-header-menu">
        <span class="container-header-menu-icon">
          <img src="./path" alt="good pict">
        </span>
    </button>
</div>
</header>`;
htmlEle.value = MOCK_DATA;

document.querySelector("#convert")?.addEventListener("click", () => {
  const forceNewLine = Boolean(
    (document.querySelector("#force-new-line") as HTMLInputElement).checked
  );
  const autoCopy = Boolean(
    (document.querySelector("#auto-copy") as HTMLInputElement).checked
  );
  const result = html2go(htmlEle?.value.trim(), { forceNewLine });

  autoCopy && copyResult(result);

  (resultEle as HTMLTextAreaElement).value = result;
});
