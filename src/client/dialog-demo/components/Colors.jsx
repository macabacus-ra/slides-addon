import React, { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions'; // This is a wrapper for google.script.run that lets us use promises.
import styled from 'styled-components';
import { recolorStore } from '../../store/recolor';
import Draggable from "react-draggable";
import McbsRadio from './icons/McbsRadio';
import McbsCheckbox from './icons/McbsCheckbox';
import { hexToRgb } from '../../utils/colorConvert'

const Colors = () => {
    const mcbsRadioStyle = {  selectedSize: '6px', selectedBorderSize: '3px', selectedBorderColor: '#2cac7c', deselectedSize: '10px', deselectedBorderColor: '#b3b3b3', deselectedBorderSize: '1px', backgroundColor: 'white' }
    const mcbsCheckBoxStyle = { checkboxSize: '10px', checkboxBorderSize: '1px',  checkboxBorderColor: '#2cac7c', uncheckedSize: '8px', uncheckedBorderColor: '#e4e4e4', uncheckedBorderSize: '1px', backgroundColor: 'white' }
    const [{pane1, pane2, pane3}, setPaneWidth] = useState({ pane1: 50, pane2: 100, pane3: 100,  })

    const currentScope = recolorStore((state) => state.currentScope)
    const colorsList = recolorStore((state) => state.colorsList)
    const colorsObject = recolorStore((state) => state.colorsObject)
    const shapeColorsListRaw = recolorStore((state) => state.shapeColorsListRaw)
    const slideColorsListRaw = recolorStore((state) => state.slideColorsListRaw)
    const presentationColorsListRaw = recolorStore((state) => state.presentationColorsListRaw)
    const setList = recolorStore((state) => state.setList)
    const selection = recolorStore((state) => state.selection)
    const colorNameType = recolorStore((state) => state.colorNameType)
    const setShowReplaceDialog = recolorStore((state) => state.setShowReplaceDialog)
    const showReplaceDialog = recolorStore((state) => state.showReplaceDialog)
    // const setColorNameType = recolorStore((state) => state.setColorNameType)
    const setCurrentColorIndex = recolorStore((state) => state.setCurrentColorIndex)
    const removeRecolorSelection = recolorStore((state) => state.removeRecolorSelection)

    const handleReplace = (shapeIndex) => { 
        setShowReplaceDialog()
        setCurrentColorIndex(shapeIndex) 
    }

    const handleUndoReplace = (shapeIndex) => { 
        removeRecolorSelection(shapeIndex) 
    }

    const handleDragFind = (e, ui) => {
        console.log(e)
        setPaneWidth( prevState => ({
            ...prevState,
            pane2: pane2 + ui.deltaX,
        }) )
    }
    const handleDragPane = (e,  ui) => {
        console.log(e)
        setPaneWidth( prevState => ({
            ...prevState,
            pane1: pane1 + ui.deltaX,
        }) )
    }

    // useEffect here is to get a list of unique colors from the scope and selection
    // track selection changes from the scope component and filter the colors list based on the selection
    // colorsList should contain unique colors
    useEffect(() => {        
        // from the "server", the colors belonging to a certain selection are already unique(border colors are unique, shape fill colors are unique). 
        // However, accross the 4 selections (fonts, fills, borders, slide masters), we might have duplicate colors.
        // for example, for "selected shapes", red might exist in the fills, border, and fonts. So we need to filter the colors list based on the selection
        // we could have filtered this in the "server" but upon a user selecting/deselecting a checkbox, we would have had to re call the "server" to get the colors
        // again based on the scope and the combination of the selection checkboxes. This would have been a lot of calls to the "server" and would have been slow to retrieve.
        // so instead, we filter the colors list here in the client. This is a lot faster and more efficient.
        // and the updated take place immediately upon a user selecting/deselecting a checkbox/checkboxes.
        let colors = [] 

        if(colorsObject){
            for (const [key, value] of Object.entries(colorsObject)) {
                if(value.isTable){
                    for(let i = 0; i < value.colors.length; i++){
                        for(let j = 0; j < value.colors[i].length; j++){
                            if(value.colors[i][j].fill && selection.fillColors){ colors.push(value.colors[i][j].fill) }
                            if(value.colors[i][j].border && selection.borderLineColors){ colors.push(value.colors[i][j].border) }
                        }
                    }
                }

                if( value.font && selection.fontColors){ colors.push(value.font) }
                if( value.fill && selection.fillColors ){ colors.push(value.fill) }
                if(value.border && selection.borderLineColors){ colors.push(value.border) }
            }
            // set the colors list to a javascript "SET" of filtered colors matching the selection (checkboxes)
            // create a unique array of color objects. This is the colors list that will be displayed in the colors component
             
            let uniqueColors = Array.from(new Set( colors ))
            let colorsList = []
            //loop through colors setting creating an object with the current color and an empty replace color
            //which will be set by the user when they click on a color box

            uniqueColors.map((color) => { 
                let rgbColor = hexToRgb(color)
                colorsList.push(
                        {
                            currentColor: color, 
                            rgbColor: rgbColor,
                            replace: '',
                            replaceHex: '',
                            replaceRgb: '',
                        }) 
                    }
                )
            
            // finally set the colors list to the Zustand store
            //  we now have an array of objects with the current color and an empty replace color which we will use to map over.
            setList(colorsList)
        }
    }, [ colorsObject, currentScope, selection.fontColors, selection.fillColors, selection.borderLineColors, selection.slideMasters])


    return (
        <RecolorColors>
            <ColorsTitle>Colors</ColorsTitle>
            <ColorsContainer>
                <PaneTop>
                    <PaneCheck width={pane1}>
                        <span > - </span>
                        <Draggable  axis="x" handle="#dragPane" onDrag={handleDragPane} position={{x: 0, y: 0}} defaultPosition={{x: 0, y: 0}} >
                            <DraggableBorder id="dragPane"> </DraggableBorder>
                        </Draggable>
                    </PaneCheck>

                    <PaneFind width={pane2}>
                        <span style={{marginLeft: '5px'}}>Find</span>
                        <Draggable  axis="x"  handle="#dragFind"   onDrag={handleDragFind} position={{x: 0, y: 0}} defaultPosition={{x: 0, y: 0}} >
                            <DraggableBorder id="dragFind"> </DraggableBorder>
                        </Draggable>
                    </PaneFind>

                    <PaneReplace width={pane3}> <span>Replace</span></PaneReplace>
                </PaneTop>

                <List>

                     {/* {   currentScope === 'slides' && slideColorsListRaw ? 
                        ( <div> SlidesRaw:  { JSON.stringify(slideColorsListRaw)} </div> ) 
                        : currentScope === 'shapes' && shapeColorsListRaw ? 
                        ( <div> ShapesRaw:  { JSON.stringify(shapeColorsListRaw) } </div> ) 
                        : currentScope === 'presentation' && presentationColorsListRaw && 
                        ( <div> PresentationRaw:  { JSON.stringify(presentationColorsListRaw) } </div> )
                     } */}
                    { colorsList && colorsList.length > 0 && 
                        ( colorsList.map((color, idx) => {
                                return (
                                    <ListItem  key={idx}>  
                                        {
                                            color.replace ? 
                                            (
                                                <CheckItem onClick={() => handleUndoReplace(idx)} width={pane1}>
                                                    <McbsCheckbox style={mcbsCheckBoxStyle} checked={true}/>
                                                </CheckItem>
                                            )
                                            :
                                            (
                                                <CheckItem onClick={() => handleReplace(idx)} width={pane1}>
                                                    <McbsCheckbox style={mcbsCheckBoxStyle} checked={false}/>
                                                </CheckItem>
                                            )
                                        }
                                    
                                    <FindItem width={pane2}>
                                        <ColorBox color={color.currentColor}></ColorBox>
                                        { colorNameType === 'hex' ? color.currentColor : color.rgbColor }
                                    </FindItem>
                                    <ReplaceItem onClick={() => handleReplace(idx)} width={pane3}>
                                        {
                                            color.replace ? (
                                                <ReplaceWrap>
                                                    <ColorBox color={color.replace}></ColorBox>
                                                    <ChooseColorNone>
                                                        { colorNameType === 'hex' ? color.replaceHex : color.replaceRgb }
                                                    
                                                    </ChooseColorNone>
                                                </ReplaceWrap>
                                            )
                                            :
                                            (
                                                <ChooseColorNone>Choose Color</ChooseColorNone>
                                            )
                                        }
                                    </ReplaceItem>
                                    </ListItem>
                                )






                            })
                        )
                    }
                </List>
            </ColorsContainer>  
        </RecolorColors>
    )
}


export default Colors




const RecolorColors = styled.div`
    display: flex;
    margin-top: 20px;
    flex-direction: column;
    width: 100% - fit-content;
    border: 1px solid var(--recolorLineColor);
    border-radius: 5px;
    height: 30%;
    padding: 15px;
    position: relative;
    box-shadow: 0.5px 0.5px 2px 1px rgb(255, 255, 255);
`
const ColorsTitle = styled.div`
    width: fit-content;
    padding: 2px;
    background-color: var(--recolorBackgrondColor);
    position: absolute;
    top: -13px;
    color: var(--recolorHeadingColor);
    font-weight: bold;
    font-size: 13px;
`

const ColorsContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 300px;
    width: 100%;
    border: 1px solid rgb(199, 199, 199);
    border-radius: 1px;
`   

const PaneTop = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    align-items: center;
`
const PaneCheck = styled.div`
    width: ${props => props.width}px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
    &:hover{ background-color: white; }
    span{ visibility: hidden; }
`
const PaneFind = styled.div`
    border-left: 1px solid rgb(199, 199, 199);
    text-align: left;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: ${props => props.width}px;
    border-right: 1px solid rgb(199, 199, 199);
    position: relative;
    &:hover{ background-color: white; }
`

const DraggableBorder = styled.div`
    height: 100%;
    // this is wider so that it is easier to grab, but transparent for better look
    border-right: 15px solid rgba(199, 199, 199, 0);
    position: absolute;
    right: -6px;
    cursor: ew-resize;
`

const PaneReplace = styled.div`
    text-align: left;
    width: ${props => props.width}px;
    padding: 2px 5px;
    &:hover{ background-color: white; }
`

const List = styled.div`
    overflow-y: scroll;
    background-color: white;
    height: 100%;
    border-radius: 0px 0px 5px 5px;
    border-top: 1px solid rgb(199, 199, 199);
`

const ListItem = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding-top: 2.5px;
    padding-bottom: 2.5px;
    justify-content: flex-start;
    cursor: default;
    &:hover{ background-color: #f2f2f2; }
`

const CheckItem = styled.div`
    width: ${props => props.width}px; //Important - this is the width of the pane, which can be resizes by user
    display: flex;
    /* overflow-x: hidden; */
    flex-direction: row;
    height: fit-content;
    justify-self: center;
    align-self: center;
    align-items: center;
    justify-content: flex-start;
    margin-left: 10px;
`

const FindItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: ${props => props.width}px;
    font-size: 13px;
    overflow-x: hidden;
    color: var(--recolorFontColor);
    &:hover{ background-color: none; }
    margin-left: -5px;
`
const ReplaceItem = styled.div`
    width: ${props => props.width}px; 
`

const ColorBox = styled.div`
    min-width: 25px;
    height: 12px;
    width: 25px;
    background-color: ${props => props.color};
    margin-right: 5px;
    border: 1px solid rgba(199, 199, 199, 0.486);
`

const ChooseColorNone = styled.div`
    text-decoration: underline;
    color: var(--recolorChooseColor);
    cursor: pointer;
`

const ReplaceWrap = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const RecolorBottomActions = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
`

const ColorTypeBtnWrap = styled.div`
    display: flex;
    flex-direction: row;
    span{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
`

const RefreshButton = styled.button`
    padding: 8px 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid var(--recolorLineColor);
    color: var(--recolorBtnFont);
    border-radius: 4px;
    background-color: #fcfcfc;
`