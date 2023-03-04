/* eslint-disable prettier/prettier */
import React, { useState } from 'react';

import { AiOutlineCopy } from 'react-icons/ai';
import Editor from '@monaco-editor/react';
import { FaChevronRight } from 'react-icons/fa';
import { FileUploader } from 'react-drag-drop-files';
import { GrDocumentDownload } from 'react-icons/gr';
import Image from 'next/image';

const fileTypes = ['cs'];

interface ApiResponse {
  files: Array<{ fileName: string; tsxCode: string; csCode: string; loading?: boolean }>;
}
interface ApiTextResponse {
  newCode: string;
}

function DragAndDrop(): JSX.Element {
  const [files, setFiles] = useState<
    Array<{ fileName: string; tsxCode: string; csCode: string; loading?: boolean }>
  >([]);

  const handleChange = (files: FileList) => {
    sendFile(files);
  };

  const downloadValueAsFile = (value: string, fileName: string) => {
    // Create a Blob object with the value
    const blob = new Blob([value], { type: 'text/plain' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element with the download attribute set to the file name and the href attribute set to the URL of the Blob
    const anchor = document.createElement('a');
    anchor.setAttribute('download', fileName);
    anchor.setAttribute('href', url);

    // Programmatically click the anchor element to initiate the download
    anchor.click();

    // Clean up by revoking the URL object
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sendFile = (files: FileList) => {
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    fetch('/api/test', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((response: ApiResponse) => {
        console.log('File uploaded successfully', response);
        setFiles(response.files);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  const handleReprocess = (code: string, fileName: string) => {
    const updatedFiles = files.map((file) => {
      if (file.fileName === fileName) {
        return {
          ...file,
          loading: true,
        };
      }
      return file;
    });
    setFiles(updatedFiles);

    fetch('/api/reprocess', {
      method: 'POST',
      body: code,
    })
      .then((response) => {
        return response.json();
      })
      .then((response: ApiTextResponse) => {
        console.log('File uploaded successfully', files);
        //find the file with the same name and replace the code
        const newFiles = updatedFiles.map((file) => {
          if (file.fileName === fileName) {
            return {
              ...file,
              tsxCode: response.newCode,
              loading: false,
            };
          }
          return file;
        });
        setFiles(newFiles);
      });
  };

  return (
    <>
      <div className="drag-and-drop__section">
        <div className="logo__container">
          <Image src={'/logo.png'} alt={'logo'} width={648} height={366} className="logo" />
        </div>
        <h2>Add your files:</h2>
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          multiple={true}
          label={'Add your c# files'}
          required
          classes={'drop_area'}
        />
        <br />
        {files.length > 0 && <h2>Your files</h2>}

        {files &&
          files.map((file, index) => (
            <div key={index}>
              <div className="editor__container">
                <div className="editor">
                  <h3>{file.fileName}.cs</h3>
                  <Editor
                    height="300px"
                    defaultLanguage="typescript"
                    defaultValue={file.csCode}
                    className={'code-editor__container'}
                  />
                </div>
                <div className="reprocess__container">
                  {file.loading ? (
                    <span className="loader"></span>
                  ) : (
                    <button
                      onClick={() => handleReprocess(file.csCode, file.fileName)}
                      className="btn--update"
                    >
                      Update <FaChevronRight />
                    </button>
                  )}
                </div>
                <div className="editor">
                  <div className="title__container">
                    <h3>{file.fileName}.tsx</h3>
                    {file.loading ? (
                      <span className="loader"></span>
                    ) : (
                      <div className="buttons__container">
                        <button
                          className="btn"
                          title="Copy to clipboard"
                          onClick={() => copyToClipboard(file.tsxCode)}
                        >
                          <AiOutlineCopy className="icon" />
                        </button>
                        <button
                          className="btn"
                          title="Download"
                          onClick={() => downloadValueAsFile(file.tsxCode, `${file.fileName}.tsx`)}
                        >
                          <GrDocumentDownload className="icon" />
                        </button>
                      </div>
                    )}
                  </div>

                  <Editor
                    height="300px"
                    defaultLanguage="typescript"
                    defaultValue={file.tsxCode}
                    value={file.tsxCode}
                    className={'code-editor__container'}
                  />
                </div>
              </div>
              <hr className="hr" />
            </div>
          ))}
      </div>
    </>
  );
}

export default DragAndDrop;

