const getDelivers = async () => {
    let delivers = ``;
    try {
        const response = await axiosClient.get(`/user/`)
        response.data.forEach(deliver => {
            delivers += `
                <tr>
                    <th scope="">1</th>
                    <td>
                        <img class="imgTable"
                            src="https://i0.wp.com/tracklist.com.br/wp-content/uploads/2022/08/lana-1.png?fit=1200%2C675&ssl=1"
                            alt="...">
                    </td>
                    <td>${deliver.person.name + ' ' + deliver.person.lastName}</td>
                    <td>${deliver.person.phone}</td>
                    <td>${deliver.person.email}</td>
                    <td class="text-end">
                        <button type="button" class="btn bg-morado btn-circle-table m-1"><i
                                    class="fa-solid fa-power-off"></i></button>
                        <button type="button" class="btn bg-morado btn-circle-table m-1"><a href="../../pages/visitas/visitas.html"><i
                            class="fas fa-store"></i>
                        </a></button>
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