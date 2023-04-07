
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import McbsRadio from './icons/McbsRadio';
import McbsCheckbox from './icons/McbsCheckbox';
import { recolorStore } from '../../store/recolor';

const Scope = () => {
    const mcbsRadioStyle = { selectedSize: '6px', selectedBorderSize: '3px', selectedBorderColor: '#2cac7c', deselectedSize: '10px', deselectedBorderColor: 'rgba(220, 220, 220, 0.349)', deselectedBorderSize: '1px', backgroundColor: 'white' }
    const mcbsCheckBoxStyle = {  checkboxSize: '9px', checkboxBorderSize: '1px', checkboxBorderColor: '#2cac7c', uncheckedSize: '9px', uncheckedBorderColor: '#d3d3d3', uncheckedBorderSize: '1px',  backgroundColor: 'white' }
    const currentScope = recolorStore((state) => state.currentScope)
    const setScope = recolorStore((state) => state.setScope)
    const resetCount = recolorStore((state) => state.resetCount)
    const setSelection = recolorStore((state) => state.setSelection)
    const selection = recolorStore((state) => state.selection)

    function handleScope(value) { // radio buttons
        if(currentScope !== value){
            setScope(value)
            resetCount()            
        }
    }

    function handleColorSelection(value) { // checkboxes
        setSelection(value)
        resetCount()
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
                <IncludeSlideMasters onClick={() => handleColorSelection('slideMasters')}>
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