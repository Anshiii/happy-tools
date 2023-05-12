import { parse } from "html-to-ast";
import generator from "./generator";
import './index.css'

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

document.querySelector("#convert")?.addEventListener("click", () => {
  const result = html2go(htmlEle?.value.trim());
  (resultEle as HTMLTextAreaElement).value = result;
});
html2go(`<div class="oh"><p class="pp">hi</p>  <span class="nick">  
hello 
ni     hao  </span></div>`);
