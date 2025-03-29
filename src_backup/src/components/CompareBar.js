
import React from "react";
import { Container } from "./CompareBarStyles.js";

var totalCount = 0;
function getColorPercent(colors, count) {
  totalCount = 0;
  colors.forEach((element) => {
    totalCount += element.count;
  });
  return Math.round((count * 100) / totalCount);
}
function CompareBar(props) {
  const { colors } = props;
  return (
    <Container>
      {colors.map((color, _id) => (
        <div
          key={_id}
          style={{
            backgroundColor: color.color,
            width: `${getColorPercent(colors, color.count)}%`,
          }}
        ></div>
      ))}
    </Container>
  );
}

export default CompareBar;
