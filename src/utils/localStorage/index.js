export const addLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};
export const getLocalStorage = (key) => {
  return localStorage.getItem(key);
};
export const delLocalStorage = (key) => {
  localStorage.removeItem(key);
};
