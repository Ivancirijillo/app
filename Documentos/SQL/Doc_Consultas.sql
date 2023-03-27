select *from prueba;
#Elias
select  m.NombreM, p.SECCION, p.PRI, p.PAN, p.MORENA, p.PRD, p.IND, p.TOTAL_VOTOS, p.LISTA_NOMINAL  
from prueba as p
inner join Municipio as m 
on p.ClaveMunicipal = m.ClaveMunicipal 
order by p.ClaveMunicipal;

#Marcos Delincuencia
select d.ClaveMunicipal, m.NombreM, d.YearD, d.DelitosAI, d.Homicidios, d.Feminicidios, d.Secuestros, d.DespT, (d.Robo + d.RoboT) as robtt
from Delincuencia as d
inner join Municipio as m 
on d.ClaveMunicipal = m.ClaveMunicipal 
where d.YearD='2022' and d.ClaveMunicipal='15001';

select DelitosAI, Homicidios, Feminicidios, Secuestros, DespT, Robo, RoboT
from Delincuencia 
where YearD='2022' and ClaveMunicipal='15001';

#Marcos numero de habitantes
select t.ClaveMunicipal, m.NombreM, t.YearP, t.Poblacion
from TPobreza as t
inner join Municipio as m 
on t.ClaveMunicipal = m.ClaveMunicipal 
where t.YearP='2020' and t.ClaveMunicipal='15001';

#Marcos Pobreza PENDIENTE
select *from TPobreza where ClaveMunicipal='15001';

select m.NombreM, p.YearP, p.Poblacion, p.Pobreza, p.PobExt, p.PobExtCar, p.PobMod, p.NpobNvul, p.RezagoEd, p.CarSalud, p.CarSaludPor, p.CarSS, p.CarCalidadViv, p.CarServViv, p.CarAlim, p.IngresoInf, p.IngresoInfE, p.PIB, p.UET 
from TPobreza as p
inner join Municipio as m 
on p.ClaveMunicipal = m.ClaveMunicipal 
where p.YearP='2020' and p.ClaveMunicipal='15001';

select  SUM(Poblacion) from TPobreza where YearP='2020';

#Marcos Padron Electoral PENDIENTE
select  SUM(PTotal), SUM(LNTotal) from PadronElectoral where YearE='2022';

select m.NombreM, p.YearE, p.PHombres, p.PMujeres, p.PTotal, p.LNHombres, p.LNMujeres, p.LNTotal
from PadronElectoral as p
inner join Municipio as m 
on p.ClaveMunicipal = m.ClaveMunicipal 
where p.YearE='2022' and p.ClaveMunicipal='15002';
 


#Marcos Apoyos PENDIENTE
select *from Apoyos where YearA='2022' and ClaveMunicipal='15001';
select NombreA, NoApoyos from Apoyos where YearA='2022' and ClaveMunicipal='15001';





#Tarjeta municipio

	#nombre municipio
select NombreM from Municipio where ClaveMunicipal='15001'; 
	#año
select d.ClaveMunicipal, m.NombreM, d.YearD, d.DelitosAI, d.Homicidios, d.Feminicidios, d.Secuestros, d.DespH, d.DespM, d.DespT, d.Robo,  d.RoboT
from Delincuencia as d
inner join Municipio as m 
on d.ClaveMunicipal = m.ClaveMunicipal 
where d.YearD='2022' and d.ClaveMunicipal='15001';
d=11505
h=211
f=10
s=10
dt=99
r=10887
rt=609
select *from delincuencia order by robot DESC;
