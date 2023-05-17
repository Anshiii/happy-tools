import { parse } from "html-to-ast";
import generator from "./generator";
import "./index.css";

export function html2go(html: string) {
  html = html.replace(/\s+(?=<)|(?<=>)\s+|\n/g, "");
  html = html.replace(/\s{2,}/g, " ");
  const ast = parse(html);
  console.log("---anshi---ast", generator(ast));

  return generator(ast);
}

const htmlEle = document.querySelector(
  "textarea[name='html']"
) as HTMLTextAreaElement;

const resultEle = document.querySelector(
  "textarea[name='go']"
) as HTMLTextAreaElement;

const test = `<header class="container-instance container-header" data-navigation-color="black">
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
        <span class="container-header-menu-icon"></span>
    </button>
</div>
</header>`;
htmlEle.value = test;
document.querySelector("#convert")?.addEventListener("click", () => {
  const result = html2go(htmlEle?.value.trim());
  (resultEle as HTMLTextAreaElement).value = result;
});
