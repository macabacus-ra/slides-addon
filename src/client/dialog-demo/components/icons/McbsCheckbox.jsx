import * as React from 'react'
import styled from 'styled-components'


const McbsCheckbox = ({ checked, style }) => {
    return (
        <>
            { checked ?
                (
                    <CheckedBox styleProps={style} >
                        <CheckMark></CheckMark>
                    </CheckedBox>
                )
                :
                (
                    <UncheckedBox styleProps={style} >

                    </UncheckedBox>
                )
            }
        </>
    )
}
export default McbsCheckbox

const BoxContainer = styled.div`
    min-width: fit-content;
    overflow-x: hidden;
`

const CheckedBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 1px;
    width: ${(props) => props.styleProps.checkboxSize};
    min-width: ${(props) => props.styleProps.checkboxSize};
    height: ${(props) => props.styleProps.checkboxSize};
    border-radius: 3px;
    background-color: ${(props) => props.styleProps.checkboxBorderColor};
    border: ${(props) => props.styleProps.checkboxBorderSize} solid ${props => props.styleProps.checkboxBorderColor}; 
`

const UncheckedBox = styled.div`
    padding: 1px;
    width: ${(props) => props.styleProps.uncheckedSize};
    min-width: ${(props) => props.styleProps.uncheckedSize};
    height: ${(props) => props.styleProps.uncheckedSize};
    border-radius: 3px;
    
    background-color: ${(props) => props.styleProps.backgroundColor};
    border: 1px solid ${(props) => props.styleProps.uncheckedBorderColor};
    box-shadow: 0px 0px 2px 1px rgb(177, 177, 177);
`

const CheckMark = styled.div`
    left: 0px;
    top: 1px;
    margin-bottom: 2px;
    width: 3px;
    height: 6px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);

`