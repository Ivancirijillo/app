function json_wind(mode){
    let data = {
        modo: mode
    }
    fetch('/menuOpc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data["resp"])
        window.location.href = data["resp"];
    });
}

document.getElementById('opc_graficas').addEventListener('click', function() {
    json_wind("graficas");
})

document.getElementById('opc_mapa').addEventListener('click', function() {
    json_wind("mapa");
})