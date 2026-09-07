"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar, Toolbar, Typography, Box, Button, IconButton, Drawer, List,
  ListItemButton, ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExploreIcon from "@mui/icons-material/Explore";
import { IBM_Plex_Mono } from "next/font/google";

const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500"] });

const menuItems = [
  { label: "Beranda", path: "/web-public" },
  { label: "Peta", path: "/web-public/peta" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: "#0F2A24", color: "#F4EFE2", borderBottom: "1px solid rgba(244,239,226,0.12)" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <ExploreIcon sx={{ color: "#D98E3B", fontSize: 22 }} />
            <Typography sx={{ fontWeight: 600, fontSize: 17 }}>Geoportal</Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            {menuItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={mono.className}
                  sx={{
                    color: active ? "#D98E3B" : "rgba(244,239,226,0.7)",
                    fontSize: 12.5,
                    letterSpacing: 0.4,
                    borderBottom: active ? "2px solid #D98E3B" : "2px solid transparent",
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  {item.label.toUpperCase()}
                </Button>
              );
            })}
          </Box>

          <IconButton sx={{ display: { xs: "flex", md: "none" }, color: "#F4EFE2" }} onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 240, pt: 2, bgcolor: "#0F2A24", height: "100%", color: "#F4EFE2" }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setOpen(false);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}