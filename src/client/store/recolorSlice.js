import { createSlice } from '@reduxjs/toolkit'











//*********************************** */

// redux and redux toolkit are not working in Apps Script

// Using Zustand instead for global state management. ==> './recolor.js'

//*********************************** */













const initialState = {
    // when scope changes, colorsList should be updated with unique available colors.    
    colorsList: null,
    currentColorIndex: null,
    // this is the object that is returned from the getColors function
    colorsObject: null,

    // array of objects with the checked colors in dialog box that is used to recolor the shapes
    recolorArray: [],
    showReplaceDialog: false,

    // array with hex values of the colors in the scope selection
    // this is hardcoded for now, but we should be able to get this from the color palette picker in the future
    colorsArray: [ 
        "#FF0000", "#FFA07A", "#FA8072", "#8DC4DE", "#7FFF00",  "#00FF7F", "#00FF7F", "#ADD8E6", "#008000", "#228B22", "#008B8B", 
        "#00BFFF", "#0000FF", "#0000CD", "#00008B", "#000080", "#4B0082", "#8A2BE2", "#9400D3","#9932CC", "#8B008B", "#800080",
        "#FF00FF", "#FF1493", "#FF69B4", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFE4E1", "#FFEBCD", "#FFF0F5", "#FFF5EE", "#FFF8DC",
        "#FFFACD", "#FAFAD2", "#FFFF00", "#FFFFE0", "#FFFFF0", "#FFFFFF", "#F5F5F5", "#DCDCDC", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080",
        "#696969", "#778899", "#708090", "#2F4F4F", "#000000", "#FFFAFA", "#F0FFF0", "#F5FFFA", "#F0FFFF", "#F0F8FF", "#F8F8FF", "#F5F5DC", "#FFF5EE",
    ],

    // when a user goes through the changes in scope selection, it gets slower and slower
    // for optimizing the changes in scope selection, we will keep a list of the colors that are in the scope selection
    // as long as they don't change, we should  not have to call the Office API to get the colors again
    shapeColorsListRaw: null,
    slideColorsListRaw: null,
    presentationColorsListRaw: null,
    colorNameType: 'hex', //default
    isRefreshed: false,
    replaceCount: 0, 
    undoData: null,


    // from shapes, slides, and presentation scope, only one can be true at a time: scopeOption
    currentScope: 'shapes', // <== current default. Can be 'shapes', 'slides', 'presentation'

    selection: {
        fontColors: true,
        fillColors: true,
        borderLineColors: true,
        slideMasters: false
    },
    
    isColorsChanged: false, // <== when true, the colorsList should be updated with available colors.
    includeSlideMaster: false,

}

export const recolorSlice = createSlice({
    name: 'recolor',
    initialState,
    reducers: {
        setList(state, action) {
            state.colorsList = action.payload
        }, 
        setColors(state, action) {
            state.colorsObject = action.payload.colorsData
            if(!state.shapeColorsListRaw && action.payload.scopeData === 'shapes') {
                state.shapeColorsListRaw = action.payload.colorsData

            } else if(!state.slideColorsListRaw && action.payload.scopeData === 'slides') {
                state.slideColorsListRaw = action.payload.colorsData

            } else if(!state.presentationColorsListRaw && action.payload.scopeData === 'presentation') {
                state.presentationColorsListRaw = action.payload.colorsData
            }   
        },
        resetColors(state) {
            state = initialState
        },
        updateColorsList(state, action) { 
            // adds a color to be replaced
            // this occurs when the user clicks the checkbox or link, and selects a color. 
            // the "COLORS LIST" ARRAY is POPULATED in the Colors.tsx useEffect, every time loadColors is called.
            state.colorsList[action.payload.index].replace = action.payload.replaceHex
            state.colorsList[action.payload.index].replaceHex = action.payload.replaceHex
            state.colorsList[action.payload.index].replaceRgb = action.payload.replaceRgb
            state.replaceCount += 1
        },
        removeRecolorSelection(state, action) {
            // removes a color after it has been selected to be recolored
            // this occurs when the user clicks the checkbox again
            // opposie of updateColorsList
            state.colorsList[action.payload].replace = ''
            state.colorsList[action.payload].replaceHex = ''
            state.colorsList[action.payload].replaceRgb = ''
            state.replaceCount -= 1
        },
        resetRecolorArray(state, action) {
            // here I need to pass the index to update the proper index in the array
            // instead of updating the entire array, we are only updating the given index
            console.log('sdfasdf')
            // we are still not recoloring, only setting things up to be ready to recolor
            // after this function runs we should see the checkbox checked and the color in the list replace tab
        },
        setShowReplaceDialog(state, action) {
            state.showReplaceDialog = !state.showReplaceDialog
            state.currentColorIndex = action.payload
        },
        setCurrentColorIndex(state, action) {
            state.currentColorIndex = action.payload
        },
        resetRawColorLists(state, action) {
            // this is called when the user submits the recoloring (clicks the recolor button)
            // this resets the raw color lists for a particular selection so that it updates with the new
            // available colors, otherwise it will not update since the rawColorsLists are not null
            state.replaceCount = 0

            if(action.payload === 'shapes') {
                state.shapeColorsListRaw = null
            }else if(action.payload === 'slides') {
                state.slideColorsListRaw = null
            }else if(action.payload === 'presentation') {
                state.presentationColorsListRaw = null
            }
        },
        setColorNameType(state, action) {
            // sets the color name type to rgb or hex
            state.colorNameType = action.payload
        },
        createUndoReady(state, action) {
            state.undoData = action.payload
        },
        resetCount(state) { state.replaceCount = 0 },
        setScope(state, action) { // radio buttons

            state.currentScope = action.payload
        },
        setSelection(state, action) { // checkboxes

            state.selection = {
                ...state.selection,
                [action.payload]: !state.selection[action.payload],
            }
        }
    }
  })
  
export const { 
        setList,
        setColors,  
        resetColors, 
        updateColorsList, 
        resetRecolorArray, 
        setShowReplaceDialog,
        removeRecolorSelection,
        resetRawColorLists,
        setColorNameType,
        createUndoReady,
        setSelection,
        resetCount,
        setScope, 
    } = recolor.actions

export default recolor.reducer