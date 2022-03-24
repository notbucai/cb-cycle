'use strict';

import axios, { AxiosRequestConfig } from 'axios';
import store from 'store2';
import router from '../router/index';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// console.log(process.env.NODE_ENV);

let config: AxiosRequestConfig = {
  baseURL: process.env.NODE_ENV === 'development' ? '/api/v1' : '/api/v1',
};

const http = axios.create(config);

http.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    const token = store.get('token');
    if (token) {
      if (!['/users/login'].includes(config.url || '')) {
        if (config?.headers) {
          config.headers.Authorization = 'Bearer ' + token;
        }
      }
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
http.interceptors.response.use(
  function (response) {
    // Do something with response data
    const resData = response.data;
    if (resData.code === 0) {
      return resData.data;
    } else {

      if (resData.code === 403 || resData.code > 1000 && resData.code <= 1010) {
        store.remove('token');
        router.replace({ path: '/login', query: { redirect: router.currentRoute.path } })
      }
      // resData.message && Message.error(resData.message);
    }
    return Promise.reject(resData);
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);


export default http;