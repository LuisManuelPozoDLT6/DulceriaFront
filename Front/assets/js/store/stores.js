const avatarPath = '../../../assets/images/avatar.png';

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

const getDeliverStore = async () => {
    const idDeliver = localStorage.getItem('idPerson');
    let stores = ``;
    try {
        const response = await axiosClient.get(`/store/deliver/${idDeliver}`);

        if (response.data.length == 0) {
            stores = `<h2 class="mt-3 text-secondary">No tienes tiendas asignadas por el momento</h2>`
        }else{
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
        }
        document.getElementById('deliverStores').innerHTML = stores;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const saveOwner = async (owner) => {
    let ownerRegistered;
    try {
        response = await axiosClient.post(`/person/`, owner);
        ownerRegistered = response.data;
    } catch (error) {
        console.log(error);
    }
    return ownerRegistered;
}

const getById = async () => {
    const storeId = localStorage.getItem('selectedStoreId');
    try {
        const responseDeliver = await axiosClient.get(`/user/Repatidor/2`);
        console.log(responseDeliver);
        let selectDelivers = $("#delivers");
        const response = await axiosClient.get(`/store/${storeId}`);

        for (let i = 0; i < responseDeliver.data.length; i++) {
            // if (responseDeliver.data[i].id === response.data.deliver.id) {
            //     option.selected = true;
            // }
            selectDelivers.append(`<option value="${responseDeliver.data[i].person.id}">${responseDeliver.data[i].person.name} ${responseDeliver.data[i].person.lastName}</option>`)
        }

        document.getElementById('nameUpdate').value = response.data.name;
        document.getElementById('addressUpdate').value = response.data.address;
        document.getElementById('rfcUpdate').value = response.data.rfc;
        document.getElementById('ownerNameUpdate').value = response.data.owner.name;
        document.getElementById('phoneUpdate').value = response.data.owner.phone;
        document.getElementById('idOwnerUpdate').value= response.data.owner.id;
        document.getElementById('delivers').value= response.data.deliver.id;

        $('#updateStoreModal').modal('show');
    } catch (error) {
        console.log(error);
    }
}


const updateStore = async () => {
    const storeId = localStorage.getItem('selectedStoreId');
    let owner = {
        "id": document.getElementById('idOwnerUpdate').value,
        "name": document.getElementById('ownerNameUpdate').value,
        "phone": document.getElementById('phoneUpdate').value   
    }
    
    try {
        const responseOwner = await axiosClient.put(`/person/${owner.id}`, owner);

        let store = {
            "id": storeId,
            "name": document.getElementById('nameUpdate').value,
            "address": document.getElementById('addressUpdate').value,
            "rfc": document.getElementById('rfcUpdate').value,
            owner,
            "deliver": {
                "id": document.getElementById('delivers').value,
            }
        }

        const response = await axiosClient.put(`/store/`, store);
        $('#updateStoreModal').modal('hide');
        getStoreById();
        Swal.fire({
            icon: "success",
            title: "Se modificó la tienda",
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "No fue posible modificar la tienda",
            showConfirmButton: false,
            timer: 1500
        });
    }
}

const saveVisit = async () => {
    try {
        const storeId = localStorage.getItem('selectedStoreId');
        console.log(storeId);
        const fechaInput = document.getElementById("visitDay").value;
        const fecha = new Date(fechaInput);
        const day = fecha.getUTCDate();
        const month = fecha.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
        const year = fecha.getUTCFullYear();

        const visit = {
            "day_visit": `${day} de ${month} del ${year}`,
            "status": {
                "id": 1
            },
            "store": {
                "id": storeId
            }
        };
        console.log(visit);

        const response = await axiosClient.post(`/visits/`, visit);

        const order = {
            "status": {
                "id": 1
            },
            "visit": response.data
        };

        const responseOrder = await axiosClient.post(`/orders/`, order);

        getStoreById(storeId);
        $('#saveVisitModal').modal('hide');
        Swal.fire({
            icon: "success",
            title: "Se registró la visita",
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Ocurrió un error al registrar la visita",
            showConfirmButton: false,
            timer: 1500
        });
    }
};


const saveStore = async () => {
    let owner = {
        "name": document.getElementById('ownerName').value,
        "phone": document.getElementById('phone').value,
    }

    const ownerRegistered = await saveOwner(owner);

    let store = {
        "name": document.getElementById('name').value,
        "address": document.getElementById('address').value,
        "rfc": document.getElementById('rfc').value,
        "owner": {
            "id" : ownerRegistered.id
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
            Swal.fire({
                icon: "success",
                title: "Se registró la tienda",
                showConfirmButton: false,
                timer: 1500
            });
        })
        .catch(error => {
            console.error('Error en la solicitud POST:', error);
            Swal.fire({
                icon: "error",
                title: "No fue posible registrar la tienda",
                showConfirmButton: false,
                timer: 1500
            });
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
        const response = await axiosClient.get(`/user/Repatidor/2`);
        console.log(response.data);
        
        let selectDelivers = $("#delivers");
        selectDelivers.append(`<option value="0">Seleccione un repartidor</option>`);

        for (let i = 0; i < response.data.length; i++) {
            selectDelivers.append(`<option value="${response.data[i].person.id}">${response.data[i].person.name} ${response.data[i].person.lastName}</option>`);
        }

    } catch (error) {
        console.log(error);
    }
};


const getVisits = async (id) => {
    let visits;
    try {
        const response = await axiosClient.get(`/visits/store/${id}`);
        visits = response.data;
    } catch (error) {
        console.log(error);
    }
    return visits;
}

const setStatus = async (id) => {
    Swal.fire({
        title: "Marcar orden como entregada?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4B2883",
        cancelButtonColor: "#d33",
        confirmButtonText: "Entregar",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await axiosClient.put(`/orders/status/${id}`)
                Swal.fire({
                    icon: "success",
                    title: "Se ha marcado la orden como entregada!",
                    showConfirmButton: false,
                    timer: 1500
                });
                $('#infoVisit').modal('hide');
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error al marcar de entregado la orden",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } else {
            Swal.fire({
                title: "Cancelado",
                text: "La operación ha sido cancelada.",
                icon: "error"
            });
        }
    });
}

const getVisitInfo = async (id) => {
    let productsOrder = ``;
    let subTotal = 0;
    let observaciones = ``;
    let statusOrder = ``;
    
    try {
        const response = await axiosClient.get(`/orders/visit/${id}`);
        listProducts = response.data.productList;
        document.getElementById('visitDate').innerText = `Visita ${response.data.visit.day_visit}`;
        if (response.data.visit.status.id != 1) {

            btnStatus = `
            <button type="button" data-bs-toggle="modal" onclick="setStatus(${response.data.id})" class="btn btn-rosa rounded-pill mt-3">
                    <i class="fa-solid fa-check"></i> Pedido entregado</button>
            `;

            response.data.status.id == 1 ? document.getElementById('btnStatus').innerHTML = btnStatus : document.getElementById('btnStatus').innerHTML = '';
            
           statusOrder = `
                <span class="badge ${response.data.status.id != 1 ? 'bg-success' : 'bg-warning'} ">${response.data.status.desciprtion}</span>
           `;

           document.getElementById('statusOrder').innerHTML = statusOrder;
            
            observaciones = `
                <h3 class="mb-2">Observaciones</h3>
                <p>${response.data.observaciones == '' ? 'No hay observaciones' : response.data.observaciones}</p>
                ${response.data.observaciones != '' ? `<img src="${response.data.incidencias}" width="200px" height="200px" class="img-thumbnail img-cover" alt="...">` : '' }
                
            `;
                
            document.getElementById('observaciones').innerHTML = observaciones;
    
            listProducts.forEach(product => {
                subTotal += product.cantidad * product.product.price;
                productsOrder += `
                    <li class="list-group-item">
                        <div class="row align-items-center">
                            <div class="col-2">
                                <span>${product.cantidad}</span>
                            </div>
                            <div class="col-4 align-items-start">
                                <img src="${product.product.image}" alt="Productos" class="img-fluid">
                            </div>
                            <div class="col">
                                <h6>${product.product.name}</h6>
                                <p class="text-rosa">$${product.product.price}</p>
                            </div>
                        </div>
                    </li>
                `;
            })
    
            document.getElementById('listaProducts').innerHTML = productsOrder;
            document.getElementById('subTotal').innerText = `$${parseFloat(subTotal).toFixed(2)}`;
            $('#infoVisit').modal('show');
            
        }else{
            Swal.fire({
                icon: "info",
                title: "Aún no se han registrado datos en esta visita",
                showConfirmButton: false,
                timer: 2500
            });
        }
        
       

    } catch (error) {
        console.log(error);
    }
}

const getStoreById = async () => {
    const storeId = localStorage.getItem('selectedStoreId');
    const role = localStorage.getItem('activeRole');
    let store = ``;
    let repartidor = ``;
    let visitCard = ``;
    try {
        const response = await axiosClient.get(`/store/${storeId}`);
        const responseDeliver = await axiosClient.get(`/user/person/${response.data.deliver.id}`)
        const visits = await getVisits(storeId);
        console.log(visits);
        console.log(response.data);
        store = `
        <div class="card bg-morado card-store-large shadow align-items-center ">
            <div class="card-body ">
                <h1 class="text-white text-center mt-3"><i style="font-size: 150px;" class="fas fa-store fa-3x"></i></h1>
                <h4 class="text-white text-center mb-4">${response.data.name}</h4>
                <div class="d-flex mrl-3 flex-column">
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-location-dot"></i>${response.data.address}</p>
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-circle"></i>${response.data.rfc}</p>
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-user"></i>${response.data.owner.name}</p>
                    <p class="text-white d-flex align-items-center"><i class="fa-solid fa-phone"></i>${response.data.owner.phone}</p>
                </div>
            </div>
        </div>
        `
        repartidor = `
            <div class="flex-shrink-0">
                <img
                src="${responseDeliver.data.image != null ? responseDeliver.data.image : avatarPath}"
                class="img-redonda">
            </div>
            <div class="flex-grow-1 ms-3">
                <h4 class="d-flex align-items-center justify-content-between">
                <span class="fw-bold">Repartidor asignado</span> 
                ${role != 'Repartidor' ? '<i onclick="getById()" style="font-size: 20px;" class="fa-solid fa-pen-to-square"></i>' : ''}
                </h4>
                <h6 class="fw-lighter" style="font-size: 17px;">${response.data.deliver.name + ' ' + response.data.deliver.lastName}</h6>
            </div>
        `

        visits.forEach((visit, index) => {
            visitCard += `
            <div class="col-md-4 col-6 mb-4 " onclick="getVisitInfo(${visit.id})">
                <div class="card shadow card-visit" data-bs-toggle="modal" style="height:200px;">
                    <div class="card-body text-center overflow-auto">
                        <h3 class="circle-visit mx-auto ${index % 2 == 0 ? 'bg-rosa' : 'bg-morado'}"><i class="fa-solid fa-calendar-days"></i></h3>
                        <p>${visit.day_visit}</p>
                        <span class="badge ${visit.status.id != 1 ? 'bg-success' : 'bg-warning'}">${visit.status.desciprtion}</span>
                    </div>
                </div>
            </div>
            `
        });
        console.log(visits.length);

        document.getElementById('store').innerHTML = store;
        document.getElementById('deliver').innerHTML = repartidor;
        document.getElementById('visits').innerHTML = visitCard;
        
    } catch (error) {
        console.log(error);
    }
}
getDelivers();

