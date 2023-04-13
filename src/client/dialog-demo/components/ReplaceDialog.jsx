
import React , { useState, useEffect } from "react";
import styled from 'styled-components'
import Draggable from "react-draggable";
import { recolorStore } from '../../store/recolor';
import ReplaceDialogColorBox from "./ReplaceDialogColorBox";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
// import Logo from './icons/logo.jpg'

const ReplaceDialog = () => {

    const setShowReplaceDialog = recolorStore((state) => state.setShowReplaceDialog)
    const showReplaceDialog = recolorStore((state) => state.showReplaceDialog)
    const colorsList = recolorStore((state) => state.colorsList)
    const replaceCount = recolorStore((state) => state.replaceCount)
    const currentColorIndex = recolorStore((state) => state.currentColorIndex)

  return (
    <Draggable
        handle="#drag"
        defaultPosition={{x: 0, y: 0}}
        position={null}
        >
        <ReplaceDialogBackDrop>
            <DialogContainer>
                <DragTop id="drag">
                    <DTLeft>
                        {/* <img alt='logo' src={require(Logo)}/>  */}
                        <span style={{marginLeft: '7px'}}>Replace Color</span>
                    </DTLeft>
                    <DTRight onClick={() => setShowReplaceDialog()}> < CloseOutlinedIcon /> </DTRight>
                </DragTop>

                <ReplaceDialogColorBox /> 

                <CTP>Customize this palette</CTP>

                {/* <ul>
                    <li>Replace {replaceCount} colors</li>
                    <li>current color index {currentColorIndex}</li>
                    <li>colorsList {colorsList.length}</li>
                    <li>update colors list { updateColorsList.length }</li>
                </ul> */}
                    
            </DialogContainer>
        </ReplaceDialogBackDrop>
    </Draggable>
  )
}

export default ReplaceDialog

const ReplaceDialogBackDrop = styled.div`
    position: fixed; 
    z-index: 1; 
    padding-top: 100px; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgba(0, 0, 0, 0); 
`

const DialogContainer = styled.div`
    background-color: #f9f9f9;
    margin: auto;
    border: 1px solid #c5c5c5;
    width: 220px;
    height: 300px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start
`

const DragTop = styled.div`
    background-color: white;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
    border-radius: 10px 10px 0 0;
    align-items: center;
    padding: 0;
    cursor: move;
`

const DTLeft = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: grey;
    margin-left: 10px;
    img{
        width: 20px;
        height: 20px;
        border-radius: 4px;
    }
`
const DTRight = styled.div`
    width: 40px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0px 10px 0px 0px;
    cursor: pointer;

    .iconClose{
        color: grey;
        font-size: 20px;
    }
    .iconClose:hover{
        color: white;
    }

    &:hover{
        color: white;
        background-color: #b92828;
        .iconClose{
            color: white;
        }
    }
`

const CTP = styled.span`
    text-decoration: underline;
    color: #0078d4;
    cursor: pointer;
    justify-self: flex-start;
    align-self: flex-start;
    margin-left: 15px;
    margin-top: 5px;
    font-size: small;
`