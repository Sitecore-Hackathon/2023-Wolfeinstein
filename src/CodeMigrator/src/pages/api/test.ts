/* eslint-disable prettier/prettier */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  code?: string;
  message?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>): void {
  console.log(req.body);
  return res.status(200).json({
    code: `import React from "react";
  import "@uiw/react-textarea-code-editor/dist.css";
  import dynamic from "next/dynamic";
  
  const CodeEditor = dynamic(
    () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
    { ssr: false }
  );
  
  function HomePage() {
    const [code, setCode] = React.useState(
      \`function add(a, b) {\n  return a + b;\n}\`
    );
    return (
      <div>
        <CodeEditor
          value={code}
          language="js"
          placeholder="Please enter JS code."
          onChange={(evn) => setCode(evn.target.value)}
          padding={15}
          style={{
            fontSize: 12,
            backgroundColor: "#f5f5f5",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
          }}
        />
      </div>
    );
  }
  
  export default HomePage;`,
  });
}

