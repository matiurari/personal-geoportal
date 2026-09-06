"use client";
import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";

export default function Topbar() {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#fff", color: "#000" }}
      elevation={1}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap>
          Web Internal
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}