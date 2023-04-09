import React, { useState, useEffect } from "react";
import styled from 'styled-components'
import ReplaceDialogColorBoxItem from './ReplaceDialogColorBoxItem';
import { recolorStore } from "../../store/recolor";

const ReplaceDialogColorBox = () => {

    const colorsArray = recolorStore((state) => state.colorsArray)
    const arrayOfDivs =  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55]

  return (
        <ColorBox2>
            {arrayOfDivs.map((div, index) => {
                let colorsArrayIndex, tooltip, color;

                if(index > colorsArray.length - 1) {
                    colorsArrayIndex = null
                    tooltip = '#ffffff'
                    color = '#ffffff'
                }else{
                    colorsArrayIndex = index;
                    tooltip = colorsArray[colorsArrayIndex]
                    color = colorsArray[colorsArrayIndex]
                }

                return (
                    // separate component for this

                    <ReplaceDialogColorBoxItem 
                        index={index}
                        val={div}
                        backgroundColor={color}
                        />
                )
            })}
        </ColorBox2> 
  )
}

export default ReplaceDialogColorBox

const ColorBox2 = styled.div`
    margin-top: 10px;
    display: grid;
    grid-gap: .3rem;
    border: 1px solid rgba(199, 199, 199, 0.486);
    grid-template-columns: repeat(8, 1fr);
    padding: 3px;
    
`

