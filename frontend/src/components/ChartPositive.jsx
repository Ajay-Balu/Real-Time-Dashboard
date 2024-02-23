import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import io from 'socket.io-client';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;



const ChartPositive = (props) => {
    const [data, setData] = useState([]);
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
    

    
    const options = {
        animationEnabled: true,
        backgroundColor: "#ffffff00",
        height: "200",
        width: "350",
        
        axisX: {
            labelFontColor: "#ffff00"
        },
        axisY: {
            title: "cases",
            titleFontColor: "red",
            labelFontColor: "#ffff00",
            gridThickness: 0
        },
        data: [{
            type: "splineArea",
            xValueFormatString: "YYYY",
            yValueFormatString: "#",
            color: "red",
            dataPoints: positiveData
        }]
    };

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
}

export default ChartPositive;
