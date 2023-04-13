export const loadColors = async (scope) => {
    const startTime = Date.now(); // for testing performance
    let presentation = SlidesApp.getActivePresentation()
    let shapeIdsAndElementsObject = {}
    if (scope === 'shapes') {
        let selections = presentation.getSelection()
        let pageElementRange = selections.getPageElementRange()
        if(!pageElementRange){ 
            return {
                Time: Date.now() - startTime,
                shapeIdsAndElementsObject: {}
            }
        }else{
            let shapes = pageElementRange.getPageElements()
            //if(shapes.length === 0){ return } ; // if there are no shapes on the slide, skip it
            getColors(shapes, shapeIdsAndElementsObject);
        }
    } else if (scope === 'slides') {
        let pageRange = presentation.getSelection().getPageElementRange()

        if(!pageRange){
            let slide = presentation.getSelection().getCurrentPage() // select the first slide if no slide is selected, otherwise fails
            
            let shapes = slide.getPageElements()
            if(shapes.length < 1){ 
                return {
                    Time: Date.now() - startTime,
                    shapeIdsAndElementsObject: {}
                }
            }else{ getColors(shapes, shapeIdsAndElementsObject); }
        }else{
            // bug here we can not get the pages that are individually selected 
            return {
                Time: Date.now() - startTime,
                shapeIdsAndElementsObject: {}
            }
        }
    } else if (scope === 'presentation') {
        let slides = presentation.getSlides()
        let slidesCount = slides.length
        for (let i = 0; i < slidesCount; i++) {
            let shapes = slides[i].getPageElements()
            if(shapes.length === 0){ continue } ; // if there are no shapes on the slide, skip it 
            getColors(shapes, shapeIdsAndElementsObject);
        }
    }
    return {
        Time: Date.now() - startTime,
        shapeIdsAndElementsObject: shapeIdsAndElementsObject
    }
};


