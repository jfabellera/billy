import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// axiosInstance.defaults.headers.common['Authorization'] =
//   'Bearer ' + localStorage.getItem('accessToken');

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  config.headers.Authorization = 'Bearer ' + token;

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    return new Promise((resolve, reject) => {
      const originalRequest = err.config;
      const refreshToken = localStorage.getItem('refreshToken');
      if (
        err.response &&
        err.response.status === 401 &&
        err.config &&
        !err.config.__isRetryRequest &&
        refreshToken
      ) {
        originalRequest.__isRetryRequest = true;

        const response = fetch(process.env.REACT_APP_AUTH_URL + '/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: refreshToken,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            localStorage.setItem('accessToken', res.accessToken);

            return axiosInstance(originalRequest);
          });
        resolve(response);
      }
      return reject(err);
    });
  }
);

export default axiosInstance;
