import { createStore } from 'vuex';

const store = createStore({
  state: {
    images: [],
  },
  mutations: {
    setImages(state, images) {
      state.images = images;
    },
    addImage(state, image) {
      state.images.push(image);
    },
    removeImage(state, name) {
      const index = state.images.findIndex(({ filename }) => {
        return filename === name;
      });
      state.images.splice(index, 1);
    },
  },
  actions: {
    setImages({ commit }, images) {
      commit('setImages', images);
    },
    addImage({ commit }, image) {
      commit('addImage', image);
    },
    removeImage({ commit }, image) {
      commit('removeImage', image);
    },
  },
  getters: {
    getImages(state) {
      return state.images;
    },
  },
});
export default store;
