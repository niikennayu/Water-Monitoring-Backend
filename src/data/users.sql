--
-- PostgreSQL database dump
--

\restrict saJmIOwlJv69CFgILzohWcWqaFb4Ua27vqfuIiKGqF3GvK4kgMe3ddPY5uIW0Kc

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-19 19:52:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 19548)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id_user text CONSTRAINT users_id_not_null NOT NULL,
    email text NOT NULL,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    password text NOT NULL,
    customer_number text,
    address text,
    phone text,
    role text DEFAULT 'customer'::text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5029 (class 0 OID 19548)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id_user, email, name, "createdAt", "updatedAt", password, customer_number, address, phone, role) FROM stdin;
P0001	andi.hidayat96@gmail.com	Andi Hidayat	2024-03-31 16:42:11	2024-04-18 19:43:21	andi123	CN-2024-00001	Lantai 5 Unit 5D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085289915586	admin
P0002	budi.handoko88@gmail.com	Budi Handoko	2024-08-05 20:05:09	2025-01-11 15:05:33	budi123	CN-2024-00002	Lantai 8 Unit 8A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085120893130	user
P0003	citra.permata18@gmail.com	Citra Permata	2024-04-12 01:40:13	2024-11-24 10:14:38	citra123	CN-2024-00003	Lantai 14 Unit 14C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085364402511	user
P0004	dewi.rahayu46@gmail.com	Dewi Rahayu	2024-03-08 23:55:45	2025-01-10 23:05:23	dewi123	CN-2024-00004	Lantai 12 Unit 12B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085217491723	user
P0005	eko.firmansyah16@gmail.com	Eko Firmansyah	2024-03-14 09:11:11	2024-10-09 14:10:24	eko123	CN-2024-00005	Lantai 6 Unit 6A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	081225933627	user
P0006	fajar.junaedi41@gmail.com	Fajar Junaedi	2024-05-11 03:54:52	2024-11-12 09:37:56	fajar123	CN-2024-00006	Lantai 9 Unit 9A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085241394339	user
P0007	gita.irawan37@gmail.com	Gita Irawan	2024-01-25 10:13:24	2024-08-16 21:06:15	gita123	CN-2024-00007	Lantai 2 Unit 2A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	081188610321	user
P0008	hendra.cahyani50@gmail.com	Hendra Cahyani	2024-09-30 02:11:56	2024-10-09 13:58:50	hendra123	CN-2024-00008	Lantai 13 Unit 13D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085159791639	user
P0009	indah.cahyani99@gmail.com	Indah Cahyani	2024-06-08 20:14:41	2024-11-15 00:10:25	indah123	CN-2024-00009	Lantai 14 Unit 14D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085240898236	user
P0010	joko.permata28@gmail.com	Joko Permata	2024-07-15 09:28:48	2024-08-25 23:55:46	joko123	CN-2024-00010	Lantai 2 Unit 2D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085843516928	user
P0011	kartika.wibowo9@gmail.com	Kartika Wibowo	2024-12-16 10:50:30	2025-01-17 19:18:26	kartika123	CN-2024-00011	Lantai 5 Unit 5B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085349329792	user
P0012	lutfi.lestari53@gmail.com	Lutfi Lestari	2024-03-22 09:24:43	2025-03-05 05:20:22	lutfi123	CN-2024-00012	Lantai 9 Unit 9D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085892007520	user
P0013	maya.gunawan25@gmail.com	Maya Gunawan	2024-04-11 11:00:42	2024-10-10 09:19:36	maya123	CN-2024-00013	Lantai 11 Unit 11A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085155210849	user
P0014	nanda.nugroho86@gmail.com	Nanda Nugroho	2024-11-23 08:42:26	2025-01-21 22:38:21	nanda123	CN-2024-00014	Lantai 1 Unit 1D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085833039657	user
P0015	oscar.setiawan85@gmail.com	Oscar Setiawan	2024-02-27 16:34:12	2024-02-28 08:53:55	oscar123	CN-2024-00015	Lantai 2 Unit 2C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085110485635	user
P0016	putri.hidayat66@gmail.com	Putri Hidayat	2024-05-15 23:54:47	2024-12-15 14:30:20	putri123	CN-2024-00016	Lantai 1 Unit 1A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085237554438	user
P0017	qori.maharani99@gmail.com	Qori Maharani	2024-05-27 06:47:01	2024-07-19 15:51:38	qori123	CN-2024-00017	Lantai 14 Unit 14A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085891327628	user
P0018	rizky.santoso8@gmail.com	Rizky Santoso	2024-07-08 17:40:45	2025-04-29 02:53:33	rizky123	CN-2024-00018	Lantai 1 Unit 1B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085150227799	user
P0019	sari.kusuma51@gmail.com	Sari Kusuma	2024-05-15 14:21:08	2024-07-21 05:17:02	sari123	CN-2024-00019	Lantai 11 Unit 11B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085133119397	user
P0020	taufik.cahyani54@gmail.com	Taufik Cahyani	2024-07-03 08:13:17	2025-02-26 03:08:13	taufik123	CN-2024-00020	Lantai 15 Unit 15A, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085334002701	user
P0021	umar.cahyani24@gmail.com	Umar Cahyani	2024-11-16 15:42:10	2024-12-06 08:57:39	umar123	CN-2024-00021	Lantai 14 Unit 14B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085286879583	user
P0022	vina.irawan2@gmail.com	Vina Irawan	2024-09-09 02:21:41	2025-03-15 02:58:24	vina123	CN-2024-00022	Lantai 15 Unit 15D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	081254257809	user
P0023	wahyu.junaedi36@gmail.com	Wahyu Junaedi	2024-10-25 10:26:16	2024-12-06 15:04:14	wahyu123	CN-2024-00023	Lantai 8 Unit 8C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085811611427	user
P0024	xena.santoso51@gmail.com	Xena Santoso	2024-06-24 16:14:35	2024-11-20 22:08:03	xena123	CN-2024-00024	Lantai 13 Unit 13B, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	081116409749	user
P0025	yudi.santoso90@gmail.com	Yudi Santoso	2024-04-06 03:31:10	2024-08-23 12:13:33	yudi123	CN-2024-00025	Lantai 6 Unit 6C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085140816413	user
P0026	zahra.wijaya72@gmail.com	Zahra Wijaya	2024-03-29 22:22:41	2024-12-28 01:10:24	zahra123	CN-2024-00026	Lantai 1 Unit 1C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	082185027765	user
P0027	agus.kusuma93@gmail.com	Agus Kusuma	2024-03-17 17:05:02	2025-04-10 09:46:26	agus123	CN-2024-00027	Lantai 3 Unit 3C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	081328381556	user
P0028	bella.hidayat46@gmail.com	Bella Hidayat	2024-11-07 19:10:21	2024-11-21 06:02:01	bella123	CN-2024-00028	Lantai 5 Unit 5C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	082192541756	user
P0029	cahyo.firmansyah25@gmail.com	Cahyo Firmansyah	2024-02-26 04:31:41	2024-11-19 04:30:41	cahyo123	CN-2024-00029	Lantai 7 Unit 7D, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	082234102201	user
P0030	dian.saputra49@gmail.com	Dian Saputra	2024-04-30 18:28:46	2025-03-04 21:25:38	dian123	CN-2024-00030	Lantai 11 Unit 11C, Apartemen Braga City Walk, Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung 40111	085823014602	user
3374af0e-6716-4458-b434-d04f18168650	coba.aman1@example.com	Pengguna Uji Coba	2026-05-18 17:21:36.611	2026-05-18 17:21:36.611	$2b$10$EH2XcpC1fqchlDBveetisOJiYNzfWy0tDLX.M.Uwk3B1pDFZHtdnK	CUST-9A830601	Jl. Percobaan No. 123, Jakarta	081999888777	customer
45767806-b07e-4ae4-8088-124b8567f1c8	coba.aman2@example.com	Pengguna Uji Coba2	2026-05-19 07:07:18.031	2026-05-19 07:07:18.031	$2b$10$rhAF9UeJULlaJh6mYFO1/etTX5wxbgrkTqunRYL4Zgeb2Md2JGlDm	CUST-18D3DD57	Jl. Percobaan No. 1234, Jakarta	081999888778	customer
\.


--
-- TOC entry 4878 (class 2606 OID 19626)
-- Name: users users_customer_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_customer_number_key UNIQUE (customer_number);


--
-- TOC entry 4881 (class 2606 OID 19559)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);


--
-- TOC entry 4879 (class 1259 OID 19578)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


-- Completed on 2026-05-19 19:52:43

--
-- PostgreSQL database dump complete
--

\unrestrict saJmIOwlJv69CFgILzohWcWqaFb4Ua27vqfuIiKGqF3GvK4kgMe3ddPY5uIW0Kc

