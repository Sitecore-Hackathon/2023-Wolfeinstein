/* eslint-disable prettier/prettier */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';
import fs from 'fs';

type Data = {
  files: {
    fileName: string;
    tsxCode: string;
    csCode: string;
  }[];
};

interface FormDataType {
  err?: Error;
  fields: formidable.Fields;
  files: formidable.Files;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>): void {
  // const formData: FormDataType = await new Promise((resolve, reject) => {
  //   const form = formidable({ multiples: true });

  //   form.parse(req, (err, fields, files) => {
  //     if (err) reject({ err });
  //     resolve({ err, fields, files });
  //   });
  // });

  // console.log('formData', formData);

  // const filesData = formData['files']['files'];
  // if (Array.isArray(filesData)) {
  //   filesData.forEach((file) => {
  //     const path = file['filepath'];
  //     const rawData = fs.readFileSync(path);
  //     console.log(rawData.toString());
  //   });
  // } else {
  //   const path = filesData['filepath'];
  //   const rawData = fs.readFileSync(path);
  //   console.log(rawData.toString());
  // }

  return res.status(200).json({
    files: [
      {
        fileName: 'test',
        tsxCode: `import React, { useState, useEffect, useRef } from "react";

          import Editor from "@monaco-editor/react";
          import files from "./files";

          function App() {
            const editorRef = useRef(null);
            const [fileName, setFileName] = useState("script.js");

            const file = files[fileName];

            useEffect(() => {
              editorRef.current?.focus();
            }, [file.name]);

            return (
              <>
                <button
                  disabled={fileName === "script.js"}
                  onClick={() => setFileName("script.js")}
                >
                  script.js
                </button>
                <button
                  disabled={fileName === "style.css"}
                  onClick={() => setFileName("style.css")}
                >
                  style.css
                </button>
                <button
                  disabled={fileName === "index.html"}
                  onClick={() => setFileName("index.html")}
                >
                  index.html
                </button>
                <Editor
                  height="80vh"
                  theme="vs-dark"
                  path={file.name}
                  defaultLanguage={file.language}
                  defaultValue={file.value}
                  onMount={(editor) => (editorRef.current = editor)}
                />
              </>
            );
          }

          export default App;
          `,
        csCode: 'using System;',
      },
      {
        fileName: 'test 2',
        tsxCode: `import React, { useState, useEffect, useRef } from "react";

          import Editor from "@monaco-editor/react";
          import files from "./files";

          function App() {
            const editorRef = useRef(null);
            const [fileName, setFileName] = useState("script.js");

            const file = files[fileName];

            useEffect(() => {
              editorRef.current?.focus();
            }, [file.name]);

            return (
              <>
                <button
                  disabled={fileName === "script.js"}
                  onClick={() => setFileName("script.js")}
                >
                  script.js
                </button>
                <button
                  disabled={fileName === "style.css"}
                  onClick={() => setFileName("style.css")}
                >
                  style.css
                </button>
                <button
                  disabled={fileName === "index.html"}
                  onClick={() => setFileName("index.html")}
                >
                  index.html
                </button>
                <Editor
                  height="80vh"
                  theme="vs-dark"
                  path={file.name}
                  defaultLanguage={file.language}
                  defaultValue={file.value}
                  onMount={(editor) => (editorRef.current = editor)}
                />
              </>
            );
          }

          export default App;
          `,
        csCode: 'using System;',
      },
    ],
  });
}
