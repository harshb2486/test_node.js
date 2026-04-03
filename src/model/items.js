const items = [];

function findByCode(code) {
  return items.find((it) => it.ItemCode === code);
}

function listActive() {
  return items.filter((it) => it.Status === 'active');
}

function create(item) {
  items.push(item);
  return item;
}

function update(code, changes) {
  const item = findByCode(code);
  if (!item) return null;
  Object.assign(item, changes);
  return item;
}

function softDelete(code) {
  const item = findByCode(code);
  if (!item) return null;
  item.Status = 'inactive';
  return item;
}

export { items, findByCode, listActive, create, update, softDelete };
