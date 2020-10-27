import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    contacts: JSON.parse(localStorage.getItem("contacts") || "[]"),
  },
  mutations: {
    createContact(state, contact) {
      state.contacts.push(contact);

      localStorage.setItem("contacts", JSON.stringify(state.contacts));
    },
    updateContact(state, { id, name, sname, phone, fields }) {
      const contacts = state.contacts.concat();

      const idx = contacts.findIndex((x) => x.id === id);
      const contact = contacts[idx];

      contacts[idx] = { ...contact, name, sname, phone, fields };

      state.contacts = contacts;
      localStorage.setItem("contacts", JSON.stringify(state.contacts));
    },
    deleteContact(state, id) {
      const contacts = state.contacts.concat();
      const idx = contacts.findIndex((x) => x.id === id);
      contacts.splice(idx, 1);
      state.contacts = contacts;
      localStorage.setItem("contacts", JSON.stringify(state.contacts));
    },
  },
  actions: {
    createContact({ commit }, contact) {
      commit("createContact", contact);
    },
    updateContact({ commit }, contact) {
      commit("updateContact", contact);
    },
    deleteContact({ commit }, id) {
      commit("deleteContact", id);
    },
  },
  getters: {
    contacts: (state) => state.contacts,
    contactById: (state) => (id) => state.contacts.find((x) => x.id === id),
  },
});
