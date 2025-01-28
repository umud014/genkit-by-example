import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as theme } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ source }: { source: string }) {
  return (
    <SyntaxHighlighter
      language="javascript"
      wrapLongLines={true}
      style={theme}
      customStyle={{ fontSize: "12px", width: "100%" }}
    >
      {source}
    </SyntaxHighlighter>
  );
}
