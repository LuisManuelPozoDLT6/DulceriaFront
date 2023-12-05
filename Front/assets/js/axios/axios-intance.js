const axiosClient = axios.create({
    baseURL: 'http://localhost:8090/api',
  });

  axiosClient.interceptors.response.use(
    function (response) {
      return response.data;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  
  axiosClient.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      const token = localStorage.getItem('token');
      if (!config.url.includes('auth')) {
        if (token) {
          if (!config.url.includes('auth')) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }else{
          window.location.href = '/index.html';
          
        }
      }
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  
  // axiosClient.interceptors.response.use(
  //   function (response) {
  //     return response;  
  //   },
  //   function (error) {
  //     if (error.response && error.response.status === 401) {
  //       window.location.href = '/index.html';
  //     }
  
  //     return Promise.reject(error); 
  //   }
  // );