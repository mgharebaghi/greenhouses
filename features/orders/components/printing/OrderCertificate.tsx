import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import type { Ref } from "react";
import type { OrderDetails } from "../../types/details";
export default function OrderCertificate({
  certificateRef,
  fullData,
  qrUrl,
}: {
  certificateRef: Ref<HTMLDivElement>;
  fullData: OrderDetails | null;
  qrUrl: string;
}) {
  return (
    <div
      ref={certificateRef}
      style={{
        direction: "rtl",
        fontFamily: "tahoma",
        width: "210mm",
        height: "297mm",
        background: "white",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        transform: "scale(0.82)",
        transformOrigin: "center center",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: "14mm",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "220px",
          height: "220px",
          background: "#f8fafc",
          borderBottomLeftRadius: "100px",
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "180px",
          height: "180px",
          background: "#ecfdf5",
          borderTopRightRadius: "80px",
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "10px",
          border: "2px solid #0f172a",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "16px",
          border: "1px solid #cbd5e1",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* HEADER */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #0f172a",
          paddingBottom: "12px",
          marginBottom: "14px",
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: "#0f172a",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            گواهی سفارش
          </h1>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#065f46",
              margin: "6px 0",
            }}
          >
            فکور پیوند آریا
          </p>
          <div
            style={{
              width: "70px",
              height: "4px",
              background: "#059669",
              borderRadius: "999px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div
            style={{
              padding: "6px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              background: "white",
            }}
          >
            <QRCodeCanvas value={qrUrl} size={70} level="M" />
          </div>
          <span
            style={{
              fontSize: "10px",
              color: "#64748b",
              fontFamily: "monospace",
            }}
          >
            {fullData?.OrderCode}
          </span>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              borderRight: "4px solid #10b981",
              paddingRight: "10px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                marginBottom: "3px",
              }}
            >
              کد رهگیری
            </div>
            <div style={{ fontSize: "14px", fontWeight: 900 }}>
              {fullData?.OrderCode || "—"}
            </div>
          </div>
          <div
            style={{
              borderRight: "4px solid #94a3b8",
              paddingRight: "10px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                marginBottom: "3px",
              }}
            >
              تاریخ
            </div>
            <div style={{ fontSize: "14px", fontWeight: 900 }}>
              {fullData?.OrderDate
                ? new Date(fullData.OrderDate).toLocaleDateString("fa-IR")
                : "—"}
            </div>
          </div>
          <div
            style={{
              borderRight: "4px solid #94a3b8",
              paddingRight: "10px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                marginBottom: "3px",
              }}
            >
              مشتری
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700 }}>
              {fullData?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People
                ? `${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}`
                : "—"}
            </div>
          </div>
          <div
            style={{
              borderRight: "4px solid #94a3b8",
              paddingRight: "10px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                marginBottom: "3px",
              }}
            >
              مدیر پروژه
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700 }}>
              {fullData?.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People
                ? `${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}`
                : "—"}
            </div>
          </div>
        </div>

        {/* Rootstock */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "14px",
            marginBottom: "12px",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "5px",
              height: "100%",
              background: "#10b981",
            }}
          />
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 900,
              color: "#064e3b",
              margin: "0 0 10px 0",
            }}
          >
            ۱ - بذر پایه
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  marginBottom: "3px",
                }}
              >
                گیاه / واریته
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {fullData
                  ?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
                  ?.Tbl_plantVariety?.Tbl_Plants?.CommonName || ""}{" "}
                -{" "}
                {fullData
                  ?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
                  ?.Tbl_plantVariety?.VarietyName || "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  marginBottom: "3px",
                }}
              >
                تامین‌کننده
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {fullData
                  ?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
                  ?.Tbl_suppliers
                  ? fullData
                      .Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
                      .Tbl_suppliers.CompanyName ||
                    `${fullData.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage.Tbl_suppliers.FirstName} ${fullData.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage.Tbl_suppliers.LastName}`
                  : "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  marginBottom: "3px",
                }}
              >
                کد بسته
              </div>
              <div style={{ fontSize: "13px", fontFamily: "monospace" }}>
                {fullData
                  ?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
                  ?.SerialNumber || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Scion */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "14px",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "5px",
              height: "100%",
              background: "#3b82f6",
            }}
          />
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 900,
              color: "#1e3a8a",
              margin: "0 0 10px 0",
            }}
          >
            ۲ - بذر پیوندک
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  marginBottom: "3px",
                }}
              >
                گیاه / واریته
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
                  ?.Tbl_plantVariety?.Tbl_Plants?.CommonName || ""}{" "}
                -{" "}
                {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
                  ?.Tbl_plantVariety?.VarietyName || "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  marginBottom: "3px",
                }}
              >
                تامین‌کننده
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
                  ?.Tbl_suppliers
                  ? fullData.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
                      .Tbl_suppliers.CompanyName ||
                    `${fullData.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage.Tbl_suppliers.FirstName} ${fullData.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage.Tbl_suppliers.LastName}`
                  : "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  marginBottom: "3px",
                }}
              >
                کد بسته
              </div>
              <div style={{ fontSize: "13px", fontFamily: "monospace" }}>
                {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
                  ?.SerialNumber || "—"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: "2px solid #0f172a",
          paddingTop: "12px",
          marginTop: "14px",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: "55%" }}>
          <div
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              fontWeight: 700,
              marginBottom: "4px",
            }}
          >
            OFFICIAL DOCUMENT
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#475569",
              lineHeight: 1.6,
            }}
          >
            این سند برای تایید اصالت سفارش صادر شده است.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "40px",
              borderBottom: "1px dashed #cbd5e1",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.08,
                transform: "rotate(-12deg)",
                fontWeight: 900,
                fontSize: "11px",
              }}
            >
              APPROVED
            </div>
          </div>
          <div style={{ fontSize: "11px", fontWeight: 700 }}>امضا و مهر</div>
        </div>
      </div>
    </div>
  );
}
