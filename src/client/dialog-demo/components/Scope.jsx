
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import McbsRadio from './icons/McbsRadio';
import McbsCheckbox from './icons/McbsCheckbox';
import { recolorStore } from '../../store/recolor';
import { serverFunctions } from '../../utils/serverFunctions';

const Scope = () => {
    const mcbsRadioStyle = { selectedSize: '6px', selectedBorderSize: '3px', selectedBorderColor: '#2cac7c', deselectedSize: '10px', deselectedBorderColor: 'rgba(220, 220, 220, 0.349)', deselectedBorderSize: '1px', backgroundColor: 'white' }
    const mcbsCheckBoxStyle = {  checkboxSize: '9px', checkboxBorderSize: '1px', checkboxBorderColor: '#2cac7c', uncheckedSize: '9px', uncheckedBorderColor: '#d3d3d3', uncheckedBorderSize: '1px',  backgroundColor: 'white' }
    const currentScope = recolorStore((state) => state.currentScope)
    const setScope = recolorStore((state) => state.setScope)
    const resetCount = recolorStore((state) => state.resetCount)
    const setSelection = recolorStore((state) => state.setSelection)
    const selection = recolorStore((state) => state.selection)
    const colorsObject = recolorStore((state) => state.colorsObject)
    const setSlideMastersResponse = recolorStore((state) => state.setSlideMastersResponse)
    const slideMastersResponse = recolorStore((state) => state.slideMastersResponse)
    const setColors = recolorStore((state) => state.setColors)
    const addSlideMasters = recolorStore((state) => state.addSlideMasters)
    const colorsPlusSlideMasterRaw = recolorStore((state) => state.colorsPlusSlideMasters)

    function handleScope(value) { // radio buttons

        if(selection.slideMasters){
            ///
            // remove slidemasters
            setSelection('slideMasters')
            ///
        }

        if(currentScope !== value){
            setScope(value)
            resetCount()            
        }
    }

    function handleColorSelection(value) { // checkboxes
        setSelection(value)
        resetCount()
    }

    const handleSlideMasters = async () => {


        // the idea behind the getting of the slidemaster colors
        // is that they will never be loaded initally, only until user checks
        // this is to avoid any performance slow down. 

        // So in order for this to load , we should make sure the current scope is 
        // presentation, and if not, set it to presentation.

        if(!selection.slideMasters){

            if(currentScope !== 'presentation'){
                setScope('presentation')
            }
    
            resetCount()
            // call a new function to get the slide masters
            // on the server side, get the slide masters and get the colors with their shape ids.
            // on the client side, filter these colors for uniqueness and add them to the colors list.
            setSelection('slideMasters')
    
            if(!colorsPlusSlideMasterRaw){
                const response = await serverFunctions.loadSlideMasterColors( colorsObject ) ;
    
                if(response){
    
                    setSlideMastersResponse( JSON.stringify(response) )
    
                    addSlideMasters(
                        {
                            colorsData: response.colorsObject,
                        }
                    )
    
                }else{
                    setSlideMastersResponse( 'No response from server' )
                }
            }else{
                addSlideMasters({ colorsData: colorsPlusSlideMasterRaw })
            }

        }else{
            setSelection('slideMasters')
        }

    }

    return (
        <RecolorScope>
            <ScopeTitle>Scope:</ScopeTitle>
            <ScopeOptions>
                <LayoutRadioAndSelection>
                    <RadioBtns  >
                        <InputItem onClick={() => handleScope('shapes')}>
                            <McbsRadio 
                                selected={currentScope === 'shapes'}  
                                style={mcbsRadioStyle} 
                                /> 
                            <label>Selected shapes{'(s)'}</label>
                        </InputItem>
                        <InputItem onClick={() => handleScope('slides')} >
                            <McbsRadio 
                                selected={currentScope === 'slides'} 
                                style={mcbsRadioStyle} 
                                /> 
                            <label >Selected slides{'(s)'}</label>
                        </InputItem>
                        <InputItem onClick={() => handleScope('presentation')}>
                            <McbsRadio 
                                selected={currentScope === 'presentation'} 
                                style={mcbsRadioStyle} 
                                /> 
                            <label htmlFor='presentation'>Presentation</label>
                        </InputItem>
                    </RadioBtns>
                    <SelectionBtns >
                        <InputItem  onClick={() => handleColorSelection('fontColors')} > 
                            <McbsCheckbox checked={selection.fontColors} style={mcbsCheckBoxStyle} />
                            <label  htmlFor='fontColors'>  Font Colors  </label>
                        </InputItem>
                        <InputItem onClick={() => handleColorSelection('fillColors')}>
                            <McbsCheckbox checked={selection.fillColors} style={mcbsCheckBoxStyle} />
                            <label  htmlFor='fillColors'>Fill Colors  </label>
                        </InputItem>
                        <InputItem  onClick={() => handleColorSelection('borderLineColors')}>  
                            <McbsCheckbox checked={selection.borderLineColors} style={mcbsCheckBoxStyle} />
                            <label  htmlFor='borderLineColors'> Border / Line Colors </label>
                        </InputItem>
                    </SelectionBtns>
                </LayoutRadioAndSelection>
                <IncludeSlideMasters onClick={handleSlideMasters}>
                    <McbsCheckbox checked={selection.slideMasters} style={mcbsCheckBoxStyle} />
                    <label htmlFor='slideMasters'>Include Slide Master layouts</label>
                </IncludeSlideMasters>
            </ScopeOptions>
        </RecolorScope>
    )

}

export default Scope

const RecolorScope = styled.div`
    border: 1px solid var(--recolorLineColor);
    border-radius: 5px;
    width: 100% - fit-content;
    padding: 0px 10px; 
    padding-bottom: 10px;
    position: relative;
    box-shadow: 0.5px 0.5px 2px 1px rgb(255, 255, 255);
`
const ScopeTitle = styled.div`
    width: fit-content;
    padding: 2px;
    background-color: var(--recolorBackgrondColor);
    position: absolute;
    top: -13px;
    color: var(--recolorHeadingColor);
    font-weight: bold;
    font-size: 13px;
`

const LayoutRadioAndSelection = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`   

const RadioBtns = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
`

const SelectionBtns = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
`   

const InputItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 8px;
    align-items: center;
    font-size: 13px;
    label{
        margin-left: 5px;
    }
`

const IncludeSlideMasters = styled.div`
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 13px;
    label{
        margin-left: 5px;
    }
`

const ScopeOptions = styled.div`
    color: #6d6d6d;
    display: flex;
    flex-direction: column;
    margin-left: 5px;
`