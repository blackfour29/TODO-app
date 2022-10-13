const Utils = (() => {

  function generateUniqueId(){
    let timestamp = Date.now();
    timestamp = timestamp.toString().slice(5);
    let randomNumber = Math.floor(Math.random() * 10000);
    let id = `${timestamp}${randomNumber}`;
    return id;
  }

  return {generateUniqueId}

})();

export default Utils;