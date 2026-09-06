"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import MapIcon from "@mui/icons-material/Map";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const drawerWidth = 260;

const menuItems = [
  { label: "Dashboard", path: "/web-internal", icon: <DashboardIcon /> },
  { label: "Katalog Data", path: "/web-internal/katalog-data", icon: <StorageIcon /> },
  { label: "Katalog Peta", path: "/web-internal/katalog-peta", icon: <MapIcon /> },
  { label: "Kelola Akun", path: "/web-internal/kelola-akun", icon: <ManageAccountsIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={pathname === item.path}
            onClick={() => router.push(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}