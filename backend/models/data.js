const XLSX = require('xlsx');
const path = require('path');

// Function to convert Excel serial date to formatted date string (D-M-YY)
const excelSerialToDate = (serial) => {
    // Convert serial to milliseconds since January 1, 1970 (Excel's epoch starts from December 30, 1899)
    const millisecondsSince1970 = (serial - 25569) * 86400 * 1000;
    const date = new Date(millisecondsSince1970);

    // Extract day, month, and year
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are zero-based
    const year = date.getUTCFullYear().toString().slice(-2); // Get last 2 digits of year

    // Format the date string
    return `${day}-${month}-${year}`;
};

// Read excel file
const excelFilePath = path.join(__dirname, '../public', 'TNBook.xlsx');
const workbook = XLSX.readFile(excelFilePath, { type: 'buffer' });

// Get first worksheet
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

// Format into array of objects
const formattedData = data.map(row => {
  const formattedRow = {};
  Object.keys(row).forEach(key => {
    // Convert 'Date' column from Excel serial date to formatted date string
    if (key === 'Date') {
      formattedRow[key] = excelSerialToDate(row[key]);
    } else {
      formattedRow[key] = row[key];
    }
  });
  return formattedRow;
});

// console.log(formattedData.slice(0,5));
// Export formatted data
module.exports = formattedData;
