const savePerson = async (person) => {
    let personRegistered;
    try {
        response = await axiosClient.post(`/person/`, person);
        personRegistered = response.data;
    } catch (error) {
        console.log(error);
    }
    return personRegistered;
}

const getDelivers = async () => {
    let delivers = ``;
    try {
        const response = await axiosClient.post(`/user/Repatidor/`, {id:2})
        response.data.forEach((deliver, index) => {
            delivers += `
                <tr>
                    <th scope="">${index +1}</th>
                    <td>
                        <img class="imgTable"
                            src="https://i0.wp.com/tracklist.com.br/wp-content/uploads/2022/08/lana-1.png?fit=1200%2C675&ssl=1"
                            alt="...">
                    </td>
                    <td>${deliver.person.name + ' ' + deliver.person.lastName}</td>
                    <td>${deliver.person.phone}</td>
                    <td>${deliver.person.email}</td>
                    <td class="text-end">
                        <button type="button" onclick="setStatus(${deliver.id})" class="btn bg-morado btn-circle-table m-1"><i
                                    class="fa-solid fa-power-off" ></i></button>
                        <button type="button" onclick="getDeliverId(${deliver.person.id})" class="btn bg-morado btn-circle-table m-1"><i
                            class="fas fa-store"></i>
                        </button>
                        <button type="button" class="btn bg-morado btn-circle-table m-1"><i
                            class="fa-solid fa-pen-to-square"></i></button>
                    </td>
                </tr>
            `;
        })
        document.getElementById('deliversTale').innerHTML = delivers;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const getAdmins = async () => {
    let delivers = ``;
    try {
        const response = await axiosClient.post(`/user/Repatidor/`, {id:1})
        response.data.forEach((deliver, index) => {
            delivers += `
                <tr>
                    <th scope="">${index +1}</th>
                    <td>
                        <img class="imgTable"
                            src="https://i0.wp.com/tracklist.com.br/wp-content/uploads/2022/08/lana-1.png?fit=1200%2C675&ssl=1"
                            alt="...">
                    </td>
                    <td>${deliver.person.name + ' ' + deliver.person.lastName}</td>
                    <td>${deliver.person.phone}</td>
                    <td>${deliver.person.email}</td>
                    <td class="text-end">
                        <button type="button" onclick="setStatus(${deliver.id})" class="btn bg-morado btn-circle-table m-1"><i
                                    class="fa-solid fa-power-off" ></i></button>
                        <button type="button" class="btn bg-morado btn-circle-table m-1"><i
                            class="fa-solid fa-pen-to-square"></i></button>
                    </td>
                </tr>
            `;
        })
        document.getElementById('deliversTale').innerHTML = delivers;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const setStatus = async (id) => {
    Swal.fire({
        title: "Estás seguro de dar de baja a este usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4B2883",
        cancelButtonColor: "#d33",
        confirmButtonText: "Dar de baja",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await axiosClient.put(`/user/status/${id}`)
                getDelivers();
                Swal.fire({
                    icon: "success",
                    title: "Se ha dado de baja al usuario",
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error al dar de baja al usuario",
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

const getDeliverId = (id) => {
    localStorage.setItem('selectedDeliverId', id);
    window.location.href = '../visitas/visitas.html'
}




// const saveDeliver = async () => {

//     let person = {
//         "id": 1,
//         "name": document.getElementById('ownerName').value,
//         "lastName": null,
//         "address": null,
//         "phone": "77789541236",
//         "email": null,
//         "edad": 0,
//         "sexo": null,
//         "name": document.getElementById('ownerName').value,
//         "phone": document.getElementById('phone').value,
//     }

//     let deliver = {
//         "username": "luispozo",
//         "person": {
//             "id": 1,
//             "name": "luis manuel",
//             "lastName": null,
//             "address": null,
//             "phone": "77789541236",
//             "email": null,
//             "edad": 0,
//             "sexo": null
//         },
//         "status": 1,
//         "authorities": [
//             {
//                 "id": 2
//             }
//         ]
//     }
    
// }

