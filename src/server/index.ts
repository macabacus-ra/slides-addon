import {
  onOpen,
  openDialog,
  openDialogBootstrap,
  openDialogMUI,
  openDialogTest,
  openDialogTailwindCSS,
  openSidebarMain,
} from './ui';

import { getSheetsData, addSheet, deleteSheet, setActiveSheet } from './sheets';

import { loadColors, recolor } from './shapes/recolor.js'

// Public functions must be exported as named exports
export {
  onOpen,
  openDialog,
  openDialogBootstrap,
  openDialogMUI,
  openDialogTest,
  openDialogTailwindCSS,
  openSidebarMain,
  getSheetsData,
  loadColors,
  recolor,
  addSheet,
  deleteSheet,
  setActiveSheet,
};
