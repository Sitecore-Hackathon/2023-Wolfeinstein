/* eslint-disable prettier/prettier */
import axios, { AxiosRequestConfig } from 'axios';

const prompts = {
  '1': 'Given the next C# code return the class name. CODEHERE',
  '2': `Remove all c# attributes and namespace from the following code and then transform the resulting c# model to a typescript type where each field will have Comp.Field<T> as type where T is the original type. Do not show the c# code. All the fields inside the typescript type will  be wrapped around a fields object. 
    CODEHERE`,
  '3': `Create a jsx element for the MODELNAME type called TYPENAME ignoring the type and destructuring the fields object from the type. If is a link use a Text component, if is content or htmlstring use a RichText component, if is a heading or title use a Link component, if is an action use a Button component, if is a date use a DateField component, if is anything else do not render it. 
    CODEHERE`,
};

export default async function handlePrompts(csCode: string): Promise<string> {
  const data = await firstCall(csCode);
  return data;
}

const firstCall = async (csCode: string): Promise<string> => {
  let className;

  const classNamePrompt = prompts[1].replace('CODEHERE', csCode);

  const classNameBase64 = Buffer.from(classNamePrompt).toString('base64');

  const classNameOptions: AxiosRequestConfig = {
    method: 'POST',
    url: 'https://verndale-aigateway.azurewebsites.net/GenerateComplexContent',
    data: {
      prompt: classNameBase64,
    },
  };

  let data = '';

  try {
    const response = await axios.request(classNameOptions);
    className = response.data;

    // take the value from prompts[1] and, where it says CODEHERE, replace it with the "csCode" variable
    const prompt = prompts[2].replace('CODEHERE', csCode);

    const base64 = Buffer.from(prompt).toString('base64');

    // generate axios options for the request with body
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: 'https://verndale-aigateway.azurewebsites.net/GenerateComplexContent',
      data: {
        prompt: base64,
      },
    };

    // call the apiCall function and pass in the url variable
    data = await apiCall(options, className);
  } catch (error) {
    console.log(error);
  }

  return data;
};

const apiCall = async (options: AxiosRequestConfig, className: string): Promise<string> => {
  try {
    let responseData = '';

    const response = await axios.request(options);
    responseData = response.data;

    const imports = `import * as Comp from '@sitecore-jss/sitecore-jss-nextjs';\nimport { ComponentProps } from 'lib/component-props';`;

    // concatenate at the beggining of the response data the imports variable
    responseData = imports + responseData;

    // take the line that starts with "type", the word after that has the word model in it, replace it with "Props"
    responseData = responseData.replace(/type.*model/g, 'Props');

    // take the line that starts with "type", replace the "=" with "= ComponentProps &"
    responseData = responseData.replace(/=/g, '= ComponentProps &');

    let prompt = prompts[3].replace('CODEHERE', responseData);
    // in the className replace "Model" with "Props"
    const classNameProps = className.replace('Model', 'Props').replace('\n', '');

    prompt = prompt.replace('MODELNAME', classNameProps);

    const classNameModel = className.replace('Model', '').replace('\n', '');

    prompt = prompt.replace('TYPENAME', classNameModel);

    // transform prompt to base64
    const base64 = Buffer.from(prompt).toString('base64');

    // generate axios options for the request with body
    const requestOptions: AxiosRequestConfig = {
      method: 'POST',
      url: 'https://verndale-aigateway.azurewebsites.net/GenerateComplexContent',
      data: {
        prompt: base64,
      },
    };

    const response2 = await axios.request(requestOptions);
    // take the responseData variable from above and concatenate it at the beggining of the response data
    responseData = responseData + response2.data;

    // find the "export default" and replace it with "export default Comp.withDatasourceCheck()<AlertLabelsModel>(AlertLabels)"
    responseData = responseData.replace(
      /export default/g,
      // `export default Comp.withDatasourceCheck()<${classNameProps.replace("\n", "")}>(${classNameModel.replace("\n", "")})`
      "export default Comp.withDatasourceCheck()<" + classNameProps.replace("\r", "").replace("\n", "").replace("\r", "") + ">(" + classNameModel.replace("\r", "").replace("\n", "").replace("\r", "") + ")"
    );

    // find "=>" and replace it with ": JSX.Element =>"
    responseData = responseData.replace(/=>/g, ': JSX.Element =>');

    // find ": React.FC<${classNameModel}>" and replace it with "JSX.Element"
    responseData = responseData.replace(/: React.FC<.*>/g, '= (): JSX.Element');

    return responseData;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while calling the API');
  }
};

