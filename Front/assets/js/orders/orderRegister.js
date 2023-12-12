var photo;
const initializeCamera = () => {
    // console.log('holainizializes');
    //toastMessage('Encendiendo camara...').showToast();
    $('#modal-camera').css('display', 'block');
    camera.powerOn()

}

const takeAPhoto = () => {
    photo = camera.takePhoto();
    //console.log(photo);
    camera.powerOff();
}

function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

const registerOrder = async () => {
    let blob;
    console.log('entre funcion');
    const btnSaveOrder = document.getElementById('btnSaveOrder');
    btnSaveOrder.innerHTML = `<div class="spinner-border ms-auto text-light" role="status" aria-hidden="true"></div>`;
    try {
        console.log('entre try');
        if (photo != null) {
             blob = base64ToBlob(photo.split(',')[1], 'image/jpeg');
            console.log(blob);
        }else{
            blob = new Blob();
        }
        
        const visitId = localStorage.getItem('selectedVisitId');

        const fechaInput = document.getElementById("visitDay").value;
        const fecha = new Date(fechaInput);
        const day = fecha.getUTCDate();
        const month = fecha.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
        const year = fecha.getUTCFullYear();

        const infoOrder = await axiosClient.get(`/orders/visit/${visitId}`);
        const newVisit = {
            "day_visit": `${day} de ${month} del ${year}`,
            "status": {
                "id": 1
            },
            "store": {
                "id": infoOrder.data.visit.store.id
            }
        };
        const visit = await axiosClient.post(`/visits/`, newVisit);

        const order = {
            "status": {
                "id": 1
            },
            "visit": visit.data
        };

        const newOrder = await axiosClient.post(`/orders/`, order);

        const currentVisit = {
            "id": infoOrder.data.visit.id,
            "day_visit": infoOrder.data.visit.day_visit,
            "status": {
                "id": 2
            },
            "store": {
                "id": infoOrder.data.visit.store.id
            }
        };
        const response = await axiosClient.put(`/visits/`, currentVisit);

        const form = new FormData();
        form.append('incidencia', blob, 'incidencia.jpg');
        form.append('id', infoOrder.data.id);
        form.append('description', '');
        form.append('observaciones', document.getElementById('incidenceDescription').value ?? '');
        form.append('status', 1);
        form.append('visit', infoOrder.data.visit.id);

        axiosClient.put(`/orders/incidencia/`, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Respuesta del servidor:', response.data);
                Swal.fire({
                    icon: "success",
                    title: "Se ha realizado el pedido con exito!",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.href = '../visitas/visitas.html';
                }, 1500);
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "No fue posible registrar el pedido",
                    showConfirmButton: false,
                    timer: 1500
                });
            });
            btnSaveOrder.innerText = `Hacer pedido`;
    } catch (error) {
        btnSaveOrder.innerText = `Hacer pedido`;
        console.log(error);
    }
    

}