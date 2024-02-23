import { tokens } from "../theme";

// Function to generate a random number between min and max (inclusive)
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Define the mock line data with randomly generated y values for each month
export const mockLineData = [
  {
    id: "Death",
    color: tokens("dark").redAccent[200],
    data: generateRandomData(1, 300), // Generate random y values between 1 and 300 for each month
  },
  {
    id: "confirmed",
    color: tokens("dark").blueAccent[300],
    data: generateRandomData(1, 300), // Generate random y values between 1 and 300 for each month
  },
  {
    id: "cured",
    color: tokens("dark").greenAccent[500],
    data: generateRandomData(1, 300), // Generate random y values between 1 and 300 for each month
  },
];

// Function to generate an array of data points with random y values for each month
function generateRandomData(minY, maxY) {
  const data = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  months.forEach(month => {
    data.push({
      x: month,
      y: getRandomNumber(minY, maxY)
    });
  });

  return data;
}
