const btnLogout = document.getElementById('btnLogout');



const changeView = (role) => {
    role = role;
    switch (role) {
      case 'Admin':
        window.location.href = '/pages/admin/stores/stores.html';
        break;
      case 'Repartidor':
        window.location.href = '/pages/repartidor/stores/stores.html';
        break;
      default:
        window.location.href = '/index.html';
        localStorage.clear();
        role = '';
    }
  };

  const getPersonName = async () => {
    const id = localStorage.getItem('idPerson');
    try {
      response = await axiosClient.get(`/person/${id}`)
      let fullName = response.data.name + ' ' + response.data.lastName;
      const userNameLogged = document.getElementById('userNameLogged');
      userNameLogged.innerText = fullName;
    } catch (error) {
      console.log(error);
    }
  }
  
  const logout = async () => {
    Swal.fire({
      title: "Quieres cerrar tu sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4B2883",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
  }).then(async (result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        changeView('');
      } else {
          Swal.fire({
              title: "Cancelado",
              text: "Tu sesión continua abierta.",
              icon: "error"
          });
      }
  });
  };

  const setMinDate = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('visitDay').min = currentDate;
  }

  
  btnLogout.addEventListener('click', logout);
  getPersonName();