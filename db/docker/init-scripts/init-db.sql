-- CREATE SCHEMA IF NOT EXISTS schools;
-- ALTER USER prepmcintelly SET search_path TO schools;

-- Table: public.HD2021

-- DROP TABLE IF EXISTS public."HD2021";

CREATE TABLE IF NOT EXISTS public."HD2021"
(
    "UNITID" integer,
    "INSTNM" character varying COLLATE pg_catalog."default",
    "IALIAS" character varying COLLATE pg_catalog."default",
    "ADDR" character varying COLLATE pg_catalog."default",
    "CITY" character varying COLLATE pg_catalog."default",
    "STABBR" character varying COLLATE pg_catalog."default",
    "ZIP" character varying COLLATE pg_catalog."default",
    "FIPS" smallint,
    "OBEREG" smallint,
    "CHFNM" character varying COLLATE pg_catalog."default",
    "CHFTITLE" character varying COLLATE pg_catalog."default",
    "GENTELE" character varying COLLATE pg_catalog."default",
    "EIN" character varying COLLATE pg_catalog."default",
    "DUNS" character varying COLLATE pg_catalog."default",
    "OPEID" character varying COLLATE pg_catalog."default",
    "OPEFLAG" smallint,
    "WEBADDR" character varying COLLATE pg_catalog."default",
    "ADMINURL" character varying COLLATE pg_catalog."default",
    "FAIDURL" character varying COLLATE pg_catalog."default",
    "APPLURL" character varying COLLATE pg_catalog."default",
    "NPRICURL" character varying COLLATE pg_catalog."default",
    "VETURL" character varying COLLATE pg_catalog."default",
    "ATHURL" character varying COLLATE pg_catalog."default",
    "DISAURL" character varying COLLATE pg_catalog."default",
    "SECTOR" smallint,
    "ICLEVEL" smallint,
    "CONTROL" smallint,
    "HLOFFER" smallint,
    "UGOFFER" smallint,
    "GROFFER" smallint,
    "HDEGOFR1" smallint,
    "DEGGRANT" smallint,
    "HBCU" smallint,
    "HOSPITAL" smallint,
    "MEDICAL" smallint,
    "TRIBAL" smallint,
    "LOCALE" smallint,
    "OPENPUBL" smallint,
    "ACT" character varying COLLATE pg_catalog."default",
    "NEWID" integer,
    "DEATHYR" integer,
    "CLOSEDAT" character varying COLLATE pg_catalog."default",
    "CYACTIVE" smallint,
    "POSTSEC" smallint,
    "PSEFLAG" smallint,
    "PSET4FLG" smallint,
    "RPTMTH" smallint,
    "INSTCAT" smallint,
    "C21BASIC" smallint,
    "C21IPUG" smallint,
    "C21IPGRD" smallint,
    "C21UGPRF" smallint,
    "C21ENPRF" smallint,
    "C21SZSET" smallint,
    "C18BASIC" smallint,
    "C15BASIC" smallint,
    "CCBASIC" smallint,
    "CARNEGIE" smallint,
    "LANDGRNT" smallint,
    "INSTSIZE" smallint,
    "F1SYSTYP" smallint,
    "F1SYSNAM" character varying COLLATE pg_catalog."default",
    "F1SYSCOD" character varying COLLATE pg_catalog."default",
    "CBSA" integer,
    "CBSATYPE" smallint,
    "CSA" smallint,
    "NECTA" integer,
    "COUNTYCD" integer,
    "COUNTYNM" character varying COLLATE pg_catalog."default",
    "CNGDSTCD" integer,
    "LONGITUD" numeric,
    "LATITUDE" numeric,
    "DFRCGID" smallint,
    "DFRCUSCG" smallint
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."HD2021"
    OWNER to prepmcintelly;