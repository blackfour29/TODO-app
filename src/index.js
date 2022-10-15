import DOM from "./dom.js";

const dom = new DOM();

const APP = (() => {
  let groups = {
    "First Group": [],
  };

  function addGroup(groupName) {
    groups[groupName] = [];
  }

  function getGroups() {
    return groups;
  }

  function addTodoToGroup(todo, group) {
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(todo);
    // console.log(groups);
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
    console.log(groups);
  }

  return {
    addGroup,
    getGroups,
    addTodoToGroup,
    updateTodo,
    getTodo,
    removeTodo,
  };
})();

export default APP;
