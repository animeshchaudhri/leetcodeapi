const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const csvFilePath = 'db.csv';


const data = [];
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });


app.get('/query', (req, res) => {
  const { companies } = req.query;

  
  let filteredData = data;
  if (companies) {
    filteredData = filteredData.filter(item => item.companies && item.companies.includes(companies));
  }


  res.json(filteredData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
