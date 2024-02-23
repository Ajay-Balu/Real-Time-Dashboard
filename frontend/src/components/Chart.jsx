import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;



const Chart = (props) => {
    const generateRandomData = () => {
        return Math.floor(Math.random() * 100) + 1;
    };
    const [dataPoints, setDataPoints] = useState([
        { x: new Date(), y: 0},
        { x: new Date(), y: 0},
        { x: new Date(), y: 0},
        { x: new Date(), y: 0},
        { x: new Date(), y: 0},
        { x: new Date(), y: 0},
        { x: new Date(), y: 0},
        { x: new Date(), y: 0},
        { x: new Date(), y: 0},
        { x: new Date(), y: 0}
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints(prevDataPoints => {
                const newDataPoints = [...prevDataPoints];
                newDataPoints.shift(); // Remove the first element
                newDataPoints.push({ x: new Date(), y: generateRandomData() }); // Add new random data
                return newDataPoints;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    
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
            color: "#ffff00",
            dataPoints: dataPoints
        }]
    };

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
}

export default Chart;
