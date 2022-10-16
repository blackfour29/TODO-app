import DOM from './dom.js';
import Storage from './storage.js';

const dom = new DOM();

const APP = (() => {
  let groups = {
    'First Group': [],
  };

  function addGroup(groupName) {
    groups[groupName] = [];
    Storage.updateLocalStorage(groups);
  }

  function getGroupNames() {
    const groupNames = [];
    for (const [key, value] of Object.entries(groups)) {
      groupNames.push(key);
    }
    return groupNames;
  }

  function addTodoToGroup(todo, group) {
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(todo);
    Storage.updateLocalStorage(groups);
  }

  function updateTodo(id, newData) {
    for (const [key, value] of Object.entries(groups)) {
      for (const [index, element] of value.entries()) {
        if (element.id == id) {
          element.title = newData.title;
          element.description = newData.description;
          element.deadline = newData.deadline;
          element.priority = newData.priority;
        }
      }
    }
    Storage.updateLocalStorage(groups);
  }

  function getTodo(id) {
    for (const [key, value] of Object.entries(groups)) {
      for (const [index, element] of value.entries()) {
        if (element.id == id) {
          return element;
        }
      }
    }
  }

  function removeTodo(id) {
    for (const [key, value] of Object.entries(groups)) {
      for (const [index, element] of value.entries()) {
        if (element.id == id) {
          groups[key].splice(index, 1);
        }
      }
    }
    Storage.updateLocalStorage(groups);
  }

  function getTodosFromGroup(group) {
    return groups[group];
  }

  function getAllTodos() {
    const todos = [];
    for (const [key, value] of Object.entries(groups)) {
      for (const [index, element] of value.entries()) {
        todos.push(element);
      }
    }
    return todos;
  }

  function updateGroups(data) {
    groups = data;
  }

  function setGroups(value) {
    groups = value;
  }

  return {
    addGroup,
    getGroupNames,
    addTodoToGroup,
    updateTodo,
    getTodo,
    removeTodo,
    getTodosFromGroup,
    getAllTodos,
    updateGroups,
    setGroups,
  };
})();

export default APP;
