create database BaseMunicipios;
use BaseMunicipios;
#SET SQL_SAFE_UPDATES = 0;

#tabla Municipio
create table Municipio(ClaveMunicipal int primary key not null, 
 NombreM varchar(30)
);

#tabla Delincuencia
create table Delincuencia(
 ClaveMunicipal int,
 YearD int,
 DelitosAI int default 0,
 Homicidios int default 0,
 Feminicidios int default 0,
 Secuestros int default 0,
 DespH int default 0,
 DespM int default 0,
 DespT int default 0,
 Robo int default 0,
 RoboT int default 0
);
alter table Delincuencia add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

#tabla TPobreza
create table TPobreza(
 ClaveMunicipal int,
 YearP int,
 Poblacion int default 0,
 Pobreza double(12,10) default 0,
 PobExt double(12,10) default 0,
 PobExtCar double(12,10) default 0,
 PobMod double(12,10) default 0,
 NpobNvul double(12,10) default 0,
 RezagoEd double(12,10) default 0,
 CarSalud double(12,10) default 0,
 CarSaludPor double(12,10) default 0,
 CarSS double(12,10) default 0,
 CarCalidadViv double(12,10) default 0,
 CarServViv double(12,10) default 0,
 CarAlim double(12,10) default 0,
 IngresoInf double(12,10) default 0,
 IngresoInfE double(12,10) default 0,
 PIB bigint default 0,
 UET bigint default 0 
);
alter table TPobreza add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

#tabla PadronElectoral
create table PadronElectoral(
 ClaveMunicipal int,
 YearE int,
 PHombres int default 0,
 PMujeres int default 0,
 PTotal int default 0,
 LNHombres int default 0,
 LNMujeres int default 0,
 LNTotal int default 0
);
alter table PadronElectoral add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

#tabla Apoyos
create table Apoyos(
 ClaveMunicipal int,
 YearA int,
 Periodo VARCHAR(22),
 NombreA VARCHAR(100),
 NoApoyos int default 0,
 TipoA VARCHAR(7)
);
alter table Apoyos add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

