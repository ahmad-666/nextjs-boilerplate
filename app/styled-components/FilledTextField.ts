"use client";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import colors from "tailwindcss/colors";
const FilledTextField = styled(TextField)(({ theme, variant }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: colors.slate[200], //'#f00',colors.slate[200],theme.palette.primary.main
    "&::before,&::after": {
      display: "none",
      borderBottom: "none",
    },
  },
}));
export default FilledTextField;
