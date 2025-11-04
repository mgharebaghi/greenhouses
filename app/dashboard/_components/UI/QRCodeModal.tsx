"use client";
import { useState, useEffect, useRef } from "react";
import { Modal, Button, Space, message, Card, Spin } from "antd";
import { DownloadOutlined, PrinterOutlined, QrcodeOutlined, LinkOutlined } from "@ant-design/icons";
import QRCodeLib from "qrcode";

export type QRCodeModalProps = {
  visible: boolean;
  url: string;
  onClose: () => void;
  title?: string;
};

export default function QRCodeModal({ visible, url, onClose, title }: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (visible && url) {
      generateQRCode();
    }
  }, [visible, url]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const dataUrl = await QRCodeLib.toDataURL(url, {
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
        await QRCodeLib.toCanvas(canvasRef.current, url, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: "M",
        });
      }
    } catch (err) {
      console.error("خطا در تولید QR Code:", err);
      message.error("خطا در تولید QR Code");
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
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>چاپ QR Code</title>
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
              }
            </style>
          </head>
          <body>
            <h2>${title || "QR Code"}</h2>
            <img src="${qrDataUrl}" alt="QR Code" />
            <p class="url-text">${url}</p>
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
          <span>{title || "QR Code"}</span>
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
      <div style={{ textAlign: "center" }}>
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
            <span style={{ color: "#666", fontSize: "14px" }}>در حال تولید QR Code...</span>
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
                  {url}
                </span>
              </div>
            </Card>

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
            QR Code موجود نیست
          </div>
        )}
        {/* Canvas مخفی برای دانلود با کیفیت بهتر */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </Modal>
  );
}
