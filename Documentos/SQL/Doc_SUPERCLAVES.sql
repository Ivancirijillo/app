ALTER TABLE apoyos
ADD CONSTRAINT uq_superclaveAp UNIQUE (ClaveMunicipal, YearA, Periodo, NombreA);

ALTER TABLE delincuencia
ADD CONSTRAINT uq_superclaveDe UNIQUE (ClaveMunicipal, YearD);

ALTER TABLE padronelectoral
ADD CONSTRAINT uq_superclavePa UNIQUE (ClaveMunicipal, YearE);

ALTER TABLE rezago_s
ADD CONSTRAINT uq_superclaveRe UNIQUE (ClaveMunicipal, YearR);

ALTER TABLE economia
ADD CONSTRAINT uq_superclaveEc UNIQUE (ClaveMunicipal, YearEco);

ALTER TABLE empleo
ADD CONSTRAINT uq_superclaveEm UNIQUE (ClaveMunicipal, YearEmp);

ALTER TABLE poblacion
ADD CONSTRAINT uq_superclavePo UNIQUE (ClaveMunicipal, YearPob);

ALTER TABLE votos
ADD CONSTRAINT uq_superclaveVo UNIQUE (ClaveMunicipal, YearV, SECCION);

ALTER TABLE tpobreza
ADD CONSTRAINT uq_superclave UNIQUE (ClaveMunicipal, YearP);
