/* eslint-disable prettier/prettier */

import axios, { AxiosRequestConfig } from 'axios';

const prompts = {
  '1': 'Given the next C# code return the class name. CODEHERE',
  '2': `Remove all c# attributes and namespace from the following code and then transform the resulting c# model to a typescript type where each field will have Comp.Field<T> as type where T is the original type. Do not show the c# code. All the fields inside the typescript type will  be wrapped around a fields object. 
    CODEHERE`,
  '3': `Create a jsx element for the MODELNAME type called TYPENAME ignoring the type and destructuring the fields object from the type. If is a link use a Text component, if is content or htmlstring use a RichText component, if is a heading or title use a Link component, if is an action use a Button component, if is a date use a DateField component, if is anything else do not render it. 
    CODEHERE`,
};

const url = 'https://verndale-aigateway.azurewebsites.net/GenerateComplexContent';

export default async function handlePrompts(csCode: string): Promise<string> {
  const data = await firstCall(csCode);
  return data;
}

const firstCall = async (csCode: string): Promise<string> => {
  let className = '';

  try {
    const classNamePrompt = prompts[1].replace('CODEHERE', csCode);
    const classNameBase64 = Buffer.from(classNamePrompt).toString('base64');
    const classNameOptions: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: {
        prompt: classNameBase64,
      },
    };
    const classNameResponse = await axios.request(classNameOptions);
    className = classNameResponse.data;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while calling the API');
  }

  const prompt = prompts[2].replace('CODEHERE', csCode);
  const base64 = Buffer.from(prompt).toString('base64');
  const options: AxiosRequestConfig = {
    method: 'POST',
    url,
    data: {
      prompt: base64,
    },
  };
  const data = await apiCall(options, className);
  return data;
};

const apiCall = async (options: AxiosRequestConfig, className: string): Promise<string> => {
  try {
    const response = await axios.request(options);

    const responseData = `import * as Comp from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

${response.data}
      `
      .replace(/type.*model/g, 'Props')
      .replace(/=/g, '= ComponentProps &')
      .replace(
        /export default/g,
        `export default Comp.withDatasourceCheck()<${className.replace(
          /Model\n/g,
          'Props'
        )}>(${className.replace(/Model\n/g, '')})`
      )
      .replace(/=>/g, ': JSX.Element =>')
      .replace(/: React.FC<.*>/g, '= (): JSX.Element');

    const base64 = Buffer.from(
      prompts[3]
        .replace('CODEHERE', responseData)
        .replace('MODELNAME', className.replace(/Model\n/g, 'Props'))
        .replace('TYPENAME', className.replace(/Model\n/g, ''))
    ).toString('base64');

    const requestOptions: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: { prompt: base64 },
    };

    const response2 = await axios.request(requestOptions);

    return responseData + response2.data;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while calling the API');
  }
};
