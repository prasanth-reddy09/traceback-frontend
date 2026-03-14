"use client"; // Must be a client component

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter(); 

    useEffect(() => {
        // 2. Wrap the push in a useEffect so it runs after the component mounts
        router.push("/dashboard");
    }, [router]);

    return null;
}