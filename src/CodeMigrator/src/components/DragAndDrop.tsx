/* eslint-disable prettier/prettier */
import React, { useState } from 'react';

import Editor from '@monaco-editor/react';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ['CS'];

interface ApiResponse {
  code: string;
}

function DragAndDrop(): JSX.Element {
  const [code, setCode] = useState<string>('');
  const handleChange = (files: FileList) => {
    sendFile(files);
  };

  function sendFile(files: FileList) {
    const formData = new FormData();

    const filesArray = Array.from(files);

    filesArray.forEach((file) => {
      formData.append('files', file);
    });

    fetch('/api/test', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((response: ApiResponse) => {
        console.log('File uploaded successfully', response);
        setCode(response.code);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  }

  return (
    <>
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        multiple={true}
        label={'Add your c# files'}
        required
        classes={'drop_area'}
      />
      {code && (
        <Editor
          height="300px"
          defaultLanguage="typescript"
          defaultValue={code}
          className={'editor__container'}
        />
      )}
    </>
  );
}

export default DragAndDrop;

