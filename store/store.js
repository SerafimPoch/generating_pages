/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import {
  runInAction, makeAutoObservable, reaction,
} from 'mobx';
import { enableStaticRendering } from 'mobx-react';
import api from '../lib/api';

import { getItem } from '../lib/localstorage';

const isServer = !process.browser;
enableStaticRendering(isServer);

class Store {
  token = '';

  headerPages = [];

  language = '';

  constructor() {
    makeAutoObservable(this);

    if (typeof window !== 'undefined') {
      this.token = window.localStorage.getItem('jwt');

      reaction(() => this.token, token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      });
    }
  }

  async login(email, password) {
    await api.login({ email, password });
    const token = await getItem('jwt');
    if (token) {
      this.token = token;
    }
  }

   logout = () => {
     this.token = '';
   };

   async getHeaderLinks() {
     const data = (await api.getPages());
     runInAction(() => {
       this.headerPages = data;
     });
   }

   setLanguage(lng) {
     this.language = lng;
   }
}

let store = null;

export function initializeStore(initialData) {
  if (isServer) {
    return new Store(isServer, initialData);
  }
  if (store === null) {
    store = new Store(isServer, initialData);
  }
  return store;
}
