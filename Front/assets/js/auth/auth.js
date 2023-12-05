const form = document.getElementById('signinForm');


const submitSigninForm = async (event) =>{
    const btnLogin = document.getElementById('btnLogin');
    // <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
    btnLogin.innerHTML = `<div class="spinner-border ms-auto text-light" role="status" aria-hidden="true"></div>`;
    console.log('formulario login');
    event.stopPropagation();
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await axiosClient.post(`/auth/login`, {
            username, password
        });
        console.log(response);
        const payload = JSON.parse(atob(response.data.token.split('.')[1]));
        console.log(payload);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('activeRole', response.data.user.authorities[0].authority);
        localStorage.setItem('idUser', response.data.userInfo.id);
        localStorage.setItem('idPerson', response.data.userInfo.person.id);
        changeView(response.data.user.authorities[0].authority);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Correo y/o contraseña iconrrecto",
            showConfirmButton: false,
            timer: 1500
        });
        btnLogin.innerText = `Ingresar`;
        console.log("error:" + error);
    }

}

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

// const submitSigninForm2 = async (event) => {
//     console.log("Entro aqui");
//     event.stopPropagation();
//     event.preventDefault();
//     if (form.checkValidity()) {
//       const username = document.getElementById('yourUsername').value;
//       const password = document.getElementById('yourPassword').value;
//       try {
//         const response = await axiosClient.post(`/auth/signin`, {
//           username,
//           password,
//         });
//         console.log(response);
//         const payload = JSON.parse(atob(response.token.split('.')[1]));
//         console.log(payload);
//         if (response?.token) {
//           fullname = `${payload.person.name} ${payload.person.surname}${
//             payload.person.lastname ? ` ${payload.person.lastname}` : ''
//           }`;
//           localStorage.setItem('token', response.token);
//           localStorage.setItem('activeRole', payload.roles[0].role);
//           localStorage.setItem('fullname', fullname);
//           toastMessage(`Bienvenido ${username}`).showToast();
//           changeView(payload.roles[0].role);
//         }
//       } catch (error) {
//         console.log(error);
//         toastMessage('Credenciales incorrectas').showToast();
//       }
//     }
//   };
  
  form.addEventListener('submit', submitSigninForm);