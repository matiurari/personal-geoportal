import { Box, Toolbar } from "@mui/material";
import Navbar from "./components/Navbar";

export default function WebPublicLayout({ children }) {
  return (
    <Box>
      <Navbar />
      <Toolbar />
      <Box component="main">{children}</Box>
    </Box>
  );
}