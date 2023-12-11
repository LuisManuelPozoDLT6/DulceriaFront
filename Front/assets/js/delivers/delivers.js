const avatarPath = '../../../assets/images/avatar.png';
const adminAvatarPath = '../../../assets/images/adminAvatar.png';
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
                            src="${deliver.image != null ? deliver.image : avatarPath}"
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
                        <button type="button" onclick="getDeliverById(${deliver.person.id})" class="btn bg-morado btn-circle-table m-1"><i
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
                            src="${deliver.image != null ? deliver.image : adminAvatarPath}"
                            alt="...">
                    </td>
                    <td>${deliver.person.name + ' ' + deliver.person.lastName}</td>
                    <td>${deliver.person.phone}</td>
                    <td>${deliver.person.email}</td>
                    <td class="text-end">
                        <button type="button" onclick="setStatus(${deliver.id})" class="btn bg-morado btn-circle-table m-1"><i
                                    class="fa-solid fa-power-off" ></i></button>
                        <button type="button" onclick="getDeliverById(${deliver.person.id})"  class="btn bg-morado btn-circle-table m-1"><i
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

const saveProduct = async () => {
    const form = new FormData();
    const fileInput = document.getElementById('formFile');
    let selectedFile = fileInput.files[0];
    form.append('file', selectedFile);
    form.append('name', document.getElementById('name').value);
    form.append('description', document.getElementById('description').value);
    form.append('price', document.getElementById('price').value);

    // let product = {
    //     "name": document.getElementById('name').value,
    //     "description": document.getElementById('description').value,
    //     "price": document.getElementById('price').value,
    //     "image": "urlimage"
    // }

    //console.log(product);
    axiosClient.post(`/product/`, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(response => {
            console.log('Respuesta del servidor:', response.data);
            cleanForm();
            getProducts();
            $('#productModal').modal('hide');
            Swal.fire({
                icon: "success",
                title: "Se registró el producto",
                showConfirmButton: false,
                timer: 1500
            });
        })
        .catch(error => {
            console.error('Error en la solicitud POST:', error);
            Swal.fire({
                icon: "error",
                title: "No fue posible registrar el producto",
                showConfirmButton: false,
                timer: 1500
            });
        });
    
}

const saveAdmin = async () => {
    const btnSaveAdmin = document.getElementById('btnSaveAdmin');
    // <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
    btnSaveAdmin.innerHTML = `<div class="spinner-border ms-auto text-light" role="status" aria-hidden="true"></div>`;
    let person = {
        "name": document.getElementById('name').value,
        "lastName": document.getElementById('lastName').value,
        "address": null,
        "phone": document.getElementById('phone').value,
        "email": document.getElementById('email').value,
        "edad": 0,
        "sexo": null,
        "phone": document.getElementById('phone').value,
    }

    try {
        personUser = await savePerson(person);
        console.log(personUser);
        const form = new FormData();
        const fileInput = document.getElementById('imageProfile');
        let selectedFile = fileInput.files[0];
        form.append('image', selectedFile);
        form.append('username', document.getElementById('email').value);
        form.append('password', document.getElementById('password').value);
        form.append('person', personUser.id);
        form.append('code', null);
        form.append('status', 1);
        form.append('rol', 1);
        // console.log("Contenido de FormData:");
        //     for (let pair of form.entries()) {
        //         console.log(pair[0] + ': ' + pair[1]);
        //     }

        axiosClient.post(`/user/saveImage`, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Respuesta del servidor:', response.data);
                getAdmins();
                cleanForm();
                $('#saveAdminModal').modal('hide');
                Swal.fire({
                    icon: "success",
                    title: "Se registró el administrador",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "No fue posible registrar el administrador",
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    } catch (error) {
        console.log(error);
    } finally {
        btnSaveAdmin.innerText = `Registrar`;
    }

    
    
}
const saveDeliver = async () => {
    const btnSaveDeliver = document.getElementById('btnSaveDeliver');
    // <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
    btnSaveDeliver.innerHTML = `<div class="spinner-border ms-auto text-light" role="status" aria-hidden="true"></div>`;
    let person = {
        "name": document.getElementById('name').value,
        "lastName": document.getElementById('lastName').value,
        "address": null,
        "phone": document.getElementById('phone').value,
        "email": document.getElementById('email').value,
        "edad": 0,
        "sexo": null,
        "phone": document.getElementById('phone').value,
    }

    try {
        personUser = await savePerson(person);
        console.log(personUser);
        const form = new FormData();
        const fileInput = document.getElementById('imageProfile');
        let selectedFile = fileInput.files[0];
        form.append('image', selectedFile);
        form.append('username', document.getElementById('email').value);
        form.append('password', document.getElementById('password').value);
        form.append('person', personUser.id);
        form.append('code', null);
        form.append('status', 1);
        form.append('rol', 2);
        // console.log("Contenido de FormData:");
        //     for (let pair of form.entries()) {
        //         console.log(pair[0] + ': ' + pair[1]);
        //     }

        axiosClient.post(`/user/saveImage`, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Respuesta del servidor:', response.data);
                getDelivers();
                cleanForm();
                $('#saveDeliverModal').modal('hide');
                Swal.fire({
                    icon: "success",
                    title: "Se registró el repartidor",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "No fue posible registrar el repartidor",
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    } catch (error) {
        console.log(error);
    } finally{
        btnSaveDeliver.innerText = `Registrar`;
    }
}

const cleanForm = () => {
    document.getElementById('name').value = "";
    document.getElementById('lastName').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    document.getElementById('imageProfile').value = "";
    document.getElementById('passwordRepeat').value = "";
}

const getDeliverById = async (id) => {
    try {
        const response = await axiosClient.get(`/person/${id}`);
        document.getElementById('nameUpdate').value = response.data.name;
        document.getElementById('lastNameUpdate').value = response.data.lastName;
        document.getElementById('phoneUpdate').value = response.data.phone;
        document.getElementById('idUpdate').value = response.data.id;
        document.getElementById('emailUpdate').value = response.data.email;
        $('#updateDeliverModal').modal('show');
    } catch (error) {
        console.log(error);
    }
}

const updateDeliver = async () => {
    const id = document.getElementById('idUpdate').value;

    let person = {
        "id": id,
        "name": document.getElementById('nameUpdate').value,
        "lastName": document.getElementById('lastNameUpdate').value,
        "phone": document.getElementById('phoneUpdate').value,
        "email": document.getElementById('emailUpdate').value
    }
    console.log(person);
    try {
        const response = await axiosClient.put(`/person/${id}`, person);
        $('#updateDeliverModal').modal('hide');
        getDelivers();
        Swal.fire({
            icon: "success",
            title: "Se actulizó la información del repartidor",
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "No fue posible actualizar al repartidor",
            showConfirmButton: false,
            timer: 1500
        });
    }

}

const updateAdmin = async () => {
    const id = document.getElementById('idUpdate').value;

    let person = {
        "id": id,
        "name": document.getElementById('nameUpdate').value,
        "lastName": document.getElementById('lastNameUpdate').value,
        "phone": document.getElementById('phoneUpdate').value,
        "email": document.getElementById('emailUpdate').value
    }
    console.log(person);
    try {
        const response = await axiosClient.put(`/person/${id}`, person);
        $('#updateDeliverModal').modal('hide');
        getAdmins();
        Swal.fire({
            icon: "success",
            title: "Se actulizó la información del repartidor",
            showConfirmButton: false,
            timer: 1500
        });
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "No fue posible actualizar al repartidor",
            showConfirmButton: false,
            timer: 1500
        });
    }

}

