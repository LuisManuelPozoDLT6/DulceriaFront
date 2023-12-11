const initializeCamera = () => {
    // console.log('holainizializes');
    //toastMessage('Encendiendo camara...').showToast();
    $('#modal-camera').css('display', 'block');
    camera.powerOn()

}

const takeAPhoto = () => {
    const photo = camera.takePhoto();
    console.log(photo);
    camera.powerOff();
    console.log(payload);
}

const registerOrder = async ()  => {
    const visitId = localStorage.getItem('selectedVisitId');

        const fechaInput = document.getElementById("visitDay").value;
        const fecha = new Date(fechaInput);
        const day = fecha.getUTCDate();
        const month = fecha.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
        const year = fecha.getUTCFullYear();

    try {
        
        const infoOrder = await axiosClient.get(`/orders/visit/${visitId}`);
        const newVisit = {
            "day_visit": `${day} de ${month} del ${year}`,
            "status": {
                "id": 1
            },
            "store": {
                "id": infoOrder.visit.store.id
            }
        };
        const currentVisit = {
            "id" : infoOrder.visit.id,
            "status": {
                "id": 2
            },
            "store": {
                "id": infoOrder.visit.store.id
            }
        };

        const currentOrder = {
            "id": infoOrder.id,
            "description": null,
            "observaciones": "El moviliario se mojó por las lluvias",
            "incidencias": "hola",
            "status": {
                "id": 2
            }
        }
        const response = await axiosClient.put(`/visits/`, currentVisit);
        const visit = await axiosClient.post(`/visits/`, newVisit);
    } catch (error) {
        
    }
}