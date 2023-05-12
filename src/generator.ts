type HtmlAstNode = {
  attrs: { [key: string]: string };
  children: HtmlAstNode[];
  name: keyof HTMLElementTagNameMap;
  type: "tag" | "text";
  content: string;
};

export default function generator(ast: HtmlAstNode[]): string {
  function generateNodeString(node: HtmlAstNode): string {
    let LabelName = getName(node.name || node.type);
    if (LabelName === "Text") return `"${node.content}"`;

    let attrsCall = getAttrs(node.attrs);
    let childrenListCall;
    if (node.children?.length) {
      childrenListCall = node.children
        ?.map((item) => generateNodeString(item))
        .join(",");
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
    let name = getName(attrName);
    let attrString = attrHandler(name, attrs[attrName]);

    return acc + attrString;
  }, "");
}

function attrHandler(name: string, value: string) {
  if (name.startsWith("Data")) {
    return `.Attr("${name}","${value}")`;
  }
  return `.${name}("${value}")`;
}
