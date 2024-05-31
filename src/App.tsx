//Version 31.05.2024 v.1
// ./src/App.tsx

import React, { useState } from 'react';
import Path from 'path';
import uploadFileToBlob, { isStorageConfigured } from './azure-storage-blob';

const storageConfigured = isStorageConfigured();

const App = (): JSX.Element => {
  // all blobs in container
  const [blobList, setBlobList] = useState<string[]>([]);

  // current file to upload into container
  const [fileSelected, setFileSelected] = useState(null);

  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const onFileChange = (event: any) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    const blobsInContainer: string[] = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    setBlobList(blobsInContainer);

    // reset state/form
    setFileSelected(null);
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  // display form
  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} key={inputKey || ''} />
      <button className='btn btn-secondary' type="submit" onClick={onFileUpload}>
        Upload!
          </button>
    </div>
  )


//<div class="p-5 bg-primary text-white text-center">
//  <h1>My First Bootstrap 5 Page</h1>
//  <p>Resize this responsive page to see the effect!</p> 
//</div>


  // display file name and image
  const DisplayImagesFromContainer = () => (
    <div p-5 bg-primary text-white text-center>
        <h2>Images in the contrainer from today</h2>
      <ul className='list-group'>
        {blobList.map((item) => {
          return (
            <li className='list-group-item' key={item}>
              <div>
                <a href={`${Path.dirname(item)}/${Path.basename(item)}`} target='_blank' rel='noreferrer'>{Path.basename(item)}</a>
                <br />
                <img className='img-thumbnail' src={item} alt={item} height="200" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className='p-5 bg-primary text-white text-center'>
      <h1>thin*image gallery</h1><br/>
    
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      
      {storageConfigured && blobList.length > 0 && DisplayImagesFromContainer()}
      {!storageConfigured && <div>Storage is not configured.</div>}
    </div>
  );
};

export default App;


