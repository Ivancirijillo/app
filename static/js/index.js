let boton = document.querySelector(".buscar")

boton.addEventListener("click",(e)=>{
    e.preventDefault()
    let municipios = document.querySelectorAll(".municipio")
    let municipioP = []
    
    municipios.forEach(municipio => {
        if (municipio.checked){ 
            municipioP.push(municipio.getAttribute("value"))
        }
    });

    let data = { municipio: municipioP};

    fetch('/consulta-municipio', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
    console.log(data);
    });
})