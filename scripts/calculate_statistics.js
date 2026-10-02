const items = $input.all();
if (!items.length) return [{ json: { error: "No data found" } }];

const rows = items.map(item => item.json);
const totalRows = rows.length;
const columnNames = Object.keys(rows[0] || {});
const totalColumns = columnNames.length;

const summary = {
  overview: {
    totalRows,
    totalColumns,
    columns: columnNames
  },
  columns: {}
};

for (const col of columnNames) {
  let nullOrBlankCount = 0;
  const values = [];
  const numericValues = [];

  for (const row of rows) {
    const val = row[col];
    if (val === null || val === undefined || String(val).trim() === '') {
      nullOrBlankCount++;
    } else {
      values.push(val);
      const num = Number(val);
      if (!isNaN(num) && typeof val !== 'boolean') {
        numericValues.push(num);
      }
    }
  }

  const uniqueValues = new Set(values);
  const isNumeric = numericValues.length > 0 && numericValues.length >= values.length * 0.8;

  const colStats = {
    detectedType: isNumeric ? 'Numeric' : 'Text/Categorical',
    nonNullCount: values.length,
    missingOrBlankCount: nullOrBlankCount,
    uniqueCount: uniqueValues.size,
    uniquePercentage: ((uniqueValues.size / totalRows) * 100).toFixed(2) + '%'
  };

  if (isNumeric && numericValues.length > 0) {
    numericValues.sort((a, b) => a - b);
    const sum = numericValues.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / numericValues.length;
    const mid = Math.floor(numericValues.length / 2);
    const median = numericValues.length % 2 !== 0 
      ? numericValues[mid] 
      : (numericValues[mid - 1] + numericValues[mid]) / 2;

    colStats.numericMetrics = {
      min: numericValues[0],
      max: numericValues[numericValues.length - 1],
      mean: Number(mean.toFixed(2)),
      median: Number(median.toFixed(2))
    };
  }

  summary.columns[col] = colStats;
}

return [{ json: summary }];
