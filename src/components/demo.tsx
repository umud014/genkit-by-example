import { promises } from "fs";
import { mustFindDemo } from "@/data";
import DemoContent from "./demo-content";

async function loadReadme(demoName: string): Promise<string> {
  const file = await promises.readFile(`src/app/${demoName}/README.md`, {
    encoding: "utf8",
  });
  return file.split("\n").slice(2).join("\n").trim();
}

async function loadSourceFiles(
  demoName: string,
  filenames: string[]
): Promise<{ name: string; source: string }[]> {
  return Promise.all(
    filenames.map(async (fn) => ({
      name: fn,
      source: await promises.readFile(`src/app/${demoName}/${fn}`, {
        encoding: "utf8",
      }),
    }))
  );
}

export default async function Demo({
  id,
  Config,
  children,
  sourceFiles,
}: {
  id: string;
  Config?: React.ComponentType;
  children: React.ReactNode;
  sourceFiles?: string[];
}) {
  const { name } = mustFindDemo(id);
  const readme = await loadReadme(id);
  const files = await loadSourceFiles(id, sourceFiles || ["api/route.ts"]);

  return (
    <DemoContent
      id={id}
      name={name}
      Config={Config}
      readme={readme}
      files={files}
    >
      {children}
    </DemoContent>
  );
}
