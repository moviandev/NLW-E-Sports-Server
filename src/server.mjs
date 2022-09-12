import express from 'express';

const app = express();

app.get('/ads', (req, res) => {
  return res.json([
    { id: 1, name: 'test' },
    { id: 2, name: 'test 2' },
    { id: 3, name: 'test 3' },
  ])
});

app.listen(3333);
