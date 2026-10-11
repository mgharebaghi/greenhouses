import type { Ref } from "react";
import QRCodeCanvas from "./QRCodeCanvas";
export default function PrintQrLabel({
  labelRef,
  qrUrl,
  qrSize,
  printOrderLabel,
}: {
  labelRef: Ref<HTMLDivElement>;
  qrUrl: string;
  qrSize: string;
  printOrderLabel: string;
}) {
  return (
    <div
      ref={labelRef}
      style={{
        width: "100%",
        height: "100%",
        padding: "1mm",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <QRCodeCanvas
        value={qrUrl}
        size={512}
        level="L"
        margin={0}
        style={{
          width: qrSize,
          height: qrSize,
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          imageRendering: "pixelated",
        }}
      />
      <div
        style={{
          textAlign: "center",
          fontWeight: "900",
          color: "#000",
          lineHeight: "1.1",
          marginTop: "0.3mm",
          width: qrSize,
          fontSize:
            qrSize === "100%"
              ? "8pt"
              : `${Math.max(3.5, Math.min(16, parseInt(qrSize) * 0.32))}pt`,
          whiteSpace: "normal",
          wordBreak: "break-all",
          fontFamily: "tahoma",
        }}
      >
        <div style={{ marginBottom: "0.2mm" }}>{printOrderLabel}</div>
      </div>
    </div>
  );
}
