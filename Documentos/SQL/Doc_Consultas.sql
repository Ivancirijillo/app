
select *from prueba;
#Elias
select  m.NombreM, p.SECCION, p.PRI, p.PAN, p.MORENA, p.PRD, p.IND, p.TOTAL_VOTOS, p.LISTA_NOMINAL  
from prueba as p
inner join Municipio as m 
on p.ClaveMunicipal = m.ClaveMunicipal 
order by p.ClaveMunicipal;

#Marcos Delincuencia
select *from Delincuencia where YearD='2022';

select d.ClaveMunicipal, m.NombreM, d.YearD, d.DelitosAI, d.Homicidios, d.Feminicidios, d.Secuestros, d.DespT, (d.Robo + d.RoboT) as robtt
from Delincuencia as d
inner join Municipio as m 
on d.ClaveMunicipal = m.ClaveMunicipal 
where YearD='2022' and d.ClaveMunicipal='15001';

#Marcos numero de habitantes



select *from TPobreza where YearP='2022';
select *from PadronElectoral where YearE='2022';
select *from Apoyos where YearA='2022';
