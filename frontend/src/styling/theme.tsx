import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiChip: {
      styleOverrides: {
        root: () => ({
          color: "white",
          backgroundColor: "#742edc"
        })
      }
    },
    MuiSwitch: {
      styleOverrides: {
        track: {
          backgroundColor: "#fff"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: () => ({
          backgroundColor: "#033359",
          input: {
            color: "white",
            "&:-webkit-autofill": {
              "-webkit-background-clip": "text",
              "-webkit-text-fill-color": "#ffffff",
              transition: "background-color 5000s ease-in-out 0s",
              "box-shadow": "inset 0 0 20px 20px #23232329"
            }
          },
          label: {
            color: "white"
          }
        })
      }
    },

    MuiButton: {
      styleOverrides: {
        root: () => ({
          backgroundColor: "#742edc",
          "&:hover": {
            transition: "0.5s",
            backgroundColor: "#6029b3"
          },
          "&.Mui-disabled": {
            backgroundColor: "#8d8f8e",
            color: "white"
          }
        })
      }
    },

    MuiTablePagination: {
      styleOverrides: {
        root: () => ({
          color: "white",
          "&.MuiTablePagination-select": {
            color: "white"
          },
          "&.MuiTablePagination-actions": {
            color: "white"
          },
          "&.MuiTablePagination-menuItem": {
            color: "white"
          }
        })
      }
    },

    MuiIconButton: {
      styleOverrides: {
        root: () => ({
          "&.MuiIconButton-colorInherit": {
            color: "white"
          },
          icon: {
            fill: "white"
          }
        })
      }
    }
  }
});

export default theme;
