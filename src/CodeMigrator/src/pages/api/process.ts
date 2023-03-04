import type { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';
import fs from 'fs';
import handlePrompts from 'lib/migrator';

type FileData = {
  fileName: string;
  tsxCode: string;
  csCode: string;
};

type ResponseData = {
  files: FileData[];
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  const responseData: ResponseData = { files: [] };

  try {
    const formData = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      const form = formidable({ multiples: true });
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const filesData = formData.files.files;

    if (Array.isArray(filesData)) {
      const promises = filesData.map(async (file) => {
        const path = file.filepath;
        const originalFileName = file.originalFilename;
        const rawData = fs.readFileSync(path);
        const originalCode = rawData.toString();
        const componentCode = await handlePrompts(originalCode);

        return {
          fileName: originalFileName,
          tsxCode: componentCode,
          csCode: originalCode,
        };
      });

      responseData.files = await Promise.all(promises);
    } else {
      const path = filesData.filepath;
      const originalFileName = filesData.originalFilename;
      const rawData = fs.readFileSync(path);
      const originalCode = rawData.toString();
      const componentCode = await handlePrompts(originalCode);

      responseData.files.push({
        fileName: originalFileName,
        tsxCode: componentCode,
        csCode: originalCode,
      });
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(400).send(responseData);
  }
}
