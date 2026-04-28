import React, { useEffect, useState } from "react";
import HeatMapLib from "@uiw/react-heat-map";

const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const getPanelColors = (maxCount) => {
  const colors = {};
  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0,${greenValue},0)`;
  }
  return colors;
};

export default function HeatMap() {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    const data = generateActivityData("2025-01-01", "2025-01-31");
    setActivityData(data);

    const maxCount = Math.max(...data.map((d) => d.count));
    setPanelColors(getPanelColors(maxCount));
  }, []);

  return (
    <div>
      <h4 style={{ marginBottom: "10px" }}>
        🔥 Contributions in the last month
      </h4>

      <HeatMapLib
        style={{ width: "100%" }}
        value={activityData}
        startDate={new Date("2025-01-01")}
        rectSize={15}
        space={3}
        rectProps={{ rx: 2.5 }}
        panelColors={panelColors}
      />
    </div>
  );
}