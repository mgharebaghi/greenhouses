"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeCanvasProps {
    value: string;
    size?: number;
    className?: string; // Allow passing className
    style?: React.CSSProperties;
    level?: 'L' | 'M' | 'Q' | 'H';
    margin?: number;
}

const QRCodeCanvas = ({ value, size = 128, className, style, level = 'M', margin = 0 }: QRCodeCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current && value) {
            QRCode.toCanvas(canvasRef.current, value, {
                width: size,
                margin: margin,
                errorCorrectionLevel: level,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            }, (error) => {
                if (error) console.error("Error generating QR code:", error);
            });
        }
    }, [value, size, level, margin]);

    return <canvas ref={canvasRef} className={className} style={style} />;
};

export default QRCodeCanvas;
