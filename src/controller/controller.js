import { findByCode, listActive, create as createItemModel, update as updateModel, softDelete } from '../model/items.js';

function validateNewItem(body) {
  const { ItemCode, Name, Quantity } = body;
  const errors = [];
  if (!ItemCode || typeof ItemCode !== 'string') errors.push('ItemCode is required and must be a string');
  if (!Name || typeof Name !== 'string') errors.push('Name is required and must be a string');
  if (Quantity === undefined || typeof Quantity !== 'number' || Number.isNaN(Quantity)) errors.push('Quantity is required and must be a number');
  return errors;
}

export function createItem(req, res) {
  const errors = validateNewItem(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const existing = findByCode(req.body.ItemCode);
  if (existing) return res.status(400).json({ error: 'Item with this ItemCode already exists' });

  const item = {
    ItemCode: req.body.ItemCode,
    Name: req.body.Name,
    Quantity: req.body.Quantity,
    Status: req.body.Status === 'inactive' ? 'inactive' : 'active',
    CreatedAt: new Date().toISOString(),
  };

  createItemModel(item);
  return res.status(201).json(item);
}

export function getItems(req, res) {
  const active = listActive();
  return res.status(200).json(active);
}

export function getItemByCode(req, res) {
  const { code } = req.params;
  const item = findByCode(code);
  if (!item || item.Status !== 'active') return res.status(404).json({ error: 'Item not found' });
  return res.status(200).json(item);
}

export function updateItem(req, res) {
  const { code } = req.params;
  const { Quantity, Status } = req.body;
  if (Quantity === undefined && Status === undefined) {
    return res.status(400).json({ error: 'Provide Quantity or Status to update' });
  }

  const changes = {};
  if (Quantity !== undefined) {
    if (typeof Quantity !== 'number' || Number.isNaN(Quantity)) return res.status(400).json({ error: 'Quantity must be a number' });
    changes.Quantity = Quantity;
  }
  if (Status !== undefined) {
    if (Status !== 'active' && Status !== 'inactive') return res.status(400).json({ error: "Status must be 'active' or 'inactive'" });
    changes.Status = Status;
  }

  const updated = updateModel(code, changes);
  if (!updated) return res.status(404).json({ error: 'Item not found' });
  return res.status(200).json(updated);
}

export function deleteItem(req, res) {
  const { code } = req.params;
  const item = softDelete(code);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  return res.status(200).json({ message: 'Item set to inactive', item });
}
