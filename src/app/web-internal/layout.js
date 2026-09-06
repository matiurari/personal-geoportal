import { Box, Toolbar } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function WebInternalLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#F4F6F8", minHeight: "100vh" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}