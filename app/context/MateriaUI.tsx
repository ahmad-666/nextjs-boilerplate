"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { robotoFont } from "@/app/theme/fontFamily";
import libraryConfig from "../library/config";

const {
  themes: { light: lightTheme, dark: darkTheme, defaultTheme },
  breakpoints: { xs, sm, md, lg, xl },
  fontSize,
  fontWeight: { light, medium, regular, bold },
} = libraryConfig;

declare module "@mui/material/styles" {
  interface PaletteColor {
    lighten5?: string;
    lighten4?: string;
    lighten3?: string;
    lighten2?: string;
    lighten1?: string;
    main: string;
    darken1?: string;
    darken2?: string;
    darken3?: string;
    darken4?: string;
    darken5?: string;
  }
  interface BreakpointsOptions {
    values: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      mobile?: number;
      tablet?: number;
      laptop?: number;
      desktop?: number;
    };
  }
}
type Mode = "light" | "dark";
const DEFAULT_MODE = defaultTheme;
type MuiContext = {
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
};
const initTheme: ThemeOptions = createTheme({
  direction: "ltr",
  breakpoints: {
    values: {
      //values here are numbers + should start from 0
      xs,
      sm,
      md,
      lg,
      xl,
      mobile: xs,
      tablet: sm,
      laptop: md,
      desktop: lg,
      // sx={{borderRadius: {xs: 1,sm: 2,md: 3,lg: 4,xl: 5}}}
      // <Box justifyContent={{ xs: "start", md: "center", xl: "end"}}>
      // <Box bgcolor={{mobile: "primary.lighten2",tablet: "primary.main",laptop: "primary.darken2"}}>
    },
  },
  typography: {
    fontFamily: [robotoFont.style.fontFamily, "Roboto", "sans-serif"].join(
      ", "
    ),
    fontWeightLight: light, //<Typography fontWeight="light" sx={{ fontWeight: "light" }}>
    fontWeightMedium: medium,
    fontWeightRegular: regular,
    fontWeightBold: bold,
    ...fontSize,
    //<Typography variant="h1">
    //will use those font-size,line-height,font-weight,letter-spacing that we define for 'h1'
    //if we don't want to use <Typography> we can use <h1 className="text-h1">
  },
  // shadows: [
  //   shadows.NONE, //0 ... sx={{boxShadow:0}}
  //   shadows.XS, //1
  //   shadows.SM, //2
  //   shadows.MD, //3
  //   shadows.LG, //4
  //   shadows.XL, //5
  //   shadows.XL2, //6
  // ],
  spacing: 4, // sx={{m:10}} //10*4px
  shape: {
    //Mui does not have classes like .rounded-sm and only has this borderRadius size offset
    borderRadius: 4, //sx={{borderRadius:10}} // 10*4px
  },
  components: {
    MuiButton: { defaultProps: { variant: "contained" } },
    MuiStack: { defaultProps: { useFlexGap: true } },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "filled",
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});
export const MuiContext = createContext<MuiContext>({
  mode: DEFAULT_MODE,
  setMode: () => {},
});
export default function MaterialUI({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>(DEFAULT_MODE);
  const colors = useMemo(() => {
    if (mode === "dark") return darkTheme;
    return lightTheme;
  }, [mode]);
  const theme = useMemo(() => {
    return createTheme(initTheme, {
      direction: "ltr",
      palette: {
        mode,
        primary: colors.primary,
        //<Button color="primary">
        //<Box bgcolor="primary.lighten1" sx={{bgcolor:'primary.lighten1',bgcolor: (theme) => theme.palette.primary.darken1}}>
        //change it via manually append className="bg-slate-500 text-slate-100"
        secondary: colors.secondary,
        success: colors.success,
        info: colors.info,
        error: colors.error,
        warning: colors.warning,
        text: {
          primary: colors.text.main, //this will be body{color}
          //sx={{bgcolor:'text.primary'}}
          //change it via manually append className="bg-slate-500"
          secondary: colors.title.main,
          disabled: colors.text.lighten2,
        },
        background: {
          default: colors.background.main, //default color of site background ... //sx={{bgcolor:'background.default'}}
          //change it via --> layout.tsx --> <body className="bg-slate-500">
          paper: colors.card.main, //default color of each card
          //change it via <Card className="bg-slate-500" />
        },
        divider: colors.divider.darken2, //default color of <Divider>
        //change it via <Divider className="border-slate-500" />
      },
    });
  }, [colors, mode]);
  useEffect(() => {
    //for apply mode to tailwind colors
    const rootElm = document.documentElement;
    //we add 'dark' class for tailwind default behavior , bg-amber-500 dark:bg-amber-200
    //we toggle theme-light,theme-dark for tailwind tw-colors plugin
    if (mode === "light") {
      rootElm.classList.remove("dark");
      rootElm.classList.add("theme-light");
      rootElm.classList.remove("theme-dark");
    } else {
      rootElm.classList.add("dark");
      rootElm.classList.add("theme-dark");
      rootElm.classList.remove("theme-light");
    }
  }, [mode]);
  return (
    <MuiContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MuiContext.Provider>
  );
}
