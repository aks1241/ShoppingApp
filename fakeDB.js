const Item = require('./Item');

let items = [];

function addItem(name, price) {
  const newItem = new Item(name, price);
  items.push(newItem);
  return newItem;
}

function getItems() {
  return items;
}

function getItemByName(name) {
  return items.find(item => item.name === name);
}

function updateItem(name, data) {
  const item = items.find(item => item.name === name);
  if (!item) {
    return false;
  }
  item.name = data.name;
  item.price = data.price;
  return item;
}

function removeItemByName(name) {
  const index = items.findIndex(item => item.name === name);
  if (index === -1) {
    return false;
  }
  items.splice(index, 1);
  return true;
}

module.exports = {
  addItem,
  getItems,
  getItemByName,
  updateItem,
  removeItemByName
};
