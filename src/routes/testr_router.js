import express from 'express';
import { createItem, getItems, getItemByCode, updateItem, deleteItem } from '../controller/controller.js';
const router = express.Router();

router.post('/', createItem);
router.get('/', getItems);
router.get('/:code', getItemByCode);
router.put('/:code', updateItem);
router.delete('/:code', deleteItem);

export default router;