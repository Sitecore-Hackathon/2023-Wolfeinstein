/* eslint-disable prettier/prettier */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';
import fs from 'fs';
import handlePrompts from 'lib/migrator';

type Data = {
  files: {
    fileName: string;
    tsxCode: string;
    csCode: string;
  }[];
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  const answer: Data = {
    files: [],
  };

  try {
    const formData = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: true });

      form.parse(req, (err, fields, files) => {
        if (err) reject({ err });
        resolve({ err, fields, files });
      });
    });

    const filesData = formData['files']['files'];

    if (Array.isArray(filesData)) {
      const promises = filesData.map(async (file) => {
        const path = file['filepath'];
        const originalFileName = file['originalFilename'];
        const rawData = fs.readFileSync(path);
        const originalCode = rawData.toString();
        const componentCode = await handlePrompts(originalCode);

        return {
          fileName: originalFileName,
          tsxCode: componentCode,
          csCode: originalCode,
        };
      });

      const results = await Promise.all(promises);
      answer.files = results;

      return res.status(200).json(answer);
    } else {
      const path = filesData['filepath'];
      const originalFileName = filesData['originalFilename'];
      const rawData = fs.readFileSync(path);
      const originalCode = rawData.toString();
      const componentCode = await handlePrompts(originalCode);

      answer.files.push({
        fileName: originalFileName,
        tsxCode: componentCode,
        csCode: originalCode,
      });
      return res.status(200).json(answer);
    }
  } catch (e) {
    res.status(400).send(answer);
    return;
  }
}
