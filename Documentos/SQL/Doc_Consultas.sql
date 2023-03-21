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

#Marcos numero de habitantes
select t.ClaveMunicipal, m.NombreM, t.YearP, t.Poblacion
from TPobreza as t
inner join Municipio as m 
on t.ClaveMunicipal = m.ClaveMunicipal 
where t.YearP='2020' and t.ClaveMunicipal='15001';

#Marcos Pobreza PENDIENTE
select *from TPobreza where YearP='2022';

#Marcos Padron Electoral PENDIENTE
select *from PadronElectoral where YearE='2022';

#Marcos Apoyos PENDIENTE
select *from Apoyos where YearA='2022';


