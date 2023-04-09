
export const loadColors = async (scope) => {
    let colorsObject;
    const startTime = Date.now();

    let shapeIdObject = {};  // this is a global object that will hold a hex color and all the shapes that have this color. 
    // This is so that, when user clicks recolor, we only have to loop through the shapes that have the selected colors, 
    // and not through every shape on every slide getting data again and checking conditions


    if (scope === 'shapes') {
        // from every shape, depending on selection, get the color of the font, fill, and border/line
        let selections = SlidesApp.getActivePresentation().getSelection()
        let pageElementRange = selections.getPageElementRange()
        let shapes = pageElementRange.getPageElements() 

        let colorsData = {
            fonts: [],
            fills: [],
            borders: []
        };

        let result = await getColors(colorsData, shapes, shapeIdObject);
        colorsObject = result;
      }

      if (scope === 'presentation') {
            const startTime = Date.now();
            let slides = SlidesApp.getActivePresentation().getSlides()
            let slidesCount = slides.length
            let colorsData = {
                fonts: [],
                fills: [],
                borders: [],
            };
        
            for (let i = 0; i < slidesCount; i++) {
                let shapes = slides[i].getPageElements()
                if(shapes.length === 0){ continue } ; // if there are no shapes on the slide, skip it 
                colorsData = await getColors(colorsData, shapes, shapeIdObject);
            }
            colorsObject = colorsData;
        }
          else if (scope === 'slides') {
            const startTime = Date.now();
            let slides = SlidesApp.getActivePresentation().getSelection().getPageRange().getPages()
            let slidesCount = slides.length
            

            let colorsData = {
                fonts: [],
                fills: [],
                borders: [],
            };
        
            for (let i = 0; i < slidesCount; i++) {
                let shapes = slides[i].getPageElements()
                if(shapes.length === 0){ continue } ; // if there are no shapes on the slide, skip it 
                colorsData = await getColors(colorsData, shapes, shapeIdObject);
            }
            
            colorsObject = colorsData;
          }
    colorsObject.colorsRef = shapeIdObject;
    colorsObject.time = Date.now() - startTime;
    return colorsObject
};


