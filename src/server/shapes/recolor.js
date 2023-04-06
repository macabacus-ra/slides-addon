
export const loadColors = async (scope) => {
    let colorsObject;

    if (scope === 'shapes') {
        // from every shape, depending on selection, get the color of the font, fill, and border/line
        // let shapes = context.presentation.getSelectedShapes().load("items");

        // const startTime = Date.now();
        let selections = SlidesApp.getActivePresentation().getSelection()
        let pageElementRange = selections.getPageElementRange()
        let shapes = pageElementRange.getPageElements() 

        let colorsData = {
          fonts: [],
          fills: [],
          borders: []
        };
    
        let result = await getColors(colorsData, shapes);

        // colorsList = getUniqueColors(result)

        colorsObject = result;

        // return // uncomment this to return early
  
  
      }
    //   else if (scope === 'slides') {
    //     //GET SELECTED SHAPE COLORS from slide
    //     let slides = context.presentation.load("slides").getSelectedSlides().load();
    //     await context.sync();
  
    //     let colorsData = {
    //       fonts: [],
    //       fills: [],
    //       borders: []
    //     };
  
    //     for (let i = 0; i < slides.items.length; i++) {
    //       let shapes = slides.items[i].shapes.load("items");
    //       await context.sync();
    //       colorsData = await getColors(context, colorsData, shapes.items);
    //     }
  
    //     colorsObject = colorsData;
    //     return
  
    //   }else if (scope === 'presentation') {
    //     let slides = context.presentation.slides.load("items");

    
    //     let colorsData = {
    //       fonts: [],
    //       fills: [],
    //       borders: [],
    //     };
    
    //     for (let i = 0; i < slides.items.length; i++) {
    //       let shapes = slides.items[i].shapes.load("items");
    //       colorsData = await getColors(context, colorsData, shapes.items);
    //     }
        
    //     colorsObject = colorsData;
    //     return
    //   }
    
    return colorsObject
  
};


const getColors = async (dataObject, shapes) => {
    // this is the format of the incoming object  {
    //   fonts array
    //   fills array
    //   borders array
    // }
    let colorScheme = shapes[0].getParentPage().getColorScheme() // don't need this on every loop, just once since it wont change
  
    for (let index = 0; index < shapes.length; index++) {

        let currentShape;

        // if (shapes[index].getPageElementType() !== SlidesApp.PageElementType.IMAGE) {   //make sure shape is not an image type
            
            if(shapes[index].getPageElementType() === SlidesApp.PageElementType.SHAPE){ currentShape = shapes[index].asShape()  } 
            else if (shapes[index].getPageElementType() === SlidesApp.PageElementType.TABLE) { currentShape = shapes[index].asTable()  } 

            let shapeFillColor;
            let shapeFontColor;
            let shapeOutlineColor;


            // getting colors if thery are available, meaning they are not undefined or transparent
            if(currentShape.getFill().getSolidFill() !== null) {
                // if it has a fill, we need to check if it is a theme color or not! Very important!
                let themeColorType = currentShape.getFill().getSolidFill().getColor().getColorType()

                if(themeColorType == 'THEME'){
                    let THEMECOLOR = currentShape.getFill().getSolidFill().getColor().asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                    shapeFillColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()
                }else if(themeColorType == 'RGB'){
                    shapeFillColor = currentShape.getFill().getSolidFill().getColor().asRgbColor().asHexString()
                }

            }




            // if(currentShape.getText().getTextStyle().getForegroundColor() !== null) {



            //     shapeFontColor = currentShape.getText().getTextStyle().getForegroundColor().asRgbColor().asHexString()
            // }
            if(currentShape.getBorder().getLineFill().getSolidFill() !== null) {
                let borderColorType = currentShape.getBorder().getLineFill().getSolidFill().getColor().getColorType()

                if(borderColorType == 'THEME'){
                    let THEMECOLOR = currentShape.getBorder().getLineFill().getSolidFill().getColor().asThemeColor().getThemeColorType() // some kind of ACCENT1, ACCENT2, DARK1 etc
                    shapeOutlineColor = colorScheme.getConcreteColor(THEMECOLOR).asRgbColor().asHexString()

                }else if(borderColorType == 'RGB'){
                    shapeOutlineColor = currentShape.getBorder().getLineFill().getSolidFill().getColor().asRgbColor().asHexString()
                }
            }
  
            //** 3 conditions needed to add a color to each of the three arrays of colorType (fills, fonts, borders):
            // 1. the color is not undefined
            // 2. the color is not already in the array
            // 3. the color selection is in the scope selection (** Not yet implemented **)
            // #3 this will be implemented in the front end, so that the front end can filter the colorsList array faster

            if (shapeFillColor && (dataObject.fills.indexOf(shapeFillColor) === -1)){
                dataObject.fills.push(shapeFillColor);
            }
            // if (shapeFontColor && (dataObject.fonts.indexOf(shapeFontColor) === -1)){
            //     dataObject.fonts.push(shapeFontColor);
            // }
            if (shapeOutlineColor && (dataObject.borders.indexOf(shapeOutlineColor) === -1)){
                dataObject.borders.push(shapeOutlineColor);
            }

        // } else {
        //     continue;
        // }
    }
  
    return dataObject;
  };