import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true, name: 'app' })
export default class App extends VuexModule {
  token: string = '';

  @Mutation
  SET_TOKEN (token: string) {
    this.token = token;
  }

}