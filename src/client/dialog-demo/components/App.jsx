import React, { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';
// This is a wrapper for google.script.run that lets us use promises.
import styled from 'styled-components';
import Scope from './Scope';
import Colors from './Colors';
import { recolorStore } from '../../store/recolor';
import ReplaceDialog from './ReplaceDialog';

const App = () => {
  const [names, setNames] = useState([]);
  const colorsList = recolorStore((state) => state.colorsList)
  const replaceCount = recolorStore((state) => state.replaceCount)
  const showReplaceDialog = recolorStore((state) => state.showReplaceDialog)
  const currentScope = recolorStore((state) => state.currentScope)
  const selection = recolorStore((state) => state.selection)
  const colorsObject = recolorStore((state) => state.colorsObject)
  const shapeIdsObj = recolorStore((state) => state.shapeIdsObj)
  const setColors = recolorStore((state) => state.setColors)
  const setDataSent = recolorStore((state) => state.setDataSent)
  const dataSent = recolorStore((state) => state.dataSent)
  const shapeColorsListRaw = recolorStore((state) => state.shapeColorsListRaw)
  const slideColorsListRaw = recolorStore((state) => state.slideColorsListRaw)
  const presentationColorsListRaw = recolorStore((state) => state.presentationColorsListRaw)
  const isLoading = recolorStore((state) => state.isLoading)
  const setIsLoading = recolorStore((state) => state.setIsLoading)
  const isRecoloring = recolorStore((state) => state.isRecoloring)
  const setIsRecoloring = recolorStore((state) => state.setIsRecoloring)

  const [googleResponse, setGoogleResponse] = useState('nothing yet')
  
  const setScope = recolorStore((state) => state.setScope)

  const handleGetColors = async () => {
    // setScope(value)
    setIsLoading(true)

    const response = await serverFunctions.loadColors(currentScope);

    if(response){ 
      setGoogleResponse( JSON.stringify(response)) 
      setColors(
        {
          colorsData: response.shapeIdsAndElementsObject,
          scopeData: currentScope,
        }
      )
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    console.log('cancel')
  }
  const handleSubmit = async () => {
    // filter the colorslist to only include colors that have a replace color
    let replaceArray = colorsList.filter((item) => item.replace ) 

    



    let obj = {
      replaceArray: replaceArray,
      scope: currentScope,
      selection: selection,
      objectIds: colorsObject
    }

    setDataSent(JSON.stringify(obj))

    const response = await serverFunctions.recolor2( obj );

    setGoogleResponse(obj)

    

    if(response){ 
      setGoogleResponse( JSON.stringify(response)) 
      setColors(
        {
          colorsData: response.shapeIdsAndElementsObject,
          scopeData: currentScope,
        }
      )
    }

  }


  useEffect(() => {
    if(currentScope === 'shapes' && shapeColorsListRaw ){
        setColors(
          {
            colorsData: shapeColorsListRaw,
            scopeData: currentScope
          }
        )
      }else if(currentScope === 'slides' && slideColorsListRaw ){
        setColors(
          {
            colorsData: slideColorsListRaw,
            scopeData: currentScope
          }
        )
      }else if(currentScope === 'presentation' && presentationColorsListRaw ){
        setColors(
          {
            colorsData: presentationColorsListRaw,
            scopeData: currentScope
          }
        )
      }else {

        // get colors from google
        handleGetColors(currentScope)

      }

}, [currentScope])




  return (
    <RecolorContainer>
      <Scope  />
      <Colors  /> 
      <RecolorBtns>

          { replaceCount > 0 ?
            <RecolorBtn style={{marginRight: '10px'}} onClick={handleSubmit}>Replace</RecolorBtn>
            :
            <RecolorDisabled style={{marginRight: '10px'}}>Recolor</RecolorDisabled>
          }              
          <RecolorBtn onClick={handleCancel}>Close</RecolorBtn>

      </RecolorBtns>
      {  showReplaceDialog && <ReplaceDialog /> }

      {/* below is for testing */}
      {/* <div style={{display: 'flex', flexDirection: 'column'}}>
        <span> Load { googleResponse ? googleResponse : 'nothing' } </span>
        <span style={{marginTop: '10px'}}> { dataSent } </span>
      </div> */}
      

    </RecolorContainer>
  );
};
export default App;


const RecolorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100% - fit-content;
`
const RecolorBtns = styled.div`
  display: flex;
  margin-top: 20px;
  flex-direction: row;
  width: 100%;
  font-size: 13px;
  font-family: 'Arial', 'Helvetica',  sans-serif;
  color: #636363;
  justify-content: flex-end;
`

const RecolorBtn = styled.button`
    padding: 5px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid var(--recolorLineColor);
    color: #636363;
    border-radius: 4px;
    background-color: #fcfcfc;
` 
const RecolorDisabled = styled.div`
    padding: 5px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid var(--recolorLineColor);
    color: #bebebe;
    border-radius: 4px;
    background-color: #fcfcfc;
    pointer-events: none;
` 

