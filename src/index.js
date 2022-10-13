import DOM from './dom.js';

const dom = new DOM();

const APP = ( () => {

  let groups = {
    'First Group': [],
  };

  function addGroup(groupName){
    groups[groupName] = [];
  }

  function getGroups(){
    return groups;
  }

  function addTodoToGroup(todo, group){

    if(!groups[group]){
      groups[group] = [];
    }
    groups[group].push(todo);
    console.log(groups);
  }

  return {addGroup, getGroups, addTodoToGroup}
})();

export default APP;




