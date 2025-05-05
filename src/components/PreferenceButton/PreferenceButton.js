import React from "react";
import { Button } from "./PreferenceButtonStyles";

function PreferenceButton(props) {
  const { label, func } = props;
  return <Button onClick={func}>{label}</Button>;
}

export default PreferenceButton;
