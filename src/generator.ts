import { DefaultTextTag, ExplicitCallTextNodeElement } from "./constant";
import { stringify } from "html-to-ast";

type HTMLASTNode = {
  attrs: { [key: string]: string };
  children: HTMLASTNode[];
  name: keyof HTMLElementTagNameMap;
  type: "tag" | "text";
  content: string;
};

export default function generator(ast: HTMLASTNode[]): string {
  return generateNodeString(ast[0]);
}

// dfs
function generateNodeString(node: HTMLASTNode, parent?: HTMLASTNode): string {
  let labelName = getName(node.name || node.type);
  console.log("---anshi---node", node);
  // 特殊出来的 node

  let attrsCall = getAttrs(node.attrs);
  let childrenListCall = childrenHandler(node);

  if (labelName === "Text") {
    return textHandler(node, parent);
  } else if (labelName === "Svg") {
    return svgHandler(node);
  } else if (
    DefaultTextTag.includes(node.name) &&
    node.children.length &&
    node.children[0].type !== "text"
  ) {
    return `${labelName}("").Children(${
      childrenListCall ? childrenListCall : ""
    })${attrsCall}`;
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

function textHandler(node: HTMLASTNode, parent?: HTMLASTNode): string {
  return parent && ExplicitCallTextNodeElement.includes(parent?.name)
    ? `Text("${node.content}")`
    : `"${node.content}"`;
}

function childrenHandler(node: HTMLASTNode): string | undefined {
  let output;
  if (node.children?.length) {
    output = node.children?.map((item) => generateNodeString(item, node));
    // 非文本节点强制换行
    if (!output[0].startsWith('"')) {
      output = output.join(",\n");
      output = "\n" + output + ",\n";
    } else {
      output = output.join(",\n");
    }
  }

  return output;
}
