

const getStores = async () => {
    let stores = ``;
    try {
        const response = await axiosClient.get(`/store/`);
        response.data.forEach((store, index) => {
            stores += `
            <div class="col-md-4 col-sm-6 mb-5">
                <div class="card card-store shadow">
                    <div class="card-body text-center pt-5 pb-3">
                        <h5 class="${index % 2 == 0 ? 'text-rosa' : 'text-morado'}"><i class="fas fa-store fa-3x"></i></h5>
                        <h4>${store.name}</h4>
                        <p><i class="fa-solid fa-location-dot"></i> ${store.address}</p>
                        <div class="d-flex justify-content-end">
                            <button type="button" onClick="getStoreId(${store.id})" class="btn btn-morado btn-circle"><i
                                    class="fa-solid fa-eye"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        document.getElementById('stores').innerHTML = stores;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const saveStore = async () => {
    let store = {
        "name": document.getElementById('name').value,
        "address": document.getElementById('address').value,
        "rfc": document.getElementById('rfc').value,
        "owner": {
            "id" : 1
        },
        "deliver": {
            "id": document.getElementById('delivers').value,
        }
    }

    console.log(store);
    axiosClient.post(`/store/`, store)
        .then(response => {
            console.log('Respuesta del servidor:', response.data);
            cleanForm();
            getStores();
            $('#saveStoreModal').modal('hide');
        })
        .catch(error => {
            console.error('Error en la solicitud POST:', error);
        });
    
}

const cleanForm = () => {
    document.getElementById('name').value = "";
    document.getElementById('address').value = "";
    document.getElementById('rfc').value = "";
    document.getElementById('ownerName').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('delivers').value= "";
}

const getStoreId = (id) => {
    localStorage.setItem('selectedStoreId', id);
    window.location.href = './store.html'
}

const getDelivers = async () => {
    try {
        const response = await axiosClient.get(`/person/`);
        console.log(response);
        let selectDelivers = $("#delivers");
        selectDelivers.append(`<option value="0">Señeccione un repartidor</option>`)

        for (let i = 0; i < response.data.length; i++) {
            selectDelivers.append(`<option value="${response.data[i].id}">${response.data[i].name} ${response.data[i].lastName}</option>`)
        }

    } catch (error) {
        console.log(error);
    }
}

const getStoreById = async () => {
    const storeId = localStorage.getItem('selectedStoreId');
    let store = ``;
    let repartidor = ``;
    try {
        const response = await axiosClient.get(`/store/${storeId}`);
        console.log(response.data);
        store = `
        <div class="card bg-morado card-store-large shadow align-items-center ">
            <div class="card-body ">
                <h1 class="text-white text-center mt-3"><i style="font-size: 150px;" class="fas fa-store fa-3x"></i></h1>
                <h4 class="text-white text-center mb-4">${response.data.name}</h4>
                <div class="d-flex mrl-3 flex-column">
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-location-dot"></i>${response.data.address}</p>
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-circle"></i>${response.data.rfc}</p>
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-user"></i>${response.data.owner.name + ' ' + response.data.owner.lastName}</p>
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-phone"></i>${response.data.owner.phone}</p>
                </div>
            </div>
        </div>
        `
        repartidor = `
            <div class="flex-shrink-0">
                <img
                src="https://media.glamour.mx/photos/643744437c542dd2fac99d96/3:2/w_2559,h_1706,c_limit/lana_del_rey.jpg"
                class="img-redonda">
            </div>
            <div class="flex-grow-1 ms-3">
                <h4 class="d-flex align-items-center justify-content-between">
                <span class="fw-bold">Repartidor asignado</span>
                <i style="font-size: 20px;" class="fa-solid fa-pen-to-square"></i>
                </h4>
                <h6 class="fw-lighter" style="font-size: 17px;">${response.data.deliver.name + ' ' + response.data.deliver.lastName}</h6>
            </div>
        `

        response.data.visitList.forEach((visit, index) => {

        });

        document.getElementById('store').innerHTML = store;
        document.getElementById('deliver').innerHTML = repartidor;
    } catch (error) {
        console.log(error);
    }
}

