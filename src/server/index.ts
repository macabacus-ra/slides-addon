import {
  onOpen,
  openDialog,
  openDialogBootstrap,
  openDialogMUI,
  openDialogTailwindCSS,
  openSidebarMain,
} from './ui';

import { getSheetsData, addSheet, deleteSheet, setActiveSheet } from './sheets';

import { getColors } from './shapes/recolor.js'

// Public functions must be exported as named exports
export {
  onOpen,
  openDialog,
  openDialogBootstrap,
  openDialogMUI,
  openDialogTailwindCSS,
  openSidebarMain,
  getSheetsData,
  getColors,
  addSheet,
  deleteSheet,
  setActiveSheet,
};
