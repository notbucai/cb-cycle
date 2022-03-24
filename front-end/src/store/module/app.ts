import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import store from 'store2';

@Module({ namespaced: true, name: 'app' })
export default class App extends VuexModule {
  token: string = store.get('token', '');

  @Mutation
  SET_TOKEN (token: string) {
    this.token = token;
    store.set('token', token);
  }

}