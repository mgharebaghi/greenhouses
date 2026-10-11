import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import OrderCertificate from "../features/orders/components/printing/OrderCertificate";
import {
  LABEL_SIZES,
  QR_LABEL_SIZES,
  parseLabelSize,
} from "../features/orders/domain/print-settings";
import type { OrderDetails } from "../features/orders/types/details";
import PrintQrLabel from "../shared/components/PrintQrLabel";

test("printer presets retain automatic size, supported millimeter sizes and full-size QR", () => {
  assert.equal(LABEL_SIZES[0].value, "auto");
  assert.deepEqual(parseLabelSize("auto"), { width: "100mm", height: "100mm" });
  for (const option of LABEL_SIZES.slice(1)) {
    const size = parseLabelSize(option.value);
    assert.match(size.width, /^\d+mm$/);
    assert.match(size.height, /^\d+mm$/);
  }
  assert.equal(QR_LABEL_SIZES.at(-1)?.value, "100%");
});

test("order certificate keeps A4 dimensions, order and customer information after extraction", () => {
  const order: OrderDetails = {
    ID: 1,
    OrderCode: "A<7",
    OrderDate: "2026-10-11",
    OrderCount: 250,
    CustomerID: 1,
    SupplierID: null,
    ProjectManager: null,
    RootstockID: null,
    ScionID: null,
    QRCode: null,
    Tbl_People_Tbl_Orders_CustomerIDToTbl_People: {
      FirstName: "علی",
      LastName: "احمدی",
      NationalCode: "1234567890",
    },
    Tbl_People_Tbl_Orders_ProjectManagerToTbl_People: null,
    Tbl_suppliers: null,
    Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: null,
    Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: null,
  };
  const html = renderToStaticMarkup(
    createElement(OrderCertificate, {
      certificateRef: null,
      fullData: order,
      qrUrl: "https://mygreenhouses.ir/public/scan/orders/1",
    }),
  );
  assert.match(html, /width:210mm/);
  assert.match(html, /height:297mm/);
  assert.match(html, /علی احمدی/);
  assert.match(html, /A&lt;7/);
  assert.match(html, /بذر پایه/);
  assert.match(html, /بذر پیوندک/);
  assert.doesNotThrow(() =>
    renderToStaticMarkup(
      createElement(OrderCertificate, {
        certificateRef: null,
        fullData: null,
        qrUrl: "#",
      }),
    ),
  );
});

test("QR labels preserve pixel rendering, selected size and escaped order code", () => {
  const html = renderToStaticMarkup(
    createElement(PrintQrLabel, {
      labelRef: null,
      qrUrl: "https://mygreenhouses.ir/public/scan/orders/1",
      qrSize: "20mm",
      printOrderLabel: "A<7 (R)",
    }),
  );
  assert.match(html, /width:20mm/);
  assert.match(html, /image-rendering:pixelated/);
  assert.match(html, /A&lt;7 \(R\)/);
});