const getColors = async (dataObject, shapes, shapeIdObject) => {
    // this is the format of the incoming object  {
    //   fonts array
    //   fills array
    //   borders array
    
    // }


    // i nned to store all colors that are present in each shape... This is so that, when user
    // selects colors to replace in a presentation scope, we no longer have to loop through ever slide, only 
    // the shapes that have the selected colors.



    let shapesCount = shapes.length
    let fill = dataObject.fills  // empty object to hold and the colors and check uniqueness
    let font = dataObject.fonts  // empty object to hold and the colors and check uniqueness
    let border = dataObject.borders  // empty object to hold and the colors and check uniqueness

    let colorScheme = shapes[0].getParentPage().getColorScheme() // don't need this on every loop, just once since it wont change
  
    for (let k = 0; k < shapesCount; k++) {

        let currentShape;
        if (shapes[k].getPageElementType() != "IMAGE") {   //make sure shape is not an image type
            
            if(shapes[k].getPageElementType() == "SHAPE"){ currentShape = shapes[k].asShape()  } 
            else if (shapes[k].getPageElementType() === "TABLE") { currentShape = shapes[k].asTable()  } 

            let shapeFillColor;
            let shapeFontColor;
            let shapeOutlineColor;


            // getting colors if thery are available, meaning they are not undefined or transparent
            if(currentShape.getFill().getSolidFill() !== null) {
                // if it has a fill, we need to check if it is a theme color or not! Very important!
                let gotColor =  currentShape.getFill().getSolidFill().getColor()
                let themeColorType = gotColor.getColorType()

                if(themeColorType == 'THEME'){
                    let THEMECOLOR = gotColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                    shapeFillColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()

                    //push to "fills" array here and do checking with object and associative array, faster approach than using array.includes() to check if color already exists
                    if(!fill[shapeFillColor]){
                        fill[shapeFillColor] = 1
                        dataObject.fills.push(shapeFillColor);

                        if(!shapeIdObject[shapeFillColor]){ 
                            shapeIdObject[shapeFillColor] = [currentShape.getObjectId()]
                        }else{
                            shapeIdObject[shapeFillColor].push(currentShape.getObjectId())
                        }

                    }

                }else if(themeColorType == 'RGB'){

                    shapeFillColor = gotColor.asRgbColor().asHexString()
                    if(!fill[shapeFillColor]){
                        fill[shapeFillColor] = 1
                        dataObject.fills.push(shapeFillColor);

                        if(!shapeIdObject[shapeFillColor]){ 
                            shapeIdObject[shapeFillColor] = [currentShape.getObjectId()]
                        }else{
                            shapeIdObject[shapeFillColor].push(currentShape.getObjectId())
                        }

                    }
                }
            }

            if(currentShape.getText() !== null){

                let gotForegroundColor = currentShape.getText().getTextStyle().getForegroundColor()

                if(gotForegroundColor !== null) {
                    let fontColorType = gotForegroundColor.getColorType()
                    if(fontColorType == 'THEME'){
                        let THEMECOLOR = gotForegroundColor.asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                        shapeFontColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()

                        if(!font[shapeFontColor]){
                            font[shapeFontColor] = 1
                            dataObject.fonts.push(shapeFontColor);

                            if(!shapeIdObject[shapeFontColor]){ 
                                shapeIdObject[shapeFontColor] = [currentShape.getObjectId()]
                            }else{
                                shapeIdObject[shapeFontColor].push(currentShape.getObjectId())
                            }

                        }

                    }else if(fontColorType == 'RGB'){
                        shapeFontColor = gotForegroundColor.asRgbColor().asHexString()

                        if(!font[shapeFontColor]){
                            font[shapeFontColor] = 1
                            dataObject.fonts.push(shapeFontColor);

                            if(!shapeIdObject[shapeFontColor]){ 
                                shapeIdObject[shapeFontColor] = [currentShape.getObjectId()]
                            }else{
                                shapeIdObject[shapeFontColor].push(currentShape.getObjectId())
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

                    if(!border[shapeOutlineColor]){
                        border[shapeOutlineColor] = 1
                        dataObject.borders.push(shapeOutlineColor);


                        if(!shapeIdObject[shapeOutlineColor]){ 
                            shapeIdObject[shapeOutlineColor] = [currentShape.getObjectId()]
                        }else{
                            shapeIdObject[shapeOutlineColor].push(currentShape.getObjectId())
                        }
                    }


                }else if(borderColorType == 'RGB'){
                    shapeOutlineColor = gotColor.asRgbColor().asHexString()

                    if(!border[shapeOutlineColor]){
                        border[shapeOutlineColor] = 1
                        dataObject.borders.push(shapeOutlineColor);
                    
                    
                        if(!shapeIdObject[shapeOutlineColor]){ 
                            shapeIdObject[shapeOutlineColor] = [currentShape.getObjectId()]
                        }else{
                            shapeIdObject[shapeOutlineColor].push(currentShape.getObjectId())
                        }
                    
                    
                    }
                }
            }
  
            //** 3 conditions needed to add a color to each of the three arrays of colorType (fills, fonts, borders):
            // 1. the color is not undefined
            // 2. the color is not already in the array
            // 3. the color selection is in the scope selection (** Not yet implemented **)
            // #3 this will be implemented in the front end, so that the front end can filter the colorsList array faster


            // old version, now using object to check for uniqueness
            // if (shapeFillColor && (dataObject.fills.indexOf(shapeFillColor) === -1)){
            //     dataObject.fills.push(shapeFillColor);
            // }
            // if (shapeFontColor && (dataObject.fonts.indexOf(shapeFontColor) === -1)){
            //     dataObject.fonts.push(shapeFontColor);
            // }
            // if (shapeOutlineColor && (dataObject.borders.indexOf(shapeOutlineColor) === -1)){
            //     dataObject.borders.push(shapeOutlineColor);
            // }
        } else {
            continue;
        }
    }
  
    return dataObject;
  };