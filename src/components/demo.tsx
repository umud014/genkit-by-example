import { promises } from "fs";
import Markdown from "react-markdown";
import { ScrollArea } from "./ui/scroll-area";
import DemoContext from "./demo-config";
import CodeBlock from "./code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

async function loadReadme(demoName: string): Promise<string> {
  const file = await promises.readFile(`src/app/${demoName}/README.md`, { encoding: "utf8" });
  return file.split("\n").slice(2).join("\n").trim();
}

async function loadSourceFiles(
  demoName: string,
  filenames: string[]
): Promise<{ name: string; source: string }[]> {
  return Promise.all(
    filenames.map(async (fn) => ({
      name: fn,
      source: await promises.readFile(`src/app/${demoName}/${fn}`, { encoding: "utf8" }),
    }))
  );
}

export default async function Demo({
  name,
  title,
  Config,
  children,
  sourceFiles,
}: {
  name: string;
  title: string;
  Config?: React.ComponentType;
  children: React.ReactNode;
  sourceFiles?: string[];
}) {
  const readme = await loadReadme(name);
  const files = await loadSourceFiles(name, sourceFiles || ["api/route.ts"]);

  return (
    <DemoContext>
      <div className="flex">
        <ScrollArea className="overflow-y-auto min-w-fit ml-2 mr-4 my-2 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold flex-1">{title}</h1>
            <a
              href={`https://github.com/mbleigh/genkit-by-example/tree/main/src/app/${name}`}
              target="_blank"
            >
              <Button variant="outline">
                <Github /> View Source in GitHub
              </Button>
            </a>
          </div>
          {Config && (
            <div className="my-4">
              <Config />
            </div>
          )}
          <Markdown className="prose prose-sm prose-invert prose-h2:text-xl">{readme}</Markdown>
          <h2 className="text-xl font-bold my-4 mb-2">Source Code</h2>
          {/* <Tabs>
            <TabsList defaultValue={files[0].name}>
              {files.map((f) => (
                <TabsTrigger key={f.name} value={f.name}>
                  {f.name.split("/").at(-1)}
                </TabsTrigger>
              ))}
            </TabsList>
            {files.map((f) => (
              <TabsContent key={f.name} value={f.name} className="w-full">
                <CodeBlock source={f.source} />
              </TabsContent>
            ))}
          </Tabs> */}
          {files.map((f) => (
            <div key={f.name} className="mb-4">
              <CodeBlock source={`// ${f.name}\n\n${f.source}`} />
            </div>
          ))}
        </ScrollArea>
        <div className="flex-1">{children}</div>
      </div>
    </DemoContext>
  );
}
