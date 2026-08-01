import fs from 'fs';

function generateTableData(records = 50) {
  const items = [];

  for (let i = 1; i <= records; i++) {
    const income = Math.floor(Math.random() * 100000) + 1000;
    const taxes = Math.floor(income * 0.2);
    const expenses = Math.floor(Math.random() * 50000) + 500;
    const sales = Math.floor(Math.random() * 1000) + 10;
    const profit = income - taxes - expenses;
    const returns = Math.floor(Math.random() * 100);
    const revenue = income + sales - returns;

    items.push({
      title: `group_1_row_${i}`,
      income,
      taxes,
      expenses,
      sales,
      profit,
      returns,
      revenue,
      _id: `row_${i}`
    });
  }

  return {
    datatable: {
      items,
    },
  };
}

const jsonData = generateTableData(50);
fs.writeFileSync('dev-server/table_db.json', JSON.stringify(jsonData, null, 2), 'utf8');

console.log('Generate Table Data Success');
