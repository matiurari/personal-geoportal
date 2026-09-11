import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "../theme/theme"
import Providers from "./providers";
import Navbar from "./web-public/components/Navbar";

export const metadata = {
  title: "Geoportal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box
                sx={{
                  width: "100%",
                  minHeight: "100vh",
                  position: "relative",
                }}
              >
                <Navbar />

                <Box
                  component="main"
                  sx={{
                    width: "100%",
                    minHeight: "100vh",
                  }}
                >
                  {children}
                </Box>
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Providers>
      </body>
    </html>
  );
}