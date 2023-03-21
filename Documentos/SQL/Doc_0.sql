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
 DelitosAI int,
 Homicidios int,
 Feminicidios int,
 Secuestros int,
 DespH int,
 DespM int,
 DespT int,
 Robo int,
 RoboT int
);
alter table Delincuencia add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

#tabla TPobreza
create table TPobreza(
 ClaveMunicipal int,
 YearP int,
 Poblacion int,
 Pobreza double(12,10),
 PobExt double(12,10),
 PobExtCar double(12,10),
 PobMod double(12,10),
 NpobNvul double(12,10),
 RezagoEd double(12,10),
 CarSalud double(12,10),
 CarSaludPor double(12,10),
 CarSS double(12,10),
 CarCalidadViv double(12,10),
 CarServViv double(12,10),
 CarAlim double(12,10),
 IngresoInf double(12,10),
 IngresoInfE double(12,10),
 PIB bigint,
 UET bigint 
);
alter table TPobreza add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

#tabla PadronElectoral
create table PadronElectoral(
 ClaveMunicipal int,
 YearE int,
 PHombres int,
 PMujeres int,
 PTotal int,
 LNHombres int,
 LNMujeres int,
 LNTotal int
);
alter table PadronElectoral add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

#tabla Apoyos
create table Apoyos(
 ClaveMunicipal int,
 YearA int,
 Periodo VARCHAR(22),
 NombreA VARCHAR(100),
 NoApoyos int,
 TipoA VARCHAR(7)
);
alter table Apoyos add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

