select * from Municipio;

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

select Pobreza, PobExt, PobMod, RezagoEd, CarSS, CarCalidadViv, CarAlim, PIB, UET from TPobreza 
where YearP='2020' and ClaveMunicipal='15001';

SELECT ROUND(Pobreza, 4), ROUND(PobExt, 4), ROUND(PobMod, 4), ROUND(RezagoEd, 4), ROUND(CarSS, 4), ROUND(CarCalidadViv, 4), ROUND(CarAlim, 4), ROUND(PIB, 4), ROUND(UET, 4)from TPobreza 
where YearP='2020' and ClaveMunicipal='15001';

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

select m.NombreM, a.YearA, a.Periodo, a.NombreA, a.NoApoyos, TipoA
from Apoyos as a
inner join Municipio as m 
on a.ClaveMunicipal = m.ClaveMunicipal 
where a.YearA='2022' and a.ClaveMunicipal='15002';

select *from prueba
where ClaveMunicipal='15001' and SECCION='1';

select *from prueba
where ClaveMunicipal='15001' and SECCION BETWEEN 1 and 15;

select *from prueba
where  SECCION='1';

select *from prueba
where SECCION BETWEEN 1 and 15;



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


SELECT m.NombreM, d.YearD, d.DelitosAI, d.Homicidios,d.Feminicidios, d.Secuestros, d.DespH, d.DespM, d.DespT, d.Robo, d.RoboT from Delincuencia as d inner join Municipio as m on d.ClaveMunicipal = m.ClaveMunicipal 
where d.YearD='2022' and d.ClaveMunicipal='15006';
select *from Delincuencia;




select *from votos;

select  sum(v.PAN),sum(v.PRI), sum(v.PRD), sum(v.PT), sum(v.PVEM), sum(v.MC), sum(v.NA), sum(v.MORENA), sum(v.ES), sum(v.VR), sum(PH), sum(PES), sum(PFD), sum(RSP), sum(FXM), sum(NAEM), sum(v.INDEP)  
from votos as v 
inner join Municipio as m  on v.ClaveMunicipal = m.ClaveMunicipal 
where m.ClaveMunicipal = '15001' and yearV='2015'
order by v.ClaveMunicipal;

select  sum(v.PAN),sum(v.PRI), sum(v.PRD), sum(v.PT), sum(v.PVEM), sum(v.MC), sum(v.NA), sum(v.MORENA), sum(v.ES), sum(v.VR), sum(PH), sum(PES), sum(PFD), sum(RSP), sum(FXM), sum(NAEM), sum(v.INDEP)  
from votos as v 
inner join Municipio as m  on v.ClaveMunicipal = m.ClaveMunicipal 
where m.ClaveMunicipal = '15001' and (yearV='2015' or yearV='2017' or yearV='2018' or yearV='2021')
order by v.ClaveMunicipal;

select  sum(v.PAN),sum(v.PRI), sum(v.PRD), sum(v.PT), sum(v.PVEM), sum(v.MC), sum(v.NA), sum(v.MORENA), sum(v.ES), sum(v.VR), sum(PH), sum(PES), sum(PFD), sum(RSP), sum(FXM), sum(NAEM), sum(v.INDEP)  
from votos as v 
inner join Municipio as m  on v.ClaveMunicipal = m.ClaveMunicipal 
where m.ClaveMunicipal = '15001' 
order by v.ClaveMunicipal;


select m.NombreM, sum(v.PAN),sum(v.PRI), sum(v.PRD), sum(v.PT), sum(v.PVEM), sum(v.MC), sum(v.NA), sum(v.MORENA), sum(v.ES), sum(v.VR), sum(PH), sum(PES), sum(PFD), sum(RSP), sum(FXM), sum(NAEM), sum(v.INDEP)  
from votos as v 
inner join Municipio as m  on v.ClaveMunicipal = m.ClaveMunicipal 
where SECCION= 2000 and (yearV='2015');

select m.NombreM, v.PAN, v.PRI, v.PRD, v.PT, v.PVEM, v.MC, v.NA, v.MORENA, v.ES, v.VR, PH, PES, PFD, RSP, FXM, NAEM, v.INDEP
from votos as v 
inner join Municipio as m  on v.ClaveMunicipal = m.ClaveMunicipal 
where v.ClaveMunicipal BETWEEN 15001 and 15003
and (yearV='2017');


select m.NombreM,  v.PAN, v.PRI, v.PRD, v.PT, v.PVEM, v.MC, v.NA, v.MORENA, v.ES, v.VR, PH, PES, PFD, RSP, FXM, NAEM, v.INDEP 
from votos as v inner join Municipio as m  on v.ClaveMunicipal = m.ClaveMunicipal 
where v.ClaveMunicipal BETWEEN 15001 and 15003 and  (yearV='2017');


select CONCAT(m.NombreM,'. SECCION:',v.SECCION) as nombre_municipio, sum(v.PAN),sum(v.PRI), sum(v.PRD), sum(v.PT), sum(v.PVEM), sum(v.MC), sum(v.NA), sum(v.MORENA), sum(v.ES), sum(v.VR), sum(v.PH), sum(v.PES), sum(v.PFD), sum(v.RSP), sum(v.FXM), sum(v.NAEM), sum(v.INDEP) 
from votos as v inner join Municipio as m  on v.ClaveMunicipal = m.ClaveMunicipal 
where SECCION= {seccion} and 

select CONCAT(m.NombreM,'. SECCION: ',v.SECCION) as nombre_municipio, sum(v.PAN),sum(v.PRI), sum(v.PRD), sum(v.PT), sum(v.PVEM), sum(v.MC), sum(v.NA), sum(v.MORENA), sum(v.ES), sum(v.VR), sum(PH), sum(PES), sum(PFD), sum(RSP), sum(FXM), sum(NAEM), sum(v.INDEP) 
from votos as v inner join Municipio as m  on v.ClaveMunicipal = m.ClaveMunicipal 
where SECCION BETWEEN 1 and 200
GROUP BY m.NombreM;

CONCAT(m.NombreM,'. SECCION:',v.SECCION) as nombre_municipio,
 sum(v.PAN),sum(v.PRI), sum(v.PRD), sum(v.PT), sum(v.PVEM), sum(v.MC), sum(v.NA), sum(v.MORENA), sum(v.ES), sum(v.VR), sum(PH), sum(PES), sum(PFD), sum(RSP), sum(FXM), sum(NAEM), sum(v.INDEP) 

select *from votos order by seccion DESC;







