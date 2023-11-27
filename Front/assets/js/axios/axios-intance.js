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
  