const getProducts = async () => {
    let products = ``;
    try {
        const response = await axiosClient.get(`/product/`)
        response.data.forEach(product => {
            products += `
                <div class="col-md-3 mb-4" onclick="getProductById(1)">
                    <div class="card shadow card-product" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <div class="card-body text-center">
                        <img src="../../assets/images/paletas.png" width="100px" height="100px" class="img-cover" alt="">
                        <h5>${product.name}s</h5>
                        <h5 style="margin-top: -5px;">${'$' +product.price}</h5>
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

const getProductById = async (id) =>{
    let product = ``;
    try {
        const response = await axiosClient.get(`/product/${id}`)
        console.log(response.data);
        product = `
            <img src="../../assets/images/paletas.png" width="200px" height="200px" class="img-cover" alt="">
            <h4>${response.data.name}</h4>
            <p style="margin-top: -5px;">${response.data.description}</p>
            <h3 style="margin-top: -10px;" class="text-rosa">$${response.data.price}</h3>
        `
        document.getElementById('modalProduct').innerHTML = product;
    } catch (error) {
        console.log(error);
    }
}