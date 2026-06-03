import PDFDocument from "pdfkit";

export const generateInvoicePdf =
  (bill, user) => {

    return new Promise(
      (resolve) => {

        const doc =
          new PDFDocument();

        const buffers = [];

        doc.on(
          "data",
          buffers.push.bind(buffers)
        );

        doc.on(
          "end",
          () => {

            resolve(
              Buffer.concat(buffers)
            );

          }
        );

        doc.fontSize(20)
          .text(
            "INVOICE AIR BERSIH",
            {
              align: "center"
            }
          );

        doc.moveDown();

        doc.fontSize(12);

        doc.text(
          `No Invoice: ${bill.billNumber}`
        );

        doc.text(
          `Nama: ${user.name}`
        );

        doc.text(
          `Alamat: ${user.address}`
        );

        doc.text(
          `Customer Number: ${user.customer_number}`
        );

        doc.moveDown();

        doc.text(
          `Periode: ${bill.billingPeriod}`
        );

        doc.text(
          `Pemakaian Air: ${bill.waterUsage} m³`
        );

        doc.text(
          `Harga per m³: Rp ${bill.unitPrice.toLocaleString("id-ID")}`
        );

        doc.text(
          `Total Pembayaran: Rp ${bill.totalAmount.toLocaleString("id-ID")}`
        );

        doc.text(
          `Status: ${bill.status}`
        );

        doc.end();

      }
    );

};