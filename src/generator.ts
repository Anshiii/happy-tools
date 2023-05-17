import { ExplicitCallTextNodeElement } from "./constant";

type HtmlAstNode = {
  attrs: { [key: string]: string };
  children: HtmlAstNode[];
  name: keyof HTMLElementTagNameMap;
  type: "tag" | "text";
  content: string;
};

export default function generator(ast: HtmlAstNode[]): string {
  function generateNodeString(node: HtmlAstNode, parent?: HtmlAstNode): string {
    let LabelName = getName(node.name || node.type);
    // @TODO 有些需要显式调用 Text
    if (LabelName === "Text") {
      console.log("---name---", parent?.name);
      return parent && ExplicitCallTextNodeElement.includes(parent?.name)
        ? `Text("${node.content}")`
        : `"${node.content}"`;
    }
    if (LabelName === "SVG") return svgHandler(node);

    console.log("---anshi---node", node);
    let attrsCall = getAttrs(node.attrs);
    let childrenListCall;
    if (node.children?.length) {
      childrenListCall = node.children?.map((item) =>
        generateNodeString(item, node)
      );
      console.log("---anshi---childrenListCall", childrenListCall);
      // 直接传入 text 文本
      if (childrenListCall[0].startsWith('"')) {
      } else {
        childrenListCall = childrenListCall.join(",\n");
        // 令最后一个 children 携带逗号以区分 children 的结束。
        childrenListCall = "\n" + childrenListCall + ",\n";
      }
    } else if (node.content) {
      childrenListCall = `"${node.content}"`;
    }

    return `${LabelName}(${
      childrenListCall ? childrenListCall : ""
    })${attrsCall}`;
  }

  return generateNodeString(ast[0]);
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

function svgHandler(node: HtmlAstNode): string {
  // RawHTML("<svg> </svg>")
  return "";
}
