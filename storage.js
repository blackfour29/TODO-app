const Storage = (() => {
  function updateLocalStorage(data) {
    localStorage.removeItem('groups');
    localStorage.setItem('groups', JSON.stringify(data));
  }

  function getStoredData() {
    const data = JSON.parse(localStorage.getItem('groups'));
    return data;
  }

  return { updateLocalStorage, getStoredData };
})();

export default Storage;
