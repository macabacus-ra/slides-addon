import React, { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';
// This is a wrapper for google.script.run that lets us use promises.

import { recolorStore } from '../../store/recolor';

const SheetEditor = () => {
  const [names, setNames] = useState([]);

  // useEffect(() => {
  //   // Call a server global function here and handle the response with .then() and .catch()
  //   serverFunctions.getSheetsData().then(setNames).catch(alert);
  // }, []);

  // const deleteSheet = (sheetIndex) => {
  //   serverFunctions.deleteSheet(sheetIndex).then(setNames).catch(alert);
  // };

  // const setActiveSheet = (sheetName) => {
  //   serverFunctions.setActiveSheet(sheetName).then(setNames).catch(alert);
  // };

  // You can also use async/await notation for server calls with our server wrapper.
  // (This does the same thing as .then().catch() in the above handlers.)

  const [googleResponse, setGoogleResponse] = useState('nothing yet')
  const currentScope = recolorStore((state) => state.currentScope)
  const setScope = recolorStore((state) => state.setScope)

  const handleGetColors = async (value) => {
    setScope(value)
    const response = await serverFunctions.loadColors(value);
    if(response){ setGoogleResponse( JSON.stringify(response)) }
  }


  return (
    <div>
      <div onClick={handleGetColors} style={{padding: '5px', border: '1px solid black', width: 'fit-content'}}>Get Colors</div>

      <div>
        <h4>Scope</h4>
        <ul>
          <li onClick={() => handleGetColors('shapes')}>Shapes</li>
          <li onClick={() => handleGetColors('slide') }>Slide</li>
          <li onClick={() => handleGetColors('presentation') }>Presentation</li>
        </ul>
      </div>
      <div>Current Scope { currentScope } </div>
      <div>Response: { googleResponse } </div>
    </div>
  );
};

export default SheetEditor;
