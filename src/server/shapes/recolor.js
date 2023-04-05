// const getSlides = () => SpreadsheetApp.getActive().getSheets();

// const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

export const getColors = () => {
    let selections = SlidesApp.getActivePresentation().getSelection()
    let pageElementRange = selections.getPageElementRange()
    if(!pageElementRange){ SlidesApp.getUi().alert('Select one or more shapes to perform this operation'); return }
    if (pageElementRange){
        let elements = pageElementRange.getPageElements()

        if(elements.length === 1){ SlidesApp.getUi().alert('Select one or more shapes to perform this operation'); return }    
    
        elements.map( (shape) => {
            let width = shape.getWidth()
            if(width){ shape.setLeft(0) }
          }); 
    
    
    }

//   return getSheets().map((sheet, index) => {
//     const name = sheet.getName();
//     return {
//       name,
//       index,
//       isActive: name === activeSheetName,
//     };
//   });

};