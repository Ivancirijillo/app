function json_wind(mode){
        window.location.href = mode;
}

document.getElementById('opc_graficas').addEventListener('click', function() {
    json_wind("/Graficas");
})

document.getElementById('opc_mapa').addEventListener('click', function() {
    json_wind("/Mapa");
})

document.getElementById("logoutBtn").addEventListener("click", function() {
    json_wind("/logout");
})