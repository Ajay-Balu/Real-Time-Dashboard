import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ChartComponent = () => {
  const [data, setData] = useState([]);
  const [totalSamplesData, setTotalSamplesData] = useState([]);
  const [negativeData, setNegativeData] = useState([]);
  const [positiveData, setPositiveData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('data', newData => {
        setData(prevData => [
          ...prevData,
          ...newData.map(item => ({
            TotalSamples: item.TotalSamples || 0,
            Negative: item.Negative || 0,
            Positive: item.Positive || 0
          }))
        ]);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < data.length) {
        const currentData = data[currentIndex];
        setTotalSamplesData(prevData => {
          let newData = [...prevData, { x: new Date(), y: currentData.TotalSamples }];
          if (newData.length > 10) {
            newData = newData.slice(1); 
          }
          return newData;
        });
        setNegativeData(prevData => {
          let newData = [...prevData, { x: new Date(), y: currentData.Negative }];
          if (newData.length > 10) {
            newData = newData.slice(1); 
          }
          return newData;
        });
        setPositiveData(prevData => {
          let newData = [...prevData, { x: new Date(), y: currentData.Positive }];
          if (newData.length > 10) {
            newData = newData.slice(1); 
          }
          return newData;
        });
        setCurrentIndex(prevIndex => prevIndex + 1);
      }
    }, 1500);
  
    return () => clearInterval(interval);
  }, [currentIndex, data]);
  


  console.log("samples",totalSamplesData);
  console.log("negative",negativeData);
  console.log("positive",positiveData);

  const options = {
    animationEnabled: true,
    backgroundColor: "#ffffff00",
    height:200,
    width:750,
    axisX: {
      
      gridThickness: 0
    },
    axisY: {
      title: 'Count',
      titleFontColor: "#ffff00",
      gridThickness: 0

    },
    legend:{
      fontColor: "red",
    },
    data: [{
      type: 'spline',
      name: 'Total Samples',
      showInLegend: true,
      dataPoints: totalSamplesData,
    }, {
      type: 'spline',
      name: 'Negative',
      showInLegend: true,
      dataPoints: negativeData,
    }, {
      type: 'spline',
      name: 'Positive',
      showInLegend: true,
      
      dataPoints: positiveData,
    }],
  };

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};


export default ChartComponent;
