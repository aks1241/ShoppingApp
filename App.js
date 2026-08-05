const express = require('express');
const routes = require('./Routes');

const app = express();

app.use(express.json());
app.use('/', routes);

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
