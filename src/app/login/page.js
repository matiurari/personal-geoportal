import { Box } from "@mui/material";
import { palette } from "../../theme/theme"
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: palette.bg,
                px: 2,
            }}
        >
            <LoginForm />
        </Box>
    );
}