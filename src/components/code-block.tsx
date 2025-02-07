/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as theme } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  source,
  language,
}: {
  source: string;
  language?: string;
}) {
  return (
    <SyntaxHighlighter
      language={language || "javascript"}
      wrapLongLines={true}
      style={theme}
      customStyle={{ fontSize: "12px", width: "100%", whiteSpace: "pre-wrap" }}
      codeTagProps={{ style: { whiteSpace: "pre-wrap" } }}
    >
      {source}
    </SyntaxHighlighter>
  );
}