const getColors = async (shapes, shapeIdsAndElementsObject) => {
    // we to store all colors that are present in each shape, font and border... This is so that, when user
    // selects colors to replace in a presentation scope, we no longer have to loop through every slide, only 
    // the shapes that have the selected colors.
    let shapesCount = shapes.length
    let colorScheme = shapes[0].getParentPage().getColorScheme() // don't need this on every loop, just once since it wont change
  
    for (let k = 0; k < shapesCount; k++) {
        let currentShape;
        if (shapes[k].getPageElementType() != "IMAGE") {   //make sure shape is not an image type
            
            let shapeFillColor, shapeFontColor, shapeOutlineColor;
            let isTable = false;

            if(shapes[k].getPageElementType() == "SHAPE"){ 
                currentShape = shapes[k].asShape()  

                let shapeId = currentShape.getObjectId()
                
                if(currentShape.getFill().getSolidFill() !== null) {
                    // if it has a fill, we need to check if it is a theme color or not! Very important!
                    let gotColor =  currentShape.getFill().getSolidFill().getColor()
                    let colorType = gotColor.getColorType()

                    if(colorType == 'THEME'){
                        let THEMECOLOR = gotColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                        shapeFillColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()

                        // add shapIdsArray if it doesn't exist
                        if(!shapeIdsAndElementsObject[shapeId]){
                            shapeIdsAndElementsObject[shapeId] = {
                                fill: shapeFillColor
                            }
                        }else{
                            shapeIdsAndElementsObject[shapeId].fill = shapeFillColor
                        }

                    }else if(colorType == 'RGB'){
                        shapeFillColor = gotColor.asRgbColor().asHexString()
                        // add shapIdsArray if it doesn't exist
                        if(!shapeIdsAndElementsObject[shapeId]){
                            shapeIdsAndElementsObject[shapeId] = {
                                fill: shapeFillColor,
                                font: null,
                                border: null,
                                isTable: isTable
                            }
                        }else{
                            shapeIdsAndElementsObject[shapeId].fill = shapeFillColor
                        }
                    }
                }

                let shapeText = currentShape.getText()
                if(shapeText !== null){
                    let text = shapeText.asRenderedString()
                    let str = text.replace(/\s+/g, '');
                    if(str.length > 0){ 
                        let gotForegroundColor = shapeText.getTextStyle().getForegroundColor()
                        if(gotForegroundColor !== null) {
                            let fontColorType = gotForegroundColor.getColorType()
                            if(fontColorType == 'THEME'){
                                let THEMECOLOR = gotForegroundColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                                shapeFontColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()
                                
                                if(!shapeIdsAndElementsObject[shapeId]){
                                    shapeIdsAndElementsObject[shapeId] = {
                                        fill: null,
                                        font: shapeFontColor,
                                        border: null,
                                        isTable: isTable
                                    }
                                }else{
                                    shapeIdsAndElementsObject[shapeId].font = shapeFontColor
                                }

                            }else if(fontColorType == 'RGB'){
                                shapeFontColor = gotForegroundColor.asRgbColor().asHexString()

                                if(!shapeIdsAndElementsObject[shapeId]){
                                    shapeIdsAndElementsObject[shapeId] = {
                                        fill: null,
                                        font: shapeFontColor,
                                        border: null,
                                        isTable: isTable
                                    }
                                }else{
                                    shapeIdsAndElementsObject[shapeId].font = shapeFontColor
                                }
                            }
                        }
                    }
                }

                if(currentShape.getBorder().getLineFill().getSolidFill() !== null) {

                    let gotColor = currentShape.getBorder().getLineFill().getSolidFill().getColor()
                    let borderColorType = gotColor.getColorType()

                    if(borderColorType == 'THEME'){
                        let THEMECOLOR = gotColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                        shapeOutlineColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()
                        
                        if(!shapeIdsAndElementsObject[shapeId]){
                            shapeIdsAndElementsObject[shapeId] = {
                                fill: null,
                                font: null,
                                border: shapeOutlineColor,
                                isTable: isTable
                            }
                        }else{
                            shapeIdsAndElementsObject[shapeId].border = shapeOutlineColor
                        }
                    }else if(borderColorType == 'RGB'){
                        shapeOutlineColor = gotColor.asRgbColor().asHexString()


                        if(!shapeIdsAndElementsObject[shapeId]){
                            shapeIdsAndElementsObject[shapeId] = {
                                fill: null,
                                font: null,
                                border: shapeOutlineColor,
                                isTable: isTable
                            }
                        }else{
                            shapeIdsAndElementsObject[shapeId].border = shapeOutlineColor
                        }
                    }

                } 
            }
            else if (shapes[k].getPageElementType() == "TABLE") { 
                currentShape = shapes[k].asTable()
                let shapeId = currentShape.getObjectId()
                isTable = true
                let cols = currentShape.getNumColumns()
                let rows = currentShape.getNumRows()
                let colorsArray = []

                for(let i = 0; i < rows; i++){
                    let rowArray = []
                    for(let j = 0; j < cols; j++){

                        // currentShape.getCell(i, j).getFill()
                        let cell = currentShape.getCell(i, j)
                        let tableCellFillColor, tableCellFontColor;

                        if(cell.getFill().getSolidFill()) {
                            let gotColor =  cell.getFill().getSolidFill().getColor()
                            let colorType = gotColor.getColorType()
                            if(colorType == 'THEME'){
                                let THEMECOLOR = gotColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                                tableCellFillColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()
                            }else if(colorType == 'RGB'){
                                tableCellFillColor = gotColor.asRgbColor().asHexString()
                            }
                        }else{
                            tableCellFillColor = null
                        }
                        if(!cell.getText().isEmtpy){
                            let gotForegroundColor = cell.getText().getTextStyle().getForegroundColor()
                            if(gotForegroundColor !== null) {
                                let fontColorType = gotForegroundColor.getColorType()
                                if(fontColorType == 'THEME'){
                                    let THEMECOLOR = gotForegroundColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                                    tableCellFontColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()
                                }else if(fontColorType == 'RGB'){
                                    tableCellFontColor = gotForegroundColor.asRgbColor().asHexString()
                                }
                            }
                        }else{
                            tableCellFontColor = null
                        }
                        rowArray.push({
                            fill: tableCellFillColor ?? false,
                            font: tableCellFontColor ?? false,
                        })
                    }   
                    colorsArray.push(rowArray)
                }
                shapeIdsAndElementsObject[shapeId] = {
                    isTable: isTable,
                    colors: colorsArray
                }
            } 
        } else {
            continue;
        }
    }
};


  export const recolor = async (data) => {

    let startTime = new Date().getTime();

    // scope here matters. If the scope is set to the whole presentation,
    // then we can optimize the speed by only looping through shapes that contain the colors to be replaced.

    // if the scope is selected "shapes", then we don't need the optimized code. Since the potentiol
    // performance gain is not worth the extra code complexity.
    // this is perhaps also the case for "slides" scope, but this hasn't tested it yet.


    // get the presentation object
    let presentation = SlidesApp.getActivePresentation()

    // array of colors that need to be replaced. Each array item is an object with the following properties:
    // currentColor: color, 
    // rgbColor: rgbColor,
    // replace: '',
    // replaceHex: '',
    // replaceRgb: '',
    let replaceArray = data.replaceArray;
    
    // current selection of shapes
    // example: 
    // selection: {
    //     fontColors: true,
    //     fillColors: true,
    //     borderLineColors: true,
    //     slideMasters: false
    // }
    let selectionObj = data.selection;

    // loop through shape ids and get the shapes, then change the color depending the selection

    let i, j, k;
    let replaceArrayCount = replaceArray.length;  //these are the color checkboxes. If only 1 checbox is selected, but that color
    // contains many shapes, then if we must get the length of ALL shapes that container that color, not just the selected shapes.
    // for example, if 1 checkbox is selected, you might say , ok loop once, but the other shapes will get ignored


    let shapeIdsArray = []; // array of shapeId arrays

    for( j = 0 ; j < replaceArrayCount ; j ++ ){  
        shapeIdsArray.push(data.shapeIds[replaceArray[j].currentColor])
    }

    let shapeIdsCount = shapeIdsArray.length;
    let colorScheme = presentation.getPageElementById(shapeIdsArray[0][0]).getParentPage().getColorScheme()

    for( i = 0 ; i < shapeIdsCount ; i ++ ){

        // given the "current color" index 
        // find the shape ids that have that color

        //let shapeIdsArray = data.shapeIds[replaceArray[i].currentColor] // this is an array of shape ids that contain the given color.
        // that way we don't have to loop through all the slides and shapes in the presentation, we already have the shapes needed
        // for the current color .
        
        let currentArray = shapeIdsArray[i]; // container objectids of shapes that contain the current color
        let currentArrayCount = currentArray.length;

        if(currentArrayCount < 1){ continue; } // if there are no shapeIds associated with the current color, skip to the next color (i++

        // loop through the shape ids and get the shapes
        for( k = 0 ; k < currentArrayCount ; k++ ){
            
            let shape = presentation.getPageElementById(currentArray[k])

            let elementType = shape.getPageElementType()

            let currentShape;

            if(elementType == "UNSUPPORTED"){  continue;  }

            if(elementType == "SHAPE"){  currentShape = shape.asShape()  } 

            else if (elementType == "TABLE") {  currentShape = shape.asTable()    }

            let shapeFillColor, shapeFontColor, shapeOutlineColor;

            // now depending on what is selection (fill, font, border), change the color
            // change fill color to current color in replaceArray  check for them color

            if(selectionObj.fillColors && data.previousFills.length > 0){
                
                if(currentShape.getFill().getSolidFill() !== null) {

                    let gotColor =  currentShape.getFill().getSolidFill().getColor()
                    let themeColorType = gotColor.getColorType()

                    if(themeColorType == 'THEME'){
                        let THEMECOLOR = gotColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                        shapeFillColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()
                        if(shapeFillColor === replaceArray[i].currentColor){
                            currentShape.getFill().setSolidFill(replaceArray[i].replaceHex)

                            // 1. ) if a color was replaced we need to update the colors list with the new color
                            // to give the correct colors back to the dialog, since it remains open after submit button is clicked

                            data.previousFills = data.previousFills.filter( (color) => { 
                                return color !== shapeFillColor 
                            })
                            if(!data.previousFills.includes(replaceArray[i].replaceHex) ){
                                data.previousFills.push(replaceArray[i].replaceHex)
                            }


                            // 2.) removing this shapeId associated with the old color
                            data.shapeIds[shapeFillColor] = data.shapeIds[shapeFillColor].filter( (id) => { return id !== currentArray[k] } )

                            // 3.) updating the shapeIds object with the shapeId pushed to the new color array

                            if(!data.shapeIds[replaceArray[i].replaceHex]){
                                data.shapeIds[replaceArray[i].replaceHex] = [currentArray[k]]
                            }else{
                                data.shapeIds[replaceArray[i].replaceHex].push(currentArray[k])
                            }

                        }
                    }else if(themeColorType == 'RGB'){
                        shapeFillColor = gotColor.asRgbColor().asHexString()
                        if(shapeFillColor === replaceArray[i].currentColor){
                            currentShape.getFill().setSolidFill(replaceArray[i].replaceHex)
                            // 1. ) if a color was replaced we need to update the colors list with the new color
                            // to give the correct colors back to the dialog, since it remains open after submit button is clicked

                            data.previousFills = data.previousFills.filter( (color) => { 
                                return color !== shapeFillColor 
                            })
                            if(!data.previousFills.includes(replaceArray[i].replaceHex) ){
                                data.previousFills.push(replaceArray[i].replaceHex)
                            }

                            // 2.) removing this shapeId associated with the old color
                            data.shapeIds[shapeFillColor] = data.shapeIds[shapeFillColor].filter( (id) => { return id !== currentArray[k] } )

                            // 3.) updating the shapeIds object with the shapeId pushed to the new color array

                            if(!data.shapeIds[replaceArray[i].replaceHex]){
                                data.shapeIds[replaceArray[i].replaceHex] = [currentArray[k]]
                            }else{
                                data.shapeIds[replaceArray[i].replaceHex].push(currentArray[k])
                            }
                        }
                    }
                }
            }


            if(selectionObj.fontColors  && data.previousFonts.length > 0){
                //check for text
                let gotForegroundColor = currentShape.getText().getTextStyle().getForegroundColor()
                if(gotForegroundColor !== null) {
                    let fontColorType = gotForegroundColor.getColorType()
                    if(fontColorType == 'THEME'){
                        let THEMECOLOR = gotForegroundColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                        shapeFontColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()

                        if(shapeFontColor === replaceArray[i].currentColor){
                            currentShape.getText().getTextStyle().setForegroundColor(replaceArray[i].replaceHex)

                            //  1. ) if a color was replaced we need to update the colors list with the new color
                            data.previousFonts = data.previousFonts.filter( (color) => { 
                                return color !== shapeFontColor 
                            })
                            if(!data.previousFonts.includes(replaceArray[i].replaceHex) ){
                                data.previousFonts.push(replaceArray[i].replaceHex)
                            }

                            // 2.) removing this shapeId associated with the old color
                            data.shapeIds[shapeFontColor] = data.shapeIds[shapeFontColor].filter( (id) => { return id !== currentArray[k] } )

                            // 3.) updating the shapeIds object with the shapeId pushed to the new color array

                            if(!data.shapeIds[replaceArray[i].replaceHex]){
                                data.shapeIds[replaceArray[i].replaceHex] = [currentArray[k]]
                            }else{
                                data.shapeIds[replaceArray[i].replaceHex].push(currentArray[k])
                            }
                        }
                    }else if(fontColorType == 'RGB'){
                        shapeFontColor = gotForegroundColor.asRgbColor().asHexString()
                        if(shapeFontColor === replaceArray[i].currentColor){
                            currentShape.getText().getTextStyle().setForegroundColor(replaceArray[i].replaceHex)

                            // 1. ) if a color was replaced we need to update the colors list with the new color
                            data.previousFonts = data.previousFonts.filter( (color) => { 
                                return color !== shapeFontColor 
                            })
                            if(!data.previousFonts.includes(replaceArray[i].replaceHex) ){
                                data.previousFonts.push(replaceArray[i].replaceHex)
                            }

                            // 2.) removing this shapeId associated with the old color
                            data.shapeIds[shapeFontColor] = data.shapeIds[shapeFontColor].filter( (id) => { return id !== currentArray[k] } )

                            // 3.) updating the shapeIds object with the shapeId pushed to the new color array

                            if(!data.shapeIds[replaceArray[i].replaceHex]){
                                data.shapeIds[replaceArray[i].replaceHex] = [currentArray[k]]
                            }else{
                                data.shapeIds[replaceArray[i].replaceHex].push(currentArray[k])
                            }
                            
                        }
                    }
                }
            }
            if(selectionObj.borderLineColors && data.previousBorders.length > 0){
                let gotColor = currentShape.getBorder().getLineFill().getSolidFill().getColor()
                let borderColorType = gotColor.getColorType()

                if(borderColorType == 'THEME'){
                    let THEMECOLOR = gotColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                    shapeOutlineColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()

                    if(shapeOutlineColor === replaceArray[i].currentColor){
                        currentShape.getBorder().getLineFill().setSolidFill(replaceArray[i].replaceHex)

                        //  1. ) if a color was replaced we need to update the colors list with the new color
                        data.previousBorders = data.previousBorders.filter((color)  => { 
                            return color !== shapeOutlineColor 
                        })
                        if(!data.previousBorders.includes(replaceArray[i].replaceHex) ){
                            data.previousBorders.push(replaceArray[i].replaceHex)
                        }

                        // 2.) removing this shapeId associated with the old color
                        data.shapeIds[shapeOutlineColor] = data.shapeIds[shapeOutlineColor].filter( (id) => { 
                            return id !== currentArray[k] 
                        } )

                        // 3.) updating the shapeIds object with the shapeId pushed to the new color array
                        if(!data.shapeIds[replaceArray[i].replaceHex]){
                            data.shapeIds[replaceArray[i].replaceHex] = [currentArray[k]]
                        }else{
                            data.shapeIds[replaceArray[i].replaceHex].push(currentArray[k])
                        }
                    }
                }else if(borderColorType == 'RGB'){

                    shapeOutlineColor = gotColor.asRgbColor().asHexString()
                    if(shapeOutlineColor === replaceArray[i].currentColor){
                        currentShape.getBorder().getLineFill().setSolidFill(replaceArray[i].replaceHex)


                        // 1.) if a color was replaced we need to update the colors list with the new color
                        data.previousBorders = data.previousBorders.filter((color)  => { 
                            return color !== shapeOutlineColor 
                        })
                        if(!data.previousBorders.includes(replaceArray[i].replaceHex) ){
                            data.previousBorders.push(replaceArray[i].replaceHex)
                        }

                        // 2.) removing this shapeId associated with the old color
                        data.shapeIds[shapeOutlineColor] = data.shapeIds[shapeOutlineColor].filter( (id) => { return id !== currentArray[k] } )

                        // 3.) updating the shapeIds object with the shapeId pushed to the new color array
                        if(!data.shapeIds[replaceArray[i].replaceHex]){
                            data.shapeIds[replaceArray[i].replaceHex] = [currentArray[k]]
                        }else{
                            data.shapeIds[replaceArray[i].replaceHex].push(currentArray[k])
                        }
                    }
                }
            }
        }
    }

    return  {
        time: new Date().getTime() - startTime,
        colorsRef: data.shapeIds,
        borders: data.previousBorders,
        fills: data.previousFills,
        fonts: data.previousFonts
    }
  }

  export const recolor2 = async (data) => {
    const startTime = Date.now();
    let presentation = SlidesApp.getActivePresentation()

    for(let i = 0; i < data.replaceArray.length; i ++){
        for (const [key, value] of Object.entries(data.objectIds)) {
            let currentShape = presentation.getPageElementById(key)
            let elementType = currentShape.getPageElementType()

      
            if(elementType == "SHAPE"){
                if(value.border === data.replaceArray[i].currentColor  && data.selection.borderLineColors){
                    currentShape.asShape().getBorder().getLineFill().setSolidFill(data.replaceArray[i].replaceHex)
                    data.objectIds[key].border = data.replaceArray[i].replaceHex
                }
                if(value.font === data.replaceArray[i].currentColor  && data.selection.fontColors){
                    let text = currentShape.asShape().getText().asRenderedString()
                    let str = text.replace(/\s+/g, '');
                    if(str.length > 0){
                        currentShape.asShape().getText().getTextStyle().setForegroundColor(data.replaceArray[i].replaceHex)
                        data.objectIds[key].font = data.replaceArray[i].replaceHex
                    }
                }
                if(value.fill === data.replaceArray[i].currentColor  && data.selection.fillColors){
                    currentShape.asShape().getFill().setSolidFill(data.replaceArray[i].replaceHex)
                    data.objectIds[key].fill = data.replaceArray[i].replaceHex
                }
            }else if(elementType == "TABLE"  && data.objectIds[key].isTable){
                // we cannot get border colors from tables so we will only look for fill and font colors
                // loop through the table cells 
                let currentTable = currentShape.asTable()
                for(let r = 0; r < value.colors.length ; r ++){
                    for(let c = 0 ; c < value.colors[r].length; c ++){
                        if(value.colors[r][c].font === data.replaceArray[i].currentColor  && data.selection.fontColors){

                            let gotText = currentTable.getCell(r, c).getText()
                            let text = gotText.asRenderedString()
                            let str = text.replace(/\s+/g, '');

                            if(str.length > 0){
                                gotText.getTextStyle().setForegroundColor(data.replaceArray[i].replaceHex)
                                data.objectIds[key].colors[r][c].font = data.replaceArray[i].replaceHex
                            }
                        }

                        if(value.colors[r][c].fill === data.replaceArray[i].currentColor  && data.selection.fillColors){
                            currentShape.asTable().getCell(r, c).getFill().setSolidFill(data.replaceArray[i].replaceHex)
                            data.objectIds[key].colors[r][c].fill = data.replaceArray[i].replaceHex
                        }
                    }
                }
            }
        }        
    }

    let returnObj = {
        time: new Date().getTime() - startTime,
        shapeIdsAndElementsObject: data.objectIds,
    }

    return returnObj
  }