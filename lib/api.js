/* eslint-disable no-param-reassign */
import axios from 'axios';
import { setItem, getItem } from './localstorage';

const isServer = !process.browser;
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

const api = axios.create({
  baseURL: isServer ? 'http://localhost:3000/api/' : '/api/',
});

api.interceptors.request.use(async config => {
  const token = await getItem('jwt');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(async (response) => {
  if (response.headers.token) {
    await setItem('jwt', response.headers.token);
  }
  return response;
}, (error) => {
  console.log(error);
});

export default {
  client: api,

  // users
  login: async data => (await api.post('users/login', data)).data,

  // pages
  getPages: async () => (await api.get('pages')).data,
  getCoreCategories: async () => (await api.get('pages/core-categories')).data,
  getCategoryPages: async params => (await api.get('pages/category-pages', { params })).data,
  getPageByAlias: async alias => (await api.get(`pages/${alias}`)).data,
  createPage: async data => (await api.post('pages', data)).data,
  uploadPageImage: async data => (await api.post('pages/upload-image', data, multipart)).data,
  updatePage: async data => (await api.put('pages', data)).data,
  updateCategoryPages: async data => (await api.put('pages/update-category-pages', data)).data,
  deletePage: async params => (await api.delete('pages', { params })).data,
  deleteAllCategoryPages: async params => (await api.delete('pages/remove-all-category-pages', { params })).data,

};
