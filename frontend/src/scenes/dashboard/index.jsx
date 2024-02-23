import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Chart from '../../components/Chart';
import ChartNegative from '../../components/ChartNegative';
import ChartPositive from '../../components/ChartPositive';
import DataChart from '../../components/DataChart';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);



  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" alignItems="left">
        <Header title="DASHBOARD" subtitle="Welcome to GWC dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
       
       <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
            <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Corona
              </Typography>
              
            </Box>
          </Box>

          <Box height="250px" m="-20px 0 0 0" sx={{marginTop: '10px'}}>
          <DataChart/>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
            <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Reported cases
              </Typography>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Area Graph
              </Typography>
              
            </Box>
          </Box>

          <Box >
          <Chart/>
          </Box>
        </Box>
        

        {/*Row 2*/}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
            <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Negative
              </Typography>
              
            </Box>
          </Box>

          <Box >
          <ChartNegative/>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
            <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Positive
              </Typography>
             
             
            </Box>
          </Box>

          <Box >
          <ChartPositive/>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
            <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Cured
              </Typography>
             
              
            </Box>
          </Box>

          <Box >
          <Chart/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
