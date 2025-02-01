import Demo from "@/components/demo";
import StructuredOutputApp from "./app";
import { demoMetadata } from "@/lib/demo-metadata";

export const generateMetadata = demoMetadata("structured-output");

export default async function Page() {
  return (
    <Demo id="structured-output" sourceFiles={["api/route.ts", "schema.ts"]}>
      <StructuredOutputApp />
    </Demo>
  );
}
