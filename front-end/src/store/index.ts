import Vuex from 'vuex'

import app from './module/app';

const store = new Vuex.Store({
  modules: {
    app
  }
})

export default store;