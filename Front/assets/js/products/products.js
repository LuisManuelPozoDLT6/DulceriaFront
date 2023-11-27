const getProducts = async () => {
    let products = ``;
    try {
        const response = await axiosClient.get(`/product/`)
        response.data.forEach(product => {
            products += `
            <div class="col-md-4 col-sm-6 " onclick="getProductById(1)">
                <div class="card">
                    <div class="card-body text-center">
                        <img src="../../assets/images/paletas.png" width="150px" height="150px" class="img-cover" alt="">
                        <h5>${product.name}</h5>
                        <h5 style="margin-top: -5px;">${'$' +product.price}</h5>
                        <p class="text-secondary mrl-3">${product.description}</p>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-morado btn-circle"><i class="fa-solid fa-pen"></i></button>
                        </div>
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

const saveProduct = async () => {
    let product = {
        "name": document.getElementById('name').value,
        "description": document.getElementById('description').value,
        "price": document.getElementById('price').value,
        "image": "urlimage"
    }

    console.log(product);
    axiosClient.post(`/product/`, product)
        .then(response => {
            console.log('Respuesta del servidor:', response.data);
            cleanForm();
            getProducts();
            $('#productModal').modal('hide');
        })
        .catch(error => {
            console.error('Error en la solicitud POST:', error);
        });
    
}

const cleanForm = () => {
    document.getElementById('name').value = "";
    document.getElementById('description').value = "";
    document.getElementById('price').value = "";
}