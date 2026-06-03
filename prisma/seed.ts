import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
   {
  id: "P0001",
  email: "andi.hidayat96@gmail.com",
  name: "Andi Hidayat",

  customer_number: "CN-2024-00001",

  address:
    "Lantai 5 Unit 5D, Apartemen Braga City Walk",

  phone: "085289915586",

  password: "andi123",

  role: "admin",

  createdAt: new Date("2024-03-31T09:42:11.000Z"),
  updatedAt: new Date("2024-04-18T12:43:21.000Z"),
},
      {
        id: 'P0002',
        email: 'budi.handoko88@gmail.com',
        name: 'Budi Handoko',
        customer_number: 'CN-2024-00002',
        address: 'Lantai 8 Unit 8A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085120893130',
        password: 'budi123',
        role: 'user',
        createdAt: new Date('2024-08-05T20:05:09'),
        updatedAt: new Date('2025-01-11T15:05:33')
      },
      {
        id: 'P0003',
        email: 'citra.permata18@gmail.com',
        name: 'Citra Permata',
        customer_number: 'CN-2024-00003',
        address: 'Lantai 14 Unit 14C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085364402511',
        password: 'citra123',
        role: 'user',
        createdAt: new Date('2024-04-12T01:40:13'),
        updatedAt: new Date('2024-11-24T10:14:38')
      },
      {
        id: 'P0004',
        email: 'dewi.rahayu46@gmail.com',
        name: 'Dewi Rahayu',
        customer_number: 'CN-2024-00004',
        address: 'Lantai 12 Unit 12B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085217491723',
        password: 'dewi123',
        role: 'user',
        createdAt: new Date('2024-03-08T23:55:45'),
        updatedAt: new Date('2025-01-10T23:05:23')
      },
      {
        id: 'P0005',
        email: 'eko.firmansyah16@gmail.com',
        name: 'Eko Firmansyah',
        customer_number: 'CN-2024-00005',
        address: 'Lantai 6 Unit 6A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '081225933627',
        password: 'eko123',
        role: 'user',
        createdAt: new Date('2024-03-14T09:11:11'),
        updatedAt: new Date('2024-10-09T14:10:24')
      },
      {
        id: 'P0006',
        email: 'fajar.junaedi41@gmail.com',
        name: 'Fajar Junaedi',
        customer_number: 'CN-2024-00006',
        address: 'Lantai 9 Unit 9A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085241394339',
        password: 'fajar123',
        role: 'user',
        createdAt: new Date('2024-05-11T03:54:52'),
        updatedAt: new Date('2024-11-12T09:37:56')
      },
      {
        id: 'P0007',
        email: 'gita.irawan37@gmail.com',
        name: 'Gita Irawan',
        customer_number: 'CN-2024-00007',
        address: 'Lantai 2 Unit 2A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '081188610321',
        password: 'gita123',
        role: 'user',
        createdAt: new Date('2024-01-25T10:13:24'),
        updatedAt: new Date('2024-08-16T21:06:15')
      },
      {
        id: 'P0008',
        email: 'hendra.cahyani50@gmail.com',
        name: 'Hendra Cahyani',
        customer_number: 'CN-2024-00008',
        address: 'Lantai 13 Unit 13D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085159791639',
        password: 'hendra123',
        role: 'user',
        createdAt: new Date('2024-09-30T02:11:56'),
        updatedAt: new Date('2024-10-09T13:58:50')
      },
      {
        id: 'P0009',
        email: 'indah.cahyani99@gmail.com',
        name: 'Indah Cahyani',
        customer_number: 'CN-2024-00009',
        address: 'Lantai 14 Unit 14D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085240898236',
        password: 'indah123',
        role: 'user',
        createdAt: new Date('2024-06-08T20:14:41'),
        updatedAt: new Date('2024-11-15T00:10:25')
      },
      {
        id: 'P0010',
        email: 'joko.permata28@gmail.com',
        name: 'Joko Permata',
        customer_number: 'CN-2024-00010',
        address: 'Lantai 2 Unit 2D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085843516928',
        password: 'joko123',
        role: 'user',
        createdAt: new Date('2024-07-15T09:28:48'),
        updatedAt: new Date('2024-08-25T23:55:46')
      },
      {
        id: 'P0011',
        email: 'kartika.wibowo9@gmail.com',
        name: 'Kartika Wibowo',
        customer_number: 'CN-2024-00011',
        address: 'Lantai 5 Unit 5B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085349329792',
        password: 'kartika123',
        role: 'user',
        createdAt: new Date('2024-12-16T10:50:30'),
        updatedAt: new Date('2025-01-17T19:18:26')
      },
      {
        id: 'P0012',
        email: 'lutfi.lestari53@gmail.com',
        name: 'Lutfi Lestari',
        customer_number: 'CN-2024-00012',
        address: 'Lantai 9 Unit 9D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085892007520',
        password: 'lutfi123',
        role: 'user',
        createdAt: new Date('2024-03-22T09:24:43'),
        updatedAt: new Date('2025-03-05T05:20:22')
      },
      {
        id: 'P0013',
        email: 'maya.gunawan25@gmail.com',
        name: 'Maya Gunawan',
        customer_number: 'CN-2024-00013',
        address: 'Lantai 11 Unit 11A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085155210849',
        password: 'maya123',
        role: 'user',
        createdAt: new Date('2024-04-11T11:00:42'),
        updatedAt: new Date('2024-10-10T09:19:36')
      },
      {
        id: 'P0014',
        email: 'nanda.nugroho86@gmail.com',
        name: 'Nanda Nugroho',
        customer_number: 'CN-2024-00014',
        address: 'Lantai 1 Unit 1D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085833039657',
        password: 'nanda123',
        role: 'user',
        createdAt: new Date('2024-11-23T08:42:26'),
        updatedAt: new Date('2025-01-21T22:38:21')
      },
      {
        id: 'P0015',
        email: 'oscar.setiawan85@gmail.com',
        name: 'Oscar Setiawan',
        customer_number: 'CN-2024-00015',
        address: 'Lantai 2 Unit 2C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085110485635',
        password: 'oscar123',
        role: 'user',
        createdAt: new Date('2024-02-27T16:34:12'),
        updatedAt: new Date('2024-02-28T08:53:55')
      },
      {
        id: 'P0016',
        email: 'putri.hidayat66@gmail.com',
        name: 'Putri Hidayat',
        customer_number: 'CN-2024-00016',
        address: 'Lantai 1 Unit 1A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085237554438',
        password: 'putri123',
        role: 'user',
        createdAt: new Date('2024-05-15T23:54:47'),
        updatedAt: new Date('2024-12-15T14:30:20')
      },
      {
        id: 'P0017',
        email: 'qori.maharani99@gmail.com',
        name: 'Qori Maharani',
        customer_number: 'CN-2024-00017',
        address: 'Lantai 14 Unit 14A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085891327628',
        password: 'qori123',
        role: 'user',
        createdAt: new Date('2024-05-27T06:47:01'),
        updatedAt: new Date('2024-07-19T15:51:38')
      },
      {
        id: 'P0018',
        email: 'rizky.santoso8@gmail.com',
        name: 'Rizky Santoso',
        customer_number: 'CN-2024-00018',
        address: 'Lantai 1 Unit 1B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085150227799',
        password: 'rizky123',
        role: 'user',
        createdAt: new Date('2024-07-08T17:40:45'),
        updatedAt: new Date('2025-04-29T02:53:33')
      },
      {
        id: 'P0019',
        email: 'sari.kusuma51@gmail.com',
        name: 'Sari Kusuma',
        customer_number: 'CN-2024-00019',
        address: 'Lantai 11 Unit 11B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085133119397',
        password: 'sari123',
        role: 'user',
        createdAt: new Date('2024-05-15T14:21:08'),
        updatedAt: new Date('2024-07-21T05:17:02')
      },
      {
        id: 'P0020',
        email: 'taufik.cahyani54@gmail.com',
        name: 'Taufik Cahyani',
        customer_number: 'CN-2024-00020',
        address: 'Lantai 15 Unit 15A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085334002701',
        password: 'taufik123',
        role: 'user',
        createdAt: new Date('2024-07-03T08:13:17'),
        updatedAt: new Date('2025-02-26T03:08:13')
      },
      {
        id: 'P0021',
        email: 'umar.cahyani24@gmail.com',
        name: 'Umar Cahyani',
        customer_number: 'CN-2024-00021',
        address: 'Lantai 14 Unit 14B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085286879583',
        password: 'umar123',
        role: 'user',
        createdAt: new Date('2024-11-16T15:42:10'),
        updatedAt: new Date('2024-12-06T08:57:39')
      },
      {
        id: 'P0022',
        email: 'vina.irawan2@gmail.com',
        name: 'Vina Irawan',
        customer_number: 'CN-2024-00022',
        address: 'Lantai 15 Unit 15D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '081254257809',
        password: 'vina123',
        role: 'user',
        createdAt: new Date('2024-09-09T02:21:41'),
        updatedAt: new Date('2025-03-15T02:58:24')
      },
      {
        id: 'P0023',
        email: 'wahyu.junaedi36@gmail.com',
        name: 'Wahyu Junaedi',
        customer_number: 'CN-2024-00023',
        address: 'Lantai 8 Unit 8C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085811611427',
        password: 'wahyu123',
        role: 'user',
        createdAt: new Date('2024-10-25T10:26:16'),
        updatedAt: new Date('2024-12-06T15:04:14')
      },
      {
        id: 'P0024',
        email: 'xena.santoso51@gmail.com',
        name: 'Xena Santoso',
        customer_number: 'CN-2024-00024',
        address: 'Lantai 13 Unit 13B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '081116409749',
        password: 'xena123',
        role: 'user',
        createdAt: new Date('2024-06-24T16:14:35'),
        updatedAt: new Date('2024-11-20T22:08:03')
      },
      {
        id: 'P0025',
        email: 'yudi.santoso90@gmail.com',
        name: 'Yudi Santoso',
        customer_number: 'CN-2024-00025',
        address: 'Lantai 6 Unit 6C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085140816413',
        password: 'yudi123',
        role: 'user',
        createdAt: new Date('2024-04-06T03:31:10'),
        updatedAt: new Date('2024-08-23T12:13:33')
      },
      {
        id: 'P0026',
        email: 'zahra.wijaya72@gmail.com',
        name: 'Zahra Wijaya',
        customer_number: 'CN-2024-00026',
        address: 'Lantai 1 Unit 1C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '082185027765',
        password: 'zahra123',
        role: 'user',
        createdAt: new Date('2024-03-29T22:22:41'),
        updatedAt: new Date('2024-12-28T01:10:24')
      },
      {
        id: 'P0027',
        email: 'agus.kusuma93@gmail.com',
        name: 'Agus Kusuma',
        customer_number: 'CN-2024-00027',
        address: 'Lantai 3 Unit 3C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '081328381556',
        password: 'agus123',
        role: 'user',
        createdAt: new Date('2024-03-17T17:05:02'),
        updatedAt: new Date('2025-04-10T09:46:26')
      },
      {
        id: 'P0028',
        email: 'bella.hidayat46@gmail.com',
        name: 'Bella Hidayat',
        customer_number: 'CN-2024-00028',
        address: 'Lantai 5 Unit 5C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '082192541756',
        password: 'bella123',
        role: 'user',
        createdAt: new Date('2024-11-07T19:10:21'),
        updatedAt: new Date('2024-11-21T06:02:01')
      },
      {
        id: 'P0029',
        email: 'cahyo.firmansyah25@gmail.com',
        name: 'Cahyo Firmansyah',
        customer_number: 'CN-2024-00029',
        address: 'Lantai 7 Unit 7D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '082234102201',
        password: 'cahyo123',
        role: 'user',
        createdAt: new Date('2024-02-26T04:31:41'),
        updatedAt: new Date('2024-11-19T04:30:41')
      },
      {
        id: 'P0030',
        email: 'dian.saputra49@gmail.com',
        name: 'Dian Saputra',
        customer_number: 'CN-2024-00030',
        address: 'Lantai 11 Unit 11C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111',
        phone: '085823014602',
        password: 'dian123',
        role: 'user',
        createdAt: new Date('2024-04-30T18:28:46'),
        updatedAt: new Date('2025-03-04T21:25:38')
      },
      {
        id: '3374af0e-6716-4458-b434-d04f18168650',
        email: 'coba.aman1@example.com',
        name: 'Pengguna Uji Coba',
        customer_number: 'CUST-9A830601',
        address: 'Jl. Percobaan No. 123, Jakarta',
        phone: '081999888777',
        password: '$2b$10$EH2XcpC1fqchlDBveetisOJiYNzfWy0tDLX.M.Uwk3B1pDFZHtdnK',
        role: 'customer',
        createdAt: new Date('2026-05-18T17:21:36.611'),
        updatedAt: new Date('2026-05-18T17:21:36.611')
      },
      {
        id: '45767806-b07e-4ae4-8088-124b8567f1c8',
        email: 'coba.aman2@example.com',
        name: 'Pengguna Uji Coba2',
        customer_number: 'CUST-18D3DD57',
        address: 'Jl. Percobaan No. 1234, Jakarta',
        phone: '081999888778',
        password: '$2b$10$rhAF9UeJULlaJh6mYFO1/etTX5wxbgrkTqunRYL4Zgeb2Md2JGlDm',
        role: 'customer',
        createdAt: new Date('2026-05-19T07:07:18.031'),
        updatedAt: new Date('2026-05-19T07:07:18.031')
      },
    ],
    skipDuplicates: true
  });
}

main().finally(() => prisma.$disconnect());