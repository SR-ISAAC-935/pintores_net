console.log('hola aqui estoy en el frontend')

document.addEventListener('click', (e) =>{
    
    if(e.target.dataset.short)
        {
            const url= `http://localhost:5001/${e.target.dataset.short}`
            navigator.clipboard.writeText(url)
            .then(()=>{
                console.log('copiado al portapapeles')
            }).catch((err)=>{
                console.log(`error al copiar ${err}`)
            })
        }   
})