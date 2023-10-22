import React from "react";
import ReactApexChart from "react-apexcharts";




const LineColumnArea = (props) => {
  const role = props.role;
  const events = props.events.events._embedded?.eventResources;
  const alarms = role === "admin" ? props.alarms.alarms._embedded.alarms : props.alarms.investigation._embedded.alarms;
  

  // create series for events
  var eventsSeries = new Array(25).fill().map((_, index) => ({
    date: index,
    occurences: 0
  }))

  var alarmsSeries = new Array(25).fill().map((_, index) => ({
    date: index,
    occurences: 0
  }))

  var coursesSeries = new Array(25).fill().map((_, index) => ({
    date: index,
    occurences: 0
  }))

  if (events) {
    events.forEach((item) => {
      const currentDate = item.timestamp_occured / 1000;
      const date = new Date(currentDate * 1000).getHours();
  
      var result = eventsSeries.find((obj) => {
        return obj.date === date;
      });
  
      if (!result) {
        eventsSeries.push({ date: date, occurences: 1 });
      }
  
      for (var i = 0; i < eventsSeries.length; i++) {
        if (eventsSeries[i].date === date) {
          eventsSeries[i].occurences++;
          break;
        }
      }
    });
  }

  alarms.forEach((item) => {
    const currentDate = item.timestamp_occured / 1000;
    const date = new Date(currentDate * 1000).getHours();

    var result = alarmsSeries.find((obj) => {
      return obj.date === date;
    });

    if (!result) {
      alarmsSeries.push({ date: date, occurences: 1 });
    }

    for (var i = 0; i < alarmsSeries.length; i++) {
      if (alarmsSeries[i].date === date) {
        alarmsSeries[i].occurences++;
        break;
      }
    }
  });

  
  // make events series 1 dimensional
  eventsSeries = eventsSeries.map((item) => {
    return item.occurences;
  });

  alarmsSeries = alarmsSeries.map((item) => {
    return item.occurences;
  });

  coursesSeries = coursesSeries.map((item) => {
    return item.occurences;
  });


  const LineColumnAreaData = {
    series: [
      {
        name: "Courses",
        type: "column",
        data: coursesSeries,
      },
      {
        name: "Events",
        type: "area",
        data: eventsSeries,
      },
      {
        name: "Threats",
        type: "line",
        data: alarmsSeries,
      },
    ],
    options: {
      chart: {
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: [0, 0.5, 1],
        curve: "smooth",
        dashArray: [0, 8, 0]
      },
      plotOptions: {
        bar: {
          columnWidth: "18%",
        },
      },
      colors: ["#0ab39c", "rgba(212, 218, 221, 0.18)", "rgb(251, 77, 83)"],
  
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        "1 AM",
        "2 AM",
        "3 AM",
        "4 AM",
        "5 AM",
        "6 AM",
        "7 AM",
        "8 AM",
        "9 AM",
        "10 AM",
        "11 AM",
        "12 PM",
        "1 PM",
        "2 PM",
        "3 PM",
        "4 PM",
        "5 PM",
        "6 PM",
        "7 PM",
        "8 PM",
        "9 PM",
        "10 PM",
        "11 PM",
        "12 AM"
      ],
      markers: {
        size: 0,
      },
      legend: {
        offsetY: 11,
      },
      xaxis: {
        type: "category",
      },
      yaxis: {
        title: {
          text: "Points",
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points"
            }
            return y
          },
        },
      },
      grid: {
        borderColor: "#f1f1f1",
      },
    },
  }

  

  return(
    <React.Fragment>
        <ReactApexChart
          options={LineColumnAreaData.options}
          series={LineColumnAreaData.series}
          type="line"
          height="350"
          stacked= "false"
          className="apex-charts"
        />
      </React.Fragment>
  )
}

export default LineColumnArea;