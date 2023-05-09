create table poblacion (
	ClaveMunicipal int,
	yearPob int, 
	poblacion_tot int, 
	hombres int, 
	mujeres int, 
	edad_mediana int, 
	mediana_h int, 
	mediana_m int, 
	relacion_hm int, 
	indice_enve int, 
	indice_enveh int, 
	indice_envem int, 
	razon_depen_t int, 
	r_depend_infan int, 
	r_depend_vejez int, 
	#indigena
	pob_tres_habla int, 
	pob_habla_ind int, 
	pob_ind_h_esp int, 
	pob_ind_h_nesp int, 
	pob_habla_nind int, 
	#discapacidad
	t_pob_disc int, 
	pob_disc_t int, 
	pob_disc_par int, 
	pob_mental int, 
	pob_sin_disc int, 
	#afiliaciones
	total_afil int,  
	imss int, 
	issste int, 
	issste_estatal int, 
	pemex_def_mar int, 
	insabi int, 
	imss_bienestar int, 
	privado int, 
	otra_afil int, 
	no_afil int, 
	#localizacion
	vive_entidad int, 
	vive_otra_ent int, 
	vive_eu int, 
	vive_otro_pa int, 
	#alimentacion
	hogar int, 
	p_h_lim_alim int, 
	p_h_sn_l_alim int, 
	h_lim_alim int, 
	h_sn_l_alim int
);
alter table poblacion add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

ALTER TABLE Delincuencia ADD violencia int;
ALTER TABLE Delincuencia ADD violencia_fam int;
ALTER TABLE Delincuencia ADD total_violencia int;

create table economia(
	ClaveMunicipal int,
	yearEco int, 
	pib bigint,
	pib_per_cap bigint,
	uet bigint,
	dePu_ingre int, 
	servDe_ingre int, 
	oblig_ingre int
);
alter table economia add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

create table empleo(
	ClaveMunicipal int,
	agarpa bigint,
	comercio int,
	elec_agua int,
	contruccion int,
	transformacion int,
	transformacion2 int,
	extractivas int,
	servicios int,
	ser_so_y_com int,
	trans_com int,
	total int,
	salario_promedio  int
);
alter table empleo add foreign key(ClaveMunicipal) references Municipio (ClaveMunicipal) on update cascade on delete cascade;

create table rezago_s(
	ClaveMunicipal int,
	gini int,
	r_ingreso int,
	analfabeta int,
	noEscuela int,
	basica_inc int,
	sin_ss int,
	viv_tierra int,
	viv_sn_wc int,
	viv_sn_ap int,
	viv_sn_drn int,
	viv_sn_elec int,
	viv_sn_lav int,
	viv_sn_ref int,
	ind_rezago bigint,
	grado_rezago varchar(8),
	posicion_n int
);