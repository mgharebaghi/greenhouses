"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeCanvasProps {
    value: string;
    size?: number;
    className?: string; // Allow passing className
}

const QRCodeCanvas = ({ value, size = 128, className }: QRCodeCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current && value) {
            QRCode.toCanvas(canvasRef.current, value, {
                width: size,
                margin: 0,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            }, (error) => {
                if (error) console.error("Error generating QR code:", error);
            });
        }
    }, [value, size]);

    return <canvas ref={canvasRef} className={className} />;
};

export default QRCodeCanvas;
