//should not use 'vw' width and should use '%'

"use client";
import { styled } from "@mui/material/styles";

const SectionContainer = styled("div")({
  marginLeft: "auto",
  marginRight: "auto",
  padding: 20,
  borderRadius: 10,
  width: "90%",
  "@media (width>1200px)": {
    width: "1200px",
  },
});
export default SectionContainer;
