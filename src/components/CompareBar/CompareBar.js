import React from "react";
import { Container } from "./CompareBarStyles.js";

function getColorPercent(colors, count) {
  const totalCount = colors.reduce((sum, color) => sum + color.count, 0);
  if (totalCount === 0) return 0; // Avoid division by zero
  return (count / totalCount) * 100; // Return percentage as a decimal
}

function CompareBar(props) {
  const { colors } = props;

  console.log("Colors in CompareBar:", colors);

  return (
    <Container style={{ width: "1000px", height: "20px", display: "flex", border: "1px solid black" }}>
      {colors.map((color, _id) => (
        <div
          key={_id}
          style={{
            backgroundColor: color.color,
            width: `${getColorPercent(colors, color.count)}%`, // Proportional width
            height: "100%", // Full height of the bar
          }}
        ></div>
      ))}
    </Container>
  );
}

export default CompareBar;
