import { create } from 'zustand'
import produce from "immer";

const initialState = {
    currentScope: 'shapes',
    colors: 0,
    colorsList: null,
    currentColorIndex: null,
    colorsObject: null,
    recolorArray: [],
    showReplaceDialog: false,
    colorsArray: [ 
        "#FF0000", "#FFA07A", "#FA8072", "#8DC4DE", "#7FFF00",  "#00FF7F", "#00FF7F", "#ADD8E6", "#008000", "#228B22", "#008B8B", 
        "#00BFFF", "#0000FF", "#0000CD", "#00008B", "#000080", "#4B0082", "#8A2BE2", "#9400D3","#9932CC", "#8B008B", "#800080",
        "#FF00FF", "#FF1493", "#FF69B4", "#FFB6C1", "#FFC0CB", "#FFDAB9", "#FFE4E1", "#FFEBCD", "#FFF0F5", "#FFF5EE", "#FFF8DC",
        "#FFFACD", "#FAFAD2", "#FFFF00", "#FFFFE0", "#FFFFF0", "#FFFFFF", "#F5F5F5", "#DCDCDC", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080",
        "#696969", "#778899", "#708090", "#2F4F4F", "#000000", "#FFFAFA", "#F0FFF0", "#F5FFFA", "#F0FFFF", "#F0F8FF", "#F8F8FF", "#F5F5DC", "#FFF5EE",
    ],

    shapeColorsListRaw: null,
    slideColorsListRaw: null,
    presentationColorsListRaw: null,
    colorNameType: 'hex', //default
    isRefreshed: false,
    replaceCount: 0, 
    undoData: null,

    hasChanged: false,

    // ** might have issues here in Apps Script without implementing IMMER **
    selection: {
        fontColors: true,
        fillColors: true,
        borderLineColors: true,
        slideMasters: false
    },

}

export const recolorStore = create((set) => ({
    ...initialState,
    // setScope: (payload) => set(() => {

    // }),
    setScope: (payload) => set(produce((state) => {
        state.currentScope = payload
    })),

    increase: () => set(produce((state) => { state.colors += 1 })),
    decrease: () => set(produce((state) => { state.colors -= 1 })),
    reset: () => set((state) => (initialState))
}))