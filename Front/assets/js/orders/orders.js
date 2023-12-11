

const getProducts = async () => {
    let products = ``;
    try {
        const response = await axiosClient.get(`/product/`)
        response.data.forEach(product => {
            products += `
                <div class="col-md-3 mb-4" onclick="getProductById(${product.id})">
                    <div class="card shadow card-product" data-bs-toggle="modal" data-bs-target="#productModal">
                        <div class="card-body text-center">
                        <img src="${product.image}" width="100px" height="100px" class="img-cover" alt="">
                        <h5>${product.name}s</h5>
                        <h5 style="margin-top: -5px;">${'$' + product.price}</h5>
                        <p class="text-secondary">${product.description}</p>
                        </div>
                    </div>
                </div>
            `;
        })
        document.getElementById('products').innerHTML = products;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const getProductById = async (id) => {
    let product = ``;
    try {
        const response = await axiosClient.get(`/product/${id}`)
        console.log(response.data);
        product = `
            <img src="${response.data.image}" width="200px" height="200px" class="img-cover" alt="">
            <h4>${response.data.name}</h4>
            <p style="margin-top: -5px;">${response.data.description}</p>
            <h3 style="margin-top: -10px;" class="text-rosa">$${response.data.price}</h3>
            <input type="number" id="idProduct" hidden value="${response.data.id}">
            <input type="number" id="priceProduct" hidden value="${response.data.price}">
        `
        document.getElementById("btnAdd").innerHTML = `Agregar <span style="font-size: small;">$${parseFloat(response.data.price).toFixed(2)}</span>`;
        document.getElementById('modalProduct').innerHTML = product;
    } catch (error) {
        console.log(error);
    }
}

const getStoreById = async () => {
    const visitId = localStorage.getItem('selectedVisitId');
    let store = ``;
    try {
        const response = await axiosClient.get(`/orders/visit/${visitId}`);
        store = `
            <h1 class="circle-visit-large mx-auto bg-rosa"><i class="fas fa-store"></i></h1>
            <h6>${response.data.visit.store.name}</h6>
            <p style="margin-top: -5px;">${response.data.visit.store.address}</p>
        `;

        document.getElementById('tienda').innerHTML = store;
    } catch (error) {
        console.log(error);
    }
}

const makeOrder = async () => {
    const visitId = localStorage.getItem('selectedVisitId');
    try {
        const responseOrder = await axiosClient.get(`/orders/visit/${visitId}`);

    } catch (error) {
        console.log(error);
    }
}

const addProduct = async (event) => {
    event.preventDefault();
    const visitId = localStorage.getItem('selectedVisitId');

    try {
        const responseOrder = await axiosClient.get(`/orders/visit/${visitId}`);

        orderHasProduct = {
            "cantidad": document.getElementById('cantidad').value,
            "product": {
                "id": document.getElementById('idProduct').value,
            },
            "order": {
                "id": responseOrder.data.id
            }
        }

        const response = await axiosClient.post(`/ordershasproduct/`, orderHasProduct);

        document.getElementById('cantidad').value = 1;
        $('#productModal').modal('hide');
        Swal.fire({
            icon: "success",
            title: "Se registró el producto en la orden",
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
}

const updatePrice = () => {
    cantidad = document.getElementById("cantidad").value;
    precio = document.getElementById("priceProduct").value;
    total = `
        Agregar <span style="font-size: small;">$${parseFloat(cantidad * precio).toFixed(2)}</span>
    `;

    document.getElementById("btnAdd").innerHTML = total;
}

const cleanInputPrice = () => {
    document.getElementById("cantidad").value = 1;
}

const getOrderInfo = () => {
    window.location.href = '../pedidos/resumen.html'
}

const deleteProductFromOrder = async (id) => {
    Swal.fire({
        title: "Estás seguro de eliminar este producto de la orden?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4B2883",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await axiosClient.delete(`/ordershasproduct/${id}`)
                .then(response => {
                    console.log('Eliminación exitosa:', response.data);
                    Swal.fire({
                        icon: "success",
                        title: "Se eliminó el producto de la orden",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    getOrder();
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Ocurrió un error al eliminar el producto de la orden",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    console.error('Error al eliminar:', error);
                });
        } else {
            Swal.fire({
                title: "Cancelado",
                text: "La operación ha sido cancelada.",
                icon: "error"
            });
        }
    });

}

const getOrder = async () => {
    let products = ``;
    let subTotal = 0;
    const visitId = localStorage.getItem('selectedVisitId');
    try {
        const response = await axiosClient.get(`/orders/visit/${visitId}`);
        order = response.data;
        console.log(order);

        order.productList.forEach(product => {
            subTotal += product.cantidad * product.product.price;
            products += `
                <li class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col-2">
                            <span>${product.cantidad}</span>
                        </div>
                        <div class="col-4">
                            <img src="${product.product.image}" width="100px" height="100px"
                                alt="" class="img-cover">
                        </div>
                        <div class="col">
                            <h6>${product.product.name}</h6>
                            <p class="text-rosa">$${parseFloat(product.product.price).toFixed(2)}</p>
                        </div>
                        <div class="col-1">
                            <h6 onclick="deleteProductFromOrder(${product.id})"><i class="fa-solid fa-x"></i></h6>
                        </div>
                    </div>
                </li>
            `;
        })
        document.getElementById('subTotal').innerText = `$${parseFloat(subTotal).toFixed(2)}`;
        document.getElementById('tienda').innerText = `${order.visit.store.name}`;
        document.getElementById('listaProductos').innerHTML = products;
    } catch (error) {
        console.log(error);
    }
}


