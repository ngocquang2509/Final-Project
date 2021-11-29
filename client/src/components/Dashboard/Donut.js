import React from "react";
import ReactApexChart from "react-apexcharts";

const Donut = ({ unpaid, paid, partial }) => {
  const series = [unpaid.length, paid.length, partial.length];
  const options = {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ["Unpaid Invoices", "Paid Invoices", "Partially Paid"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        textAlign: "center",
        margin: "10px auto",
        padding: "10px",
        display: "flex",
        justifyContent: 'center',
        height: 300,

      }}
    >
      <br />
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        width={450}
      />
    </div>
  );
};

export default Donut;
