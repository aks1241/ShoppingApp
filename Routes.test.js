const request = require('supertest');
const app = require('./App');
const db = require('./fakeDB');

beforeEach(() => {
  // Clear the items array before each test
  db.getItems().length = 0;
});

describe('GET /items', () => {
  test('returns an empty array when no items exist', async () => {
    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns all items in the database', async () => {
    db.addItem('Apple', 1.99);
    db.addItem('Banana', 0.99);

    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toEqual({ name: 'Apple', price: 1.99 });
    expect(res.body[1]).toEqual({ name: 'Banana', price: 0.99 });
  });
});

describe('POST /items', () => {
  test('adds a new item and returns it', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'Apple', price: 1.99 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: 'Apple', price: 1.99 });
    expect(db.getItems()).toHaveLength(1);
  });

  test('adds multiple items', async () => {
    await request(app).post('/items').send({ name: 'Apple', price: 1.99 });
    await request(app).post('/items').send({ name: 'Banana', price: 0.99 });

    expect(db.getItems()).toHaveLength(2);
  });
});

describe('GET /items/:name', () => {
  test('returns the item with the given name', async () => {
    db.addItem('Apple', 1.99);
    db.addItem('Banana', 0.99);

    const res = await request(app).get('/items/Apple');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: 'Apple', price: 1.99 });
  });

  test('returns an empty response when the item does not exist', async () => {
    const res = await request(app).get('/items/Orange');
    expect(res.status).toBe(200);
    expect(res.body).toBe('');
  });
});

describe('PATCH /items/:name', () => {
  test('updates the item with the given name', async () => {
    db.addItem('Apple', 1.99);

    const res = await request(app)
      .patch('/items/Apple')
      .send({ name: 'Green Apple', price: 2.49 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: 'Green Apple', price: 2.49 });
    expect(db.getItemByName('Green Apple')).toEqual({ name: 'Green Apple', price: 2.49 });
  });

  test('returns false when the item does not exist', async () => {
    const res = await request(app)
      .patch('/items/Orange')
      .send({ name: 'Orange', price: 0.50 });

    expect(res.status).toBe(200);
    expect(res.body).toBe(false);
  });
});

describe('DELETE /items/:name', () => {
  test('removes the item with the given name', async () => {
    db.addItem('Apple', 1.99);
    db.addItem('Banana', 0.99);

    const res = await request(app).delete('/items/Apple');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' });
    expect(db.getItems()).toHaveLength(1);
    expect(db.getItemByName('Apple')).toBeUndefined();
  });

  test('returns Delete failed when the item does not exist', async () => {
    const res = await request(app).delete('/items/Orange');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Delete failed' });
  });
});