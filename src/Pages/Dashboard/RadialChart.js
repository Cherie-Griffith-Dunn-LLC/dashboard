import React from "react";
import ReactApexChart from "react-apexcharts";

const RadialChart = (props) => {
  const alarms = props.alarms?.alarms;
  const loading = props.alarms?.loading;
  const error = props.alarms?.error;
  //const series = [44, 55, 67];
  if (error) {
    console.error(error);
  }

  // create a series in state
  const [series, setSeries] = React.useState([]);

  React.useEffect(() => {
    var low = 0;
    var high = 0;
    var medium = 0;
    alarms._embedded.alarms.forEach((item) => {
      if (item.priority_label === "low") {
        low++;
      } else if (item.priority_label === "medium") {
        medium++;
      } else if (item.priority_label === "high") {
        high++;
      }
    });
    setSeries([low, medium, high]);
  }
  , [alarms]);

  
  const options = {
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 10,
          size: "45%",
        },
        track: {
          show: true,
          strokeWidth: "70%",
          margin: 12,
        },
        dataLabels: {
          name: {
            fontSize: "27px",
          },
          value: {
            fontSize: "20px",
          },
          total: {
            show: true,
            label: "Total",
            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              // check if loading
                return alarms.page.size;
            },
          },
        },
      },
    },
    labels: ["Low", "Medium", "High"],
    colors: ["#0bb197", "#4aa3ff", "#ff3d60"],
  };
  if (loading !== false) {
    return <div>Loading...</div>;
  }

  

  


  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height="350"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default RadialChart;
