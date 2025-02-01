import { Button } from "./ui/button";
import { Github } from "lucide-react";
import Markdown from "react-markdown";
import CodeBlock from "./code-block";

export default function DemoDocs({
  id,
  name,
  Config,
  readme,
  files,
  isMobile,
}: {
  id: string;
  name: string;
  Config?: React.ComponentType;
  readme: string;
  files: { name: string; source: string }[];
  isMobile?: boolean;
}) {
  return (
    <div
      className={`${
        isMobile
          ? "py-6 overflow-y-auto"
          : "my-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl"
      }`}
    >
      <div
        className={isMobile ? "flex flex-col gap-2 mb-4" : "flex items-center"}
      >
        {!isMobile && <h1 className="text-2xl font-semibold flex-1">{name}</h1>}
        <a
          href={`https://github.com/mbleigh/genkit-by-example/tree/main/src/app/${id}`}
          target="_blank"
          className={isMobile ? "w-full" : undefined}
        >
          <Button variant="outline" className={isMobile ? "w-full" : undefined}>
            <Github className={isMobile ? "mr-2" : "mr-1"} /> View Source in
            GitHub
          </Button>
        </a>
      </div>
      {Config && (
        <div className="my-4">
          <Config />
        </div>
      )}
      <Markdown className="prose prose-sm prose-invert prose-h2:text-xl">
        {readme}
      </Markdown>
      <h2 className="text-xl font-bold my-4 mb-2">Source Code</h2>
      {files.map((f) => (
        <div key={f.name} className="mb-4">
          <CodeBlock source={`// ${f.name}\n\n${f.source}`} />
        </div>
      ))}
    </div>
  );
}
