"use client";
import { useState, useEffect, useRef } from "react";
import { Modal, Button, Space, Card, Spin, Alert } from "antd";
import { DownloadOutlined, PrinterOutlined, QrcodeOutlined, LinkOutlined } from "@ant-design/icons";
import QRCodeLib from "qrcode";

export type QRCodeModalProps = {
  visible: boolean;
  url: string;
  serial?: string;
  onClose: () => void;
  title?: string;
};

export default function QRCodeModal({ visible, url, onClose, title, serial }: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [notice, setNotice] = useState<{ type: "success" | "info" | "warning" | "error"; text: string } | null>(null);

  // Force English digits for this modal only
  const toEn = (val: string | number | null | undefined) => {
    const s = String(val ?? "");
    const map: Record<string, string> = {
      "۰": "0",
      "۱": "1",
      "۲": "2",
      "۳": "3",
      "۴": "4",
      "۵": "5",
      "۶": "6",
      "۷": "7",
      "۸": "8",
      "۹": "9",
      "٠": "0",
      "١": "1",
      "٢": "2",
      "٣": "3",
      "٤": "4",
      "٥": "5",
      "٦": "6",
      "٧": "7",
      "٨": "8",
      "٩": "9",
    };
    return s.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d);
  };

  useEffect(() => {
    if (visible && url) {
      generateQRCode();
    }
  }, [visible, url]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const normalizedUrl = toEn(url);
      const dataUrl = await QRCodeLib.toDataURL(normalizedUrl, {
        type: "image/png",
        width: 300,
        margin: 2,
        errorCorrectionLevel: "M",
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrDataUrl(dataUrl);

      // رسم QR Code روی Canvas برای دانلود با کیفیت بهتر
      if (canvasRef.current) {
        await QRCodeLib.toCanvas(canvasRef.current, normalizedUrl, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: "M",
        });
      }
    } catch (err) {
      console.error("خطا در تولید QR Code:", err);
      setNotice({ type: "error", text: "خطا در تولید کد QR" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // message.success("QR Code دانلود شد");
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const normalizedUrl = toEn(url);
      const normalizedSerial = toEn(serial ?? "");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>چاپ کد QR</title>
            <style>
              @media print {
                @page {
                  margin: 20mm;
                  size: auto;
                }
                body {
                  margin: 0;
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                }
              }
              body {
                font-family: "IRANSans", "Tahoma", sans-serif;
                text-align: center;
                padding: 20px;
              }
              h2 {
                margin-bottom: 20px;
                color: #333;
              }
              img {
                max-width: 300px;
                height: auto;
                border: 2px solid #ddd;
                padding: 10px;
                background: white;
              }
              .url-text {
                margin-top: 15px;
                font-size: 12px;
                color: #666;
                word-break: break-all;
                direction: ltr;
                font-family: monospace;
              }
              .serial-text { margin-top: 6px; font-size: 12px; color: #666; direction: ltr; font-family: monospace; }
            </style>
          </head>
          <body>
            <h2>${title || "کد QR"}</h2>
            <img src="${qrDataUrl}" alt="QR Code" />
            <p class="url-text">${normalizedUrl}</p>
            ${normalizedSerial ? `<p class="serial-text">${normalizedSerial}</p>` : ""}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 250);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Modal
      open={visible}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
          <QrcodeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
          <span>{title  || "کد QR"}</span>
        </div>
      }
      onCancel={onClose}
      width={500}
      footer={[
        <Button key="close" onClick={onClose} size="large">
          بستن
        </Button>,
        <Button
          key="download"
          type="default"
          size="large"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          disabled={!qrDataUrl}
          style={{
            borderColor: "#52c41a",
            color: "#52c41a",
          }}
        >
          دانلود
        </Button>,
        <Button
          key="print"
          type="primary"
          size="large"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          disabled={!qrDataUrl}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderColor: "transparent",
          }}
        >
          چاپ
        </Button>,
      ]}
      centered
      styles={{
        body: {
          padding: "30px 24px",
        },
      }}
    >
      <div data-latin-digits style={{ textAlign: "center" }}>
        {notice && (
          <Alert
            style={{ marginBottom: 16 }}
            showIcon
            closable
            type={notice.type}
            message={notice.text}
            onClose={() => setNotice(null)}
          />
        )}
        {loading ? (
          <div
            style={{
              padding: "80px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Spin size="large" />
            <span style={{ color: "#666", fontSize: "14px" }}>در حال تولید کد QR...</span>
          </div>
        ) : qrDataUrl ? (
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* QR Code Card */}
            <Card
              style={{
                background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.12)",
              }}
              styles={{
                body: {
                  padding: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  display: "inline-block",
                  position: "relative",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  style={{
                    maxWidth: "100%",
                    display: "block",
                    imageRendering: "crisp-edges",
                  }}
                />
              </div>
            </Card>

            {/* URL Display */}
            <Card
              style={{
                background: "#fafafa",
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
              }}
              styles={{
                body: {
                  padding: "12px 16px",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <LinkOutlined style={{ color: "#1890ff", fontSize: "14px" }} />
                <span
                  style={{
                    fontSize: "13px",
                    color: "#595959",
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    direction: "ltr",
                    textAlign: "center",
                  }}
                >
                  {toEn(url)}
                </span>
              </div>
            </Card>

            {/* Serial Number */}
            {serial && (
              <Card
                style={{
                  background: "#fafafa",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                }}
                styles={{
                  body: {
                    padding: "12px 16px",
                  },
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  <LinkOutlined style={{ color: "#1890ff", fontSize: "14px" }} />
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#595959",
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                      direction: "ltr",
                      textAlign: "center",
                    }}
                  >
                    {toEn(serial)}
                  </span>
                </div>
              </Card>
            )}

            {/* Helper Text */}
            <div
              style={{
                fontSize: "12px",
                color: "#8c8c8c",
                marginTop: "8px",
              }}
            >
              برای اسکن QR Code، دوربین موبایل خود را به سمت آن بگیرید
            </div>
          </Space>
        ) : (
          <div
            style={{
              padding: "80px 0",
              color: "#bfbfbf",
              fontSize: "14px",
            }}
          >
            <QrcodeOutlined style={{ fontSize: "48px", marginBottom: "16px", display: "block" }} />
            کد QR موجود نیست
          </div>
        )}
        {/* Canvas مخفی برای دانلود با کیفیت بهتر */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </Modal>
  );
}
