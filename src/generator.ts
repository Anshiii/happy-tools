import { DefaultTextTag, SpecialTag } from "./constant";
//@ts-ignore
import { stringify } from "html-to-ast";
import { IOption } from "./main";

type HTMLASTNode = {
  attrs: { [key: string]: string };
  children: HTMLASTNode[];
  name: keyof HTMLElementTagNameMap;
  type: "tag" | "text";
  content: string;
};

const globalConfig = { forceNewLine: false };
export default function generator(ast: HTMLASTNode[], option: IOption): string {
  globalConfig.forceNewLine = option.forceNewLine;
  return generateNodeString(ast[0]);
}

// dfs
function generateNodeString(node: HTMLASTNode): string {
  let labelName = getName(node.name || node.type);

  let attrsCall = getAttrs(node.attrs);
  let childrenListCall = childrenHandler(node);

  /**
   * For different tag, there's different rules.
   * 1. DefaultTextTag: see defaultTextTagHandler
   * 2. Text：return Text(content)
   * 2. Svg: return the raw html
   * 3. SpecialTag: see specialTagHandler
   * 4.
   *
   */
  if (DefaultTextTag.includes(node.name)) {
    return defaultTextTagHandler(node);
  } else if (labelName === "Text") {
    return textHandler(node);
  } else if (labelName === "Svg") {
    return svgHandler(node);
  } else if (SpecialTag.includes(node.name)) {
    return specialTagHandler(node);
  } else {
    return `${labelName}(${
      childrenListCall ? childrenListCall : ""
    })${attrsCall}`;
  }
}

function getName(name: string): string {
  if (!name) return "";
  return name?.charAt(0).toUpperCase() + name?.slice(1);
}

function getAttrs(attrs: { [key: string]: string }): string {
  if (!attrs || !Object.keys(attrs).length) return "";
  return Object.keys(attrs).reduce((acc, attrName) => {
    let attrString = attrHandler(attrName, attrs[attrName]);
    return acc + attrString;
  }, "");
}

function attrHandler(name: string, value: string) {
  if (name.startsWith("data")) {
    return `.Attr("${name}","${value}")`;
  }
  let upName = getName(name);
  return `.${upName}("${value}")`;
}

function svgHandler(node: HTMLASTNode): string {
  const html = stringify([node]);
  return `RawHTML(\`${html}\`)`;
}

function textHandler(node: HTMLASTNode): string {
  return `Text("${node.content}")`;
}

function childrenHandler(node: HTMLASTNode): string | undefined {
  let output;
  let enterSignal = globalConfig.forceNewLine ? "\n" : "";
  if (node.children?.length) {
    output = node.children?.map((item) => generateNodeString(item));
    // add break link at the beginning, end and break of the children if needed.
    if (!output[0].startsWith('"')) {
      output = output.join(`,${enterSignal}`);
      output = enterSignal + output + "," + enterSignal;
    } else {
      output = output.join(`,${enterSignal}`);
    }
  }

  return output;
}

function defaultTextTagHandler(node: HTMLASTNode) {
  /**
   * 1. no child, return Tag(name)
   * 2. only one text child, return Name(text)
   * 3. only one no text child, Tag(name).Children(dfs(node))
   * 4. many child, return Tag(name).Children(dfs(nodes))
   */

  let labelName = getName(node.name || node.type);
  let children = node.children;
  let childrenListCall = childrenHandler(node);
  let attrsCall = getAttrs(node.attrs);

  if (children.length === 0) {
    return `Tag("${node.name}")${attrsCall}`;
  }

  if (children.length === 1 && children[0].type === "text") {
    return `${labelName}("${children[0].content}")${attrsCall}`;
  }

  return `Tag("${node.name}").Children(${childrenListCall})${attrsCall}`;
}

function specialTagHandler(node: HTMLASTNode) {
  /**
   * node here such as input call attr src default,it's a burden to handle it one by one.
   */
  let childrenListCall = childrenHandler(node);
  let attrsCall = getAttrs(node.attrs);
  let children = node.children;

  if (children.length === 0) {
    return `Tag("${node.name}").OmitEndTag()${attrsCall}`;
  }
  return `Tag("${node.name}").Children(${childrenListCall})${attrsCall}`;
}
