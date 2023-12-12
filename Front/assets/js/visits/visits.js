const getVisitByDeliver = async () => {
    const deliverId = localStorage.getItem('selectedDeliverId');
    let visits = ``;
    try {
        const response = await axiosClient.get(`/visits/deliver/${deliverId}`);
        console.log(response.data);
        console.log(deliverId);
        if (!response.data.length > 0) {
            visits = "<h3>No hay datos que mostrar aún</h3>"
        }else{
            response.data.forEach((visit, index) => {
                visits += `
                    <div class="card shadow-sm mb-3" onclick="getStoreId(${visit.store.id}, ${visit.id})">
                        <div class="card-body align-items-center">
                            <div class="row justify-content-between align-items-center">
                                <div class="col-8 d-flex align-items-center">
                                    <div class="m-1">
                                        <h1 class="circle-visit-large mx-auto ${index % 2 == 0 ? 'bg-rosa' : 'bg-morado'}"><i class="fas fa-store"></i></h1>
                                    </div>
                                    <div style="margin-left: 10px;">
                                        <h3>${visit.store.name}</h3>
                                        <p style="margin-top: -5px;">${visit.store.address}</p>
                                        <p style="margin-top: -10px;"><span class="badge badge-pill bg-success text-white">${visit.status.desciprtion}</span></p>
                                    </div>
                                </div>
                                <div class="col d-flex align-items-center justify-content-end h-100">
                                    <p class="m-0"><i class="fas fa-calendar-alt"></i> <span class="visit-date">${visit.day_visit}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;         
            });
        }
        document.getElementById('visitas').innerHTML = visits;
    } catch (error) {
        console.log(error);
    }
}

const getDeliverVisits = async () => {
    const deliverId = localStorage.getItem('selectedDeliverId');
    const idDeliver = localStorage.getItem('idPerson');
    let visits = ``;
    try {
        const response = await axiosClient.get(`/visits/pending/${idDeliver}`);
        console.log(response.data);
        console.log(deliverId);
        if (!response.data.length > 0) {
            visits = "<h3>No hay datos que mostrar aún</h3>"
        }else{
            response.data.forEach((visit, index) => {
                visits += `
                    <div class="card shadow-sm mb-3 card-visit" onclick="getStoreId(${visit.store.id}, ${visit.id})">
                        <div class="card-body align-items-center">
                            <div class="row justify-content-between align-items-center">
                                <div class="col-8 d-flex align-items-center">
                                    <div class="m-1">
                                        <h1 class="circle-visit-large mx-auto ${index % 2 == 0 ? 'bg-rosa' : 'bg-morado'}"><i class="fas fa-store"></i></h1>
                                    </div>
                                    <div style="margin-left: 10px;">
                                        <h3>${visit.store.name}</h3>
                                        <p style="margin-top: -5px;">${visit.store.address}</p>
                                        <p style="margin-top: -10px;"><span class="badge badge-pill bg-warning text-white">${visit.status.desciprtion}</span></p>
                                    </div>
                                </div>
                                <div class="col d-flex align-items-center justify-content-end h-100">
                                    <p class="m-0"><i class="fas fa-calendar-alt"></i> <span class="visit-date">${visit.day_visit}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;         
            });
        }
        document.getElementById('visitas').innerHTML = visits;
    } catch (error) {
        console.log(error);
    }
}

const getVisitByDeliverAdmin = async () => {
    const deliverId = localStorage.getItem('selectedDeliverId');
    let visits = ``;
    try {
        const response = await axiosClient.get(`/visits/deliver/${deliverId}`);
        console.log(response.data);
        console.log(deliverId);
        if (!response.data.length > 0) {
            visits = "<h3>No hay datos que mostrar aún</h3>"
        }else{
            response.data.forEach((visit, index) => {
                visits += `
                    <div class="card shadow-sm mb-3">
                        <div class="card-body align-items-center">
                            <div class="row justify-content-between align-items-center">
                                <div class="col-8 d-flex align-items-center">
                                    <div class="m-1">
                                        <h1 class="circle-visit-large mx-auto ${index % 2 == 0 ? 'bg-rosa' : 'bg-morado'}"><i class="fas fa-store"></i></h1>
                                    </div>
                                    <div style="margin-left: 10px;">
                                        <h3>${visit.store.name}</h3>
                                        <p style="margin-top: -5px;">${visit.store.address}</p>
                                        <p style="margin-top: -10px;"><span class="badge badge-pill ${visit.status.id == 2 ? 'bg-success' : 'bg-warning'}  text-white">${visit.status.desciprtion}</span></p>
                                    </div>
                                </div>
                                <div class="col d-flex align-items-center justify-content-end h-100">
                                    <p class="m-0"><i class="fas fa-calendar-alt"></i> <span class="visit-date">${visit.day_visit}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;         
            });
        }
        document.getElementById('visitas').innerHTML = visits;
    } catch (error) {
        console.log(error);
    }
}

const getStoreId = (idStore, idVisit) => {
    localStorage.setItem('selectedStoreId', idStore);
    localStorage.setItem('selectedVisitId', idVisit);
    window.location.href = '../pedidos/pedidos.html'
}