"use client";

import dynamic from "next/dynamic";

// Mematikan SSR secara eksplisit seperti pada komponen MapWrapper temanmu
const PreviewCesiumWrapper = dynamic(() => import("./PreviewCesiumModal"), {
    ssr: false,
});

export default PreviewCesiumWrapper;