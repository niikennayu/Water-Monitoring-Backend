import prisma from "../config/db.js";

export class AdminController {

  static async getAdminStats(req, res) {

    try {

      const activeDevices =
        await prisma.device.count({
          where: {
            status: "Active"
          }
        });

      const totalUsers =
        await prisma.user.count();

    const startOfDay =
  new Date();

startOfDay.setHours(
  0, 0, 0, 0
);

const endOfDay =
  new Date();

endOfDay.setHours(
  23, 59, 59, 999
);

const todayUsage =
  await prisma.waterUsage.aggregate({
    _sum: {
      volume: true
    },
    where: {
      timestamp: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });

  const startOfYesterday =
  new Date();

startOfYesterday.setDate(
  startOfYesterday.getDate() - 1
);

startOfYesterday.setHours(
  0, 0, 0, 0
);

const endOfYesterday =
  new Date();

endOfYesterday.setDate(
  endOfYesterday.getDate() - 1
);

endOfYesterday.setHours(
  23, 59, 59, 999
);

const yesterdayUsage =
  await prisma.waterUsage.aggregate({
    _sum: {
      volume: true
    },
    where: {
      timestamp: {
        gte: startOfYesterday,
        lte: endOfYesterday
      }
    }
  });

  const todayTotal =
  todayUsage._sum.volume || 0;

const yesterdayTotal =
  yesterdayUsage._sum.volume || 0;

const usageDifference =
  todayTotal - yesterdayTotal;

  const startOfMonth =
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

const endOfMonth =
  new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
    23, 59, 59, 999
  );

const currentMonthUsage =
  await prisma.waterUsage.aggregate({
    _sum: {
      volume: true
    },
    where: {
      timestamp: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    }
  });

  const startOfLastMonth =
  new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1
  );

const endOfLastMonth =
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0,
    23, 59, 59, 999
  );

const lastMonthUsage =
  await prisma.waterUsage.aggregate({
    _sum: {
      volume: true
    },
    where: {
      timestamp: {
        gte: startOfLastMonth,
        lte: endOfLastMonth
      }
    }
  });

  const currentMonthTotal =
  currentMonthUsage._sum.volume || 0;

const lastMonthTotal =
  lastMonthUsage._sum.volume || 0;

const monthDifference =
  currentMonthTotal - lastMonthTotal;

  const unpaidBills =
  await prisma.bill.aggregate({
    _sum: {
      totalAmount: true
    },
    where: {
      status: {
        not: "PAID"
      }
    }
  });

  const unpaidTotal =
  unpaidBills._sum.totalAmount || 0;

  const totalBills =
  await prisma.bill.count();

const paidBills =
  await prisma.bill.count({
    where: {
      status: "PAID"
    }
  });

  const paidPercentage =
  totalBills > 0
    ? (paidBills / totalBills) * 100
    : 0;

    return res.json({
  activeDevices,
  totalUsers,

  todayUsage: todayTotal,
  usageDifference,

  currentMonthUsage:
    currentMonthTotal,

  monthDifference,

  unpaidTotal,
  paidBills,
totalBills,
paidPercentage
});

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        message:
          "Failed to load admin stats"
      });

    }

  }

  static async getUsageChart(req, res) {

  try {

    const { range } = req.query;

    const monthsBack =
      range === "3"
        ? 3
        : 6;

    const startDate =
      new Date();

    startDate.setMonth(
      startDate.getMonth() - monthsBack
    );

    const usages =
      await prisma.waterUsage.findMany({
        where: {
          timestamp: {
            gte: startDate
          }
        }
      });

    const chart = [
      { day: "Sen", value: 0 },
      { day: "Sel", value: 0 },
      { day: "Rab", value: 0 },
      { day: "Kam", value: 0 },
      { day: "Jum", value: 0 },
      { day: "Sab", value: 0 },
      { day: "Ming", value: 0 },
    ];

    for (const item of usages) {

      const date =
        new Date(item.timestamp);

      const day =
        date.getDay();

      // JS:
      // 0 = Minggu
      // 1 = Senin
      // ...

      let index = 0;

      switch (day) {

        case 1:
          index = 0;
          break;

        case 2:
          index = 1;
          break;

        case 3:
          index = 2;
          break;

        case 4:
          index = 3;
          break;

        case 5:
          index = 4;
          break;

        case 6:
          index = 5;
          break;

        case 0:
          index = 6;
          break;

      }

      chart[index].value +=
        Number(item.volume || 0);

    }

    return res.json(chart);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to load usage chart"
    });

  }

}

static async getPaymentHistory(req, res) {

  try {

    const bills =
  await prisma.bill.findMany({
  });

    const result =
  bills.map((bill) => ({

    id: bill.userId,

    pemakaian:
      `${bill.waterUsage} m³`,

    status:
      bill.status
        ?.trim()
        .toUpperCase() === "PAID"
          ? "Lunas"
          : "Belum Dibayar",

    tagihan:
      new Intl.NumberFormat(
        "id-ID",
        {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0
        }
      ).format(
        bill.totalAmount
      )

}));

    return res.json(result);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to load payment history"
    });

  }

}

static async getMonitoringUnits(req, res) {

  try {

    const users =
      await prisma.user.findMany({

        include: {
  bills: {
    orderBy: {
      createdAt: "desc"
    },
    take: 1
  }
}

      });

    const result =
      users
        .map((user) => {

          if (
            !user.address ||
            !user.address
              .toLowerCase()
              .includes("unit")
          ) {
            return null;
          }

          const match =
            user.address.match(
              /unit\s(.*?)(,|$)/i
            );

          const unit =
            match?.[1]
              ?.trim();

          const latestBill =
            user.bills?.[0];

          return {

            id: user.id,

            unit,

            idMeter:
              user.customer_number,

            konsumsi:
  latestBill
    ? `${Math.abs(
        latestBill.waterUsage
      )} m³`
    : "-",

            email:
              user.email,

            status:
  latestBill?.status
    ?.trim()
    .toUpperCase() === "PAID"
      ? "Lunas"
      : "Belum Dibayar"

          };

        })
        .filter(Boolean);

    return res.json(result);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to load monitoring units"
    });

  }

}

static async getBillingStats(req, res) {

  try {

    const bills =
      await prisma.bill.findMany();

    const totalTagihan =
      bills.reduce(
        (sum, bill) =>
          sum + (bill.totalAmount || 0),
        0
      );

    const paidBills =
      bills.filter(
        (bill) =>
          bill.status === "PAID"
      );

    const unpaidBills =
      bills.filter(
        (bill) =>
          bill.status === "UNPAID"
      );

    const overdueBills =
      bills.filter(
        (bill) =>
          bill.status === "OVERDUE"
      );

    const paidTotal =
      paidBills.reduce(
        (sum, bill) =>
          sum + (bill.totalAmount || 0),
        0
      );

    const unpaidTotal =
      unpaidBills.reduce(
        (sum, bill) =>
          sum + (bill.totalAmount || 0),
        0
      );

    const overdueTotal =
      overdueBills.reduce(
        (sum, bill) =>
          sum + (bill.totalAmount || 0),
        0
      );

      const now =
  new Date();

const startOfMonth =
  new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

const endOfMonth =
  new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23, 59, 59, 999
  );

const monthlyBills =
  bills.filter(
    (bill) =>
      new Date(
        bill.createdAt
      ) >= startOfMonth &&

      new Date(
        bill.createdAt
      ) <= endOfMonth
  );

const monthlyTotal =
  monthlyBills.reduce(
    (sum, bill) =>
      sum + (bill.totalAmount || 0),
    0
  );

const monthlyPaid =
  monthlyBills
    .filter(
      (bill) =>
        bill.status === "PAID"
    )
    .reduce(
      (sum, bill) =>
        sum + (bill.totalAmount || 0),
      0
    );

const collectionPercentage =
  monthlyTotal > 0
    ? (
        monthlyPaid /
        monthlyTotal
      ) * 100
    : 0;

    return res.json({

      total: {
        amount: totalTagihan,
        count: bills.length
      },

      paid: {
        amount: paidTotal,
        count: paidBills.length
      },

      unpaid: {
        amount: unpaidTotal,
        count: unpaidBills.length
      },

      overdue: {
        amount: overdueTotal,
        count: overdueBills.length
      },

      collection: {
  paid: monthlyPaid,
  total: monthlyTotal,
  percentage:
    collectionPercentage
}

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to load billing stats"
    });

  }

}

static async getBillingTable(req, res) {

  try {

    const bills =
      await prisma.bill.findMany({

        include: {
          customer: true
        },

        orderBy: {
          createdAt: "desc"
        }

      });

    const result =
      bills
        .map((bill) => {

          const address =
            bill.customer?.address || "";

          // skip kalau ga ada kata unit
          if (
            !address
              .toLowerCase()
              .includes("unit")
          ) {
            return null;
          }

          const match =
            address.match(
              /unit\s(.*?)(,|$)/i
            );

          const unit =
            match?.[1]
              ?.trim();

          return {

            id:
              bill.billNumber,

            unit:
              `Unit ${unit}`,

            email:
              bill.customer?.email,

            terbit:
              new Date(
                bill.billingDate
              ).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }
              ),

            jatuhTempo:
              new Date(
                bill.dueDate
              ).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }
              ),

            status:
  bill.status
    ?.trim()
    .toUpperCase() === "PAID"
      ? "Lunas"
      : "Belum Dibayar",

tglBayar:
  bill.status
    ?.trim()
    .toUpperCase() === "PAID"
      ? new Date(
          bill.updatedAt
        ).toLocaleDateString(
          "id-ID",
          {
            day: "numeric",
            month: "short",
            year: "numeric"
          }
        )
      : "-"

          };

        })
        .filter(Boolean);

    return res.json(result);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to load billing table"
    });

  }

}

static async updateUnitPrice(req, res) {

  try {

    const { price } = req.body;

    const newPrice =
      await prisma.unitPrice.create({

        data: {
          price: Number(price)
        }

      });

    return res.json({
      message:
        "Harga air berhasil diperbarui",
      data: newPrice
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to update unit price"
    });

  }

}
}