import React from "react";
import ReactApexChart from "react-apexcharts";

function Chart({ paymentHistory }) {


  console.log(paymentHistory)

    let paymentDates = []
    for(let i = 0; i < paymentHistory.length; i++) {
      const newDate = new Date(paymentHistory[i].datePaid);
      let localDate = newDate.toLocaleDateString();
            paymentDates = [...paymentDates, localDate]
    }


    let paymentReceived = []
    for(let i = 0; i < paymentHistory.length; i++) {
            paymentReceived = [...paymentReceived, paymentHistory[i].amountPaid]
    }

    console.log(paymentHistory.map(item => item.amountPaid))
    console.log(paymentHistory.map(item => new Date(item.datePaid).toLocaleDateString()))
  


  const series = [

    {
      name: "Payment Recieved",
      data: paymentHistory.map(item => item.amountPaid),
    },
  ];
  const options = {
    chart: {
      zoom: { enabled: false },
      toolbar: {show: false},
    },
    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: paymentHistory.map(item => new Date(item.datePaid).toLocaleDateString()),
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        textAlign: "center",
        margin: "10px auto",
        padding: "10px",
        height: 300,
        marginRight: 50,
        width: 500,
      }}
    >
      <br />
      <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={300}
        />
    </div>
  );
}

export default Chart