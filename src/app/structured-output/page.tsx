import Demo from "@/components/demo";
import StructuredOutputApp from "./app";

export default async function Page() {
  return (
    <Demo
      name="structured-output"
      title="Structured Output"
      sourceFiles={["api/route.ts", "schema.ts"]}
    >
      <StructuredOutputApp />
    </Demo>
  );
}
