var url = "Res_Definitivos_Gobernador_2017_por_sección.xlsx";
var oReq = new XMLHttpRequest();
oReq.open("GET", url, true);
oReq.responseType = "arraybuffer";

oReq.onload = function(e) {
    var arraybuffer = oReq.response;
    
    var info = readData();
    var pos = 0;

            //console.log(info)
            console.log("MUN => " + info[pos].MUNICIPIO)
            console.log("PAN => " + info[pos].PAN)
            console.log("PRI => " + info[pos].PRI)
            console.log("PRD => " + info[pos].PRD)
            console.log("PT => " + info[pos].PT)

            var pan=0, pri=0, prd=0, pt=0, morena=0;

            for(var i = 0; i != info.length ; ++i){
                if(info[i].MUNICIPIO == 'ACAMBAY DE RUIZ CASTAÑEDA'){
                    pan+=info[i].PAN
                    pri+=info[i].PRI
                    prd+=info[i].PRD
                    pt+=info[i].PT
                    morena+=info[i].MORENA
                }
            }

            document.querySelector(".tableDatos").innerHTML += 
            '<tr><td> Municipio </td><td>'+info[pos].MUNICIPIO+'</td></tr>'
            +'<tr><td> PAN </td><td>'+pan+'</td></tr>' 
            + '<tr><td> PRI </td><td>'+pri+'</td></tr>'
            + '<tr><td> PRD </td><td>'+prd+'</td></tr>'
            + '<tr><td> PT </td><td>'+pt+'</td></tr>'
            + '<tr><td> PRD </td><td>'+morena+'</td></tr>';

            function readData(){
                /* convert data to binary string */
                var data = new Uint8Array(arraybuffer);
                var arr = new Array();
                for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                var bstr = arr.join("");
                
                /* Call XLSX */
                var workbook = XLSX.read(bstr, {type:"binary"});
                
                /* DO SOMETHING WITH workbook HERE */
                var first_sheet_name = workbook.SheetNames[0];
                /* Get worksheet */
                var worksheet = workbook.Sheets[first_sheet_name];

                console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
                var info = XLSX.utils.sheet_to_json(worksheet,{raw:true});

            return info;
        }
          
    }
oReq.send();
