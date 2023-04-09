import React, { useState, useEffect } from "react";
import styled from 'styled-components'
import { hexToRgb } from '../../utils/colorConvert'
import { recolorStore } from '../../store/recolor';

const ReplaceDialogColorBoxItem = ({index, backgroundColor }) => {

    const rgbColor = hexToRgb(backgroundColor)
    const colorBoxItemRefIndex = index
    const [showTooltip, setShowTooltip] = useState(false)

    const currentColorIndex = recolorStore((state) => state.currentColorIndex)
    const setShowReplaceDialog = recolorStore((state) => state.setShowReplaceDialog)
    const updateColorsList = recolorStore((state) => state.updateColorsList)

    const handleItemClick = () => { 
        updateColorsList( 
            {
                index: currentColorIndex,
                replaceHex: backgroundColor, //hexColor,
                replaceRgb: rgbColor,
            } 
        ) 
        setShowReplaceDialog() 
    }

  return (
        <ItemContainer 
            onClick={ handleItemClick }
            bgColor={backgroundColor} 
            onMouseOver={() => setShowTooltip(true)}
            onMouseOut={() => setShowTooltip(false)}
            >
            {showTooltip && (
                    <Tooltip> 
                        <span>{backgroundColor.toUpperCase()}</span>
                        <span>{`RGB(${rgbColor.toUpperCase()}) `}</span>
                    </Tooltip>
            )} 
        </ItemContainer> 
  )
}

export default ReplaceDialogColorBoxItem

const ItemContainer = styled.div`
    position: relative;
    width: 17px;
    height: 17px;
    background-color: ${props => props.bgColor ? props.bgColor : 'white'};
    border: 1px solid rgba(199, 199, 199, 0.486);
    cursor: pointer;
    
`
const Tooltip = styled.div`
    z-index: 10;
    font-size: 12px;
    background-color: #262626dc;
    color: white;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 5px;
    top: 20px;
    right: 10px;
    position: absolute;
    transition: .85s all ease;
    /* transition-delay: .9s; */
    
`