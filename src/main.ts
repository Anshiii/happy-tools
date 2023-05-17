import { parse } from "html-to-ast";
import generator from "./generator";
import "./index.css";

export function html2go(html: string) {
  html = html.replace(/\s+(?=<)|(?<=>)\s+|\n/g, "");
  html = html.replace(/\s{2,}/g, " ");
  const ast = parse(html);
  console.log("---anshi---ast", html);
  console.log("---anshi---ast", ast);
  console.log("---anshi---ast", generator(ast));

  return generator(ast);
  // 1.改造成 go 的 ast  再通过反解析器输出 go
  // 2.自定义 compiler ，输出 go 片段
}

const htmlEle = document.querySelector(
  "textarea[name='html']"
) as HTMLTextAreaElement;

const resultEle = document.querySelector(
  "textarea[name='go']"
) as HTMLTextAreaElement;

const test = `<div class="container-instance container-pricing" data-background-color="grey">
<div class="container-wrapper">
  <h1 class="container-pricing-heading">Cost comparison for a typical project</h1>
  <p class="container-pricing-text">Our solutions deliver outstanding cost reduction with unparalleled performance</p>
  <div class="container-pricing-chart">
    <div class="container-pricing-chart-column">
      <div class="container-pricing-chart-name">The Plant’s solution</div>
      <div class="container-pricing-chart-bar" data-background-color="blue" style="width: 35%"></div>
    </div>
    <div class="container-pricing-chart-column">
      <div class="container-pricing-chart-name">Previous solution</div>
      <div class="container-pricing-chart-bar" data-background-color="grey" style="width: 100%"></div>
    </div>
  </div>
  <p class="container-pricing-text">Disclaimer:</p>
</div>
</div>`;
htmlEle.value = test;
document.querySelector("#convert")?.addEventListener("click", () => {
  const result = html2go(htmlEle?.value.trim());
  (resultEle as HTMLTextAreaElement).value = result;
});
