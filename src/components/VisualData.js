import React from "react";
import { Bar } from "react-chartjs-2";

const VisualData = ({ data }) => {
  return (
    <div>
      <h2>Visual Sort</h2>
      <Bar data={data} />
    </div>
  );
};

export default VisualData;
