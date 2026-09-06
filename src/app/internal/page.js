"use client";

import { Box, Button } from '@mui/material'
import { signOut } from 'next-auth/react'
import React from 'react'

const page = () => {
    return (
        <Box sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button variant='contained' onClick={() => signOut()}>Logout</Button>
        </Box>
    )
}

export default page