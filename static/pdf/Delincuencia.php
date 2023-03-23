<?php
require('diag.php');

class PDF extends FPDF
{
// Cabecera de página
function Header()
{
    
    // Arial bold 15
    $this->SetFont('Arial','B',15);
    // Movernos a la derecha
    $this->Cell(80);
    // Título
    //$this->Cell(30,20,utf8_decode('BOLETA ACADÉMICA SEPTIEMBRE-FEBRERO 2023'),0,0,'C');
    // Salto de línea
    $this->Ln(20);
}

// Pie de página
function Footer()
{
    // Posición: a 1,5 cm del final
    $this->SetY(-15);
    // Arial italic 8
    $this->SetFont('Arial','I',8);
    // Número de página
    $this->Cell(0,10,utf8_decode('Página ').$this->PageNo().'/{nb}',0,0,'C');
}
}

date_default_timezone_get();
$pdf = new PDF_Diag();
$pdf-> AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial','',10);
$pdf->SetXY(20, 5);
$pdf->Cell(20, 5, date('d/m/Y, h:i A'), 0,1);

require 'conexion.php';
$consultmunicipio = "SELECT d.ClaveMunicipal, m.NombreM, d.YearD, d.DelitosAI, d.Homicidios, 
d.Feminicidios, d.Secuestros, d.DespH, d.DespM, d.DespT, d.Robo, d.RoboT from Delincuencia as d 
inner join Municipio as m on d.ClaveMunicipal = m.ClaveMunicipal where d.YearD='2022' and d.ClaveMunicipal='15002'";
$resultadomuni = $mysqli->query($consultmunicipio);

while($row = $resultadomuni->fetch_assoc()){
    $pdf->SetFont('Arial','B',12);
    $pdf->SetXY(70, 10);
    $pdf->Cell(70,10, utf8_decode($row['NombreM']),0 , 0,'C');
    $pdf->SetXY(70, 15);
    $pdf->Cell(70,15, utf8_decode('Delicuencia'),0 , 0,'C');
    $pdf->SetXY(30, 25);
    $pdf->Cell(30,25, utf8_decode('Información del año: '.$row['YearD']),0 , 0);
    $pdf->SetXY(30, 45);

    //BARRAS
    
    $data = array('Delitos de alto impacto' => $row['DelitosAI'], 'Homicidios' => $row['Homicidios'], 'Feminicidios' => $row['Feminicidios'] , 'Secuestros' => $row['Secuestros'] , 'Robos' => $row['Robo'] , 'Robos transporte' => $row['RoboT']);
    $pdf->Ln(1);
    //colores como en grafico de pastel
    $pdf->BarDiagram(180, 70, $data, '%l: %v (%p)', array(255,175,100));
    $pdf->SetFont('Arial','B',12);
    $pdf->SetXY(30, 125);

    //pastel
    $desa = array('Desapariciones hombres'=> $row['DespH'], 'Desapariciones mujeres'=> $row['DespM']);
    $pdf->SetFont('Arial','B',12);
    $pdf->Cell(0, 0, 'Desapariciones', 0, 0, 'C');
    $pdf->Ln(1);

    $pdf->SetXY(30, 135);
    $dh=array(100,100,255);
    $dm=array(255,100,100);
    $pdf->PieChart(120, 70, $desa, '%l: %v (%p)', array($dh,$dm)); 
    
    $pdf->SetFont('Arial','',12);
    $pdf->SetXY(30, 135);
    $pdf->Cell(0, 0,utf8_decode('Desapariciones totales: '.$row['DespT']), 0, 0, 'C');

} 


/*
$consultacarrera = "SELECT c.nombrecarrera from carrera as c inner join datosalumno as d on c.idcarrera=d.idcarrera where nocontrol=2019150481047";
$resultadocarrera = $mysqli->query($consultacarrera);
while($row = $resultadocarrera->fetch_assoc()){
    $pdf->SetFont('Arial','B',12);
    $pdf->SetXY(10, 60);
    $pdf->Cell(10,60, utf8_decode('Carrera: '),0 , 0,'C');
    

}
*/

$pdf->Output('','Informe.pdf');
?>