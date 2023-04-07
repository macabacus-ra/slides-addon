import * as React from 'react'
import styled from 'styled-components'

const McbsRadio = ({ selected, style }) => {
    return (
        <>
            { selected ?
                (
                    <SelectedRadioStyle styleProps={style} ></SelectedRadioStyle>
                )
                :
                (
                    <DeselectedRadioStyle styleProps={style} ></DeselectedRadioStyle>
                )
            }
        </>
    )
}
export default McbsRadio

const SelectedRadioStyle = styled.div`
    width: ${(props) => props.styleProps.selectedSize};
    height: ${(props) => props.styleProps.selectedSize};
    border-radius: 50%;
    background-color: ${(props) => props.styleProps.backgroundColor};
    border: ${(props) => props.styleProps.selectedBorderSize} solid ${props => props.styleProps.selectedBorderColor}; 
    box-shadow: 0px 0px 1px 2px #2cac7de9; 
`

const DeselectedRadioStyle = styled.div`
    width: ${(props) => props.styleProps.deselectedSize};
    height: ${(props) => props.styleProps.deselectedSize};
    border-radius: 50%;
    background-color: ${(props) => props.styleProps.backgroundColor};
    border: 1px solid ${(props) => props.styleProps.deselectedBorderColor};
    box-shadow: 0px 0px 2px 1px rgb(150, 150, 150);
`