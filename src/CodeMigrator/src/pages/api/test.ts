/* eslint-disable prettier/prettier */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import axios, { AxiosRequestConfig } from 'axios';

type Data = {
  files: {
    fileName: string;
    tsxCode: string;
    csCode: string;
  }[];
};

export const config = {
  api:{
    bodyParser: false,
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>): Promise<void> {
  try {
    const formData = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: true })

      form.parse(req, (err, fields, files) => {
        if (err) reject({ err })
        resolve({ err, fields, files })
      })
    })

    console.log('formData', formData);
    const filesData = formData['files']['files'];
    if (Array.isArray(filesData)) {
      filesData.forEach((file) => {
        const path = file['filepath'];
        const rawData = fs.readFileSync(path);
        console.log(rawData.toString());
        return rawData.toString();
      });
    } else {
      const path = filesData['filepath'];
      const rawData = fs.readFileSync(path);
      console.log(rawData.toString());
    }

  } catch (e) {
    res.status(400).send({ files: [] });
    return;
  }

  return res.status(200).json({
    files: [
      {
        fileName: 'test',
        tsxCode: `import React, { useState, useEffect, useRef } from "react";
          `,
        csCode: 'using System;',
      },
      {
        fileName: 'test 2',
        tsxCode: `import React, { useState, useEffect, useRef } from "react";
          `,
        csCode: 'using System;',
      },
    ],
  });
}

const handlePrompts = (csCode: string) => {

  const prompts = {
    "1": "Given the next C# code return the class name. CODEHERE",
    "2": `Remove all c# attributes and namespace from the following code and then transform the resulting c# model to a typescript type where each field will have Comp.Field<T> as type where T is the original type. Do not show the c# code. All the fields inside the typescript type will  be wrapped around a fields object. 
    CODEHERE`,
    "3": `Create a jsx element for the MODELNAME type called TYPENAME ignoring the type and destructuring the fields object from the type. If is a link use a Text component, if is content or htmlstring use a RichText component, if is a heading or title use a Link component, if is an action use a Button component, if is a date use a DateField component, if is anything else do not render it. 
    CODEHERE`,
  }

  const apiCall = (options: AxiosRequestConfig, className: string) => {

    let responseData: string;

    axios.request(options)
      .then((response) => {
        responseData = response.data;

        const imports = `import * as Comp from '@sitecore-jss/sitecore-jss-nextjs';\nimport { ComponentProps } from 'lib/component-props';`

        // concatenate at the beggining of the response data the imports variable
        responseData = imports + responseData;

        // take the line that starts with "type", the word after that has the word model in it, replace it with "Props" 
        responseData = responseData.replace(/type.*model/g, "Props");

        // take the line that starts with "type", replace the "=" with "= ComponentProps &"
        responseData = responseData.replace(/=/g, "= ComponentProps &");


        let prompt = prompts[3].replace("CODEHERE", responseData);
        // in the className replace "Model" with "Props"
        const classNameProps = className.replace("Model", "Props").replace("\n", " ");

        prompt = prompt.replace("MODELNAME", classNameProps)

        const classNameModel = className.replace("Model", "").replace("\n", " ")

        prompt = prompt.replace("TYPENAME", classNameModel)
        console.log(prompt)

        // transform prompt to base64
        const base64 = Buffer.from(prompt).toString('base64');

        // generate axios options for the request with body
        const options: AxiosRequestConfig = {
          method: 'POST',
          url: 'https://verndale-aigateway.azurewebsites.net/GenerateComplexContent',
          data: {
            prompt: base64
          }
        };

        axios.request(options)
          .then((response) => {
            // take the responseData variable from above and concatenate it at the beggining of the response data
            responseData = responseData + response.data;

            // find the "export default" and replace it with "export default Comp.withDatasourceCheck()<AlertLabelsModel>(AlertLabels)"
            responseData = responseData.replace(/export default/g, "export default Comp.withDatasourceCheck()<AlertLabelsModel>(AlertLabels)");

            // find "=>" and replace it with ": JSX.Element =>"
            responseData = responseData.replace(/=>/g, ": JSX.Element =>");

            // find ": React.FC" and replace it with " "
            responseData = responseData.replace(/: React.FC<AlertLabelsModel>/g, " ");

            console.log(responseData);

            return responseData;

          }
          )
          .catch((error) => {
            console.log(error);
          }
          )


      }
      )
      .catch((error) => {
        console.log(error);
      }
      )



  }

  const firstCall = () => {

    let className;

    const classNamePrompt = prompts[1].replace("CODEHERE", csCode);

    const classNameBase64 = Buffer.from(classNamePrompt).toString('base64');

    const classNameOptions: AxiosRequestConfig = {
      method: 'POST',
      url: 'https://verndale-aigateway.azurewebsites.net/GenerateComplexContent',
      data: {
        prompt: classNameBase64
      }
    };

    axios.request(classNameOptions)
      .then((response) => {
        className = response.data;
        console.log(className);

        // take the value from prompts[1] and, where it says CODEHERE, replace it with the "csCode" variable
        const prompt = prompts[2].replace("CODEHERE", csCode);

        const base64 = Buffer.from(prompt).toString('base64');

        // generate axios options for the request with body 
        const options = {
          method: 'POST',
          url: 'https://verndale-aigateway.azurewebsites.net/GenerateComplexContent',
          data: {
            prompt: base64
          }
        };

        // call the apiCall function and pass in the url variable
        const data = apiCall(options, className);

        return data;
      }
      )
      .catch((error) => {
        console.log(error);
      }
      )

  }
}