--
-- PostgreSQL database dump
--

\restrict gyVYve4akFFVoi4UXVfvEjFV0ERBNuojk3gFEm7eTpO4BmDVKTKl6gTEy9gxaVK

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-19 19:53:55

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
-- TOC entry 223 (class 1259 OID 20405)
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devices (
    uid character varying(16) DEFAULT gen_random_uuid() CONSTRAINT devices_id_not_null NOT NULL,
    "deviceId" character varying(16) NOT NULL,
    dev_name character varying(100),
    location character varying(100),
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(255)
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- TOC entry 5028 (class 0 OID 20405)
-- Dependencies: 223
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devices (id, user_id, name, location, "createdAt", status) FROM stdin;
4898-9916-26	P0001	Sensor Lantai 5 Unit 5D	Lt.5 Unit 5D, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
6928-8720-45	P0002	Sensor Lantai 8 Unit 8A	Lt.8 Unit 8A, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
6607-1446-65	P0003	Sensor Lantai 14 Unit 14C	Lt.14 Unit 14C, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
1055-2486-46	P0004	Sensor Lantai 12 Unit 12B	Lt.12 Unit 12B, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
7112-6519-25	P0005	Sensor Lantai 6 Unit 6A	Lt.6 Unit 6A, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
4515-6765-71	P0006	Sensor Lantai 9 Unit 9A	Lt.9 Unit 9A, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
2892-4028-37	P0007	Sensor Lantai 2 Unit 2A	Lt.2 Unit 2A, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
5595-8937-55	P0008	Sensor Lantai 13 Unit 13D	Lt.13 Unit 13D, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
3919-1920-28	P0009	Sensor Lantai 14 Unit 14D	Lt.14 Unit 14D, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
4438-3061-74	P0010	Sensor Lantai 2 Unit 2D	Lt.2 Unit 2D, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
7412-1363-69	P0011	Sensor Lantai 5 Unit 5B	Lt.5 Unit 5B, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
6522-9321-53	P0012	Sensor Lantai 9 Unit 9D	Lt.9 Unit 9D, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
7069-1598-25	P0013	Sensor Lantai 11 Unit 11A	Lt.11 Unit 11A, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
7121-9169-44	P0014	Sensor Lantai 1 Unit 1D	Lt.1 Unit 1D, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
1086-5133-73	P0015	Sensor Lantai 2 Unit 2C	Lt.2 Unit 2C, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
3399-4616-21	P0016	Sensor Lantai 1 Unit 1A	Lt.1 Unit 1A, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
1746-1334-39	P0017	Sensor Lantai 14 Unit 14A	Lt.14 Unit 14A, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
2851-4181-82	P0018	Sensor Lantai 1 Unit 1B	Lt.1 Unit 1B, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
3037-8530-42	P0019	Sensor Lantai 11 Unit 11B	Lt.11 Unit 11B, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
9050-2675-79	P0020	Sensor Lantai 15 Unit 15A	Lt.15 Unit 15A, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
1436-8234-55	P0021	Sensor Lantai 14 Unit 14B	Lt.14 Unit 14B, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
4520-3312-35	P0022	Sensor Lantai 15 Unit 15D	Lt.15 Unit 15D, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
2264-1523-93	P0023	Sensor Lantai 8 Unit 8C	Lt.8 Unit 8C, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
6528-3623-18	P0024	Sensor Lantai 13 Unit 13B	Lt.13 Unit 13B, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
2352-9108-61	P0025	Sensor Lantai 6 Unit 6C	Lt.6 Unit 6C, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
9894-2604-94	P0026	Sensor Lantai 1 Unit 1C	Lt.1 Unit 1C, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
7089-3222-11	P0027	Sensor Lantai 3 Unit 3C	Lt.3 Unit 3C, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
7412-4498-99	P0028	Sensor Lantai 5 Unit 5C	Lt.5 Unit 5C, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
9708-1717-20	P0029	Sensor Lantai 7 Unit 7D	Lt.7 Unit 7D, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
5133-3313-18	P0030	Sensor Lantai 11 Unit 11C	Lt.11 Unit 11C, Braga City Walk, Bandung	2024-07-13 06:38:11	\N
\.


--
-- TOC entry 4878 (class 2606 OID 20415)
-- Name: devices devices_deviceId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT "devices_deviceId_key" UNIQUE ("deviceId");


--
-- TOC entry 4880 (class 2606 OID 20493)
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (uid);


-- Completed on 2026-05-19 19:53:55

--
-- PostgreSQL database dump complete
--

\unrestrict gyVYve4akFFVoi4UXVfvEjFV0ERBNuojk3gFEm7eTpO4BmDVKTKl6gTEy9gxaVK

