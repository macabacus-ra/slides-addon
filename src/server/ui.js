export const onOpen = () => {
  const menu = SlidesApp.getUi()
    .createMenu('Macabacus') // edit me!
    // .addItem('Sheet Editor', 'openDialog')
    // .addItem('Sheet Editor (Bootstrap)', 'openDialogBootstrap')
    // .addItem('Sheet Editor (MUI)', 'openDialogMUI')
    .addItem('Sheet Editor (Tailwind CSS)', 'openDialogTailwindCSS')
    .addItem('Open Sidebar', 'openSidebarMain')
    .addItem('Dialog Test', 'openDialogTest');

  menu.addToUi();
};

export const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo')
    .setWidth(450)
    .setHeight(600);
    SlidesApp.getUi().showModalDialog(html, 'Recolor');
};

export const openDialogBootstrap = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo-bootstrap')
    .setWidth(600)
    .setHeight(600);
    SlidesApp.getUi().showModalDialog(html, 'Sheet Editor (Bootstrap)');
};

export const openDialogMUI = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo-mui')
    .setWidth(600)
    .setHeight(600);
    SlidesApp.getUi().showModalDialog(html, 'Sheet Editor (MUI)');
};

export const openDialogTest = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-test')
    .setWidth(600)
    .setHeight(600);
    SlidesApp.getUi().showModalDialog(html, 'Dialog Test');
};

export const openDialogTailwindCSS = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo-tailwindcss')
    .setWidth(600)
    .setHeight(600);
    SlidesApp.getUi().showModalDialog(html, 'Sheet Editor (Tailwind CSS)');
};

export const openSidebarMain = () => {
  const html = HtmlService.createHtmlOutputFromFile('macabacus-sidebar-main');
  SlidesApp.getUi().showSidebar(html);
};
