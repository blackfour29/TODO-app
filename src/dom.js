import Todo from "./todo.js";
import APP from "./index.js";
import Utils from "./utils.js";

const overlay = document.querySelector(".overlay");
const addForm = document.querySelector(".add-form-container");
const groupForm = document.querySelector(".add-form__group");
const addTodoOption = document.querySelector(".add-form__add-todo-option");
const addGroupOption = document.querySelector(".add-form__add-group-option");
const addBtn = document.querySelector(".add-button");
const addFormCloseBtn = document.querySelector(".add-form__close-button");
const todoForm = document.querySelector(".add-form__todo");
const todoContainer = document.querySelector(".todo-container");
const sidebarGroupEl = document.querySelector(".groups");
const formGroupSelectEl = document.querySelector("#todo__group-options");
const editForm = document.querySelector(".edit-todo-popup");
const editFormCloseBtn = document.querySelector(".edit-popup__close-button");
const editTitleInput = document.querySelector(".edit-popup__title-input");
const editDescriptionInput = document.querySelector(
  ".edit-popup__description-input"
);

class DOM {
  constructor() {
    addBtn.addEventListener("click", () => {
      DOM.showOverlay();
      DOM.updateFormGroupSelection();
      DOM.showAddForm();
    });

    addFormCloseBtn.addEventListener("click", () => {
      DOM.hideOverlay();
      DOM.hideAddForm();
    });

    addGroupOption.addEventListener("click", () => {
      DOM.hideTodoForm();
      DOM.showGroupForm();
      DOM.clearAddTodoOption();
      DOM.markAddGroupOptionSelected();
    });

    addTodoOption.addEventListener("click", () => {
      DOM.showTodoForm();
      DOM.hideGroupForm();
      DOM.markAddTodoOptionSelected();
      DOM.clearAddGroupOption();
    });

    todoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = todoForm.querySelector(".todo__title-input").value;
      const description = todoForm.querySelector(
        ".todo__description-input"
      ).value;
      let date = todoForm.querySelector("#todo__date-input").value;

      if (!date) {
        // need to check if the value of date is the string 'undefined', if it is show something else instead
        date = "Not set";
      }

      const group = todoForm.querySelector("#todo__group-options").value;
      let priority;

      const priorityCheckboxes = document.querySelectorAll(
        ".todo__priority-input"
      );
      priorityCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          priority = checkbox.classList[1].split("-"); // todo__priority-level-LOW / MEDIUM / HARD
        }
      });

      priority = priority[priority.length - 1];
      let uniqueId = Utils.generateUniqueId();

      let todo = new Todo(title, description, date, priority, group, uniqueId);
      DOM.renderTodo(todo);
      DOM.clearAddTodoForm();
      APP.addTodoToGroup(todo, todo.group);
    });

    groupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let groupItem = document.createElement("li");
      groupItem.classList.add("group");

      let groupName = document.querySelector(".group__name-input").value;
      groupItem.textContent = `${groupName}`;

      sidebarGroupEl.appendChild(groupItem);
      DOM.clearAddGroupForm();
      DOM.hideOverlay();
      DOM.hideAddForm();
      APP.addGroup(`${groupName}`);
    });

    editForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!editForm.id) {
        return;
      }

      const formId = editForm.id;
      const todoTitle = editTitleInput.value;
      const todoDescription = editDescriptionInput.value;

      let todoDeadline = editForm.querySelector(
        "#edit-popup__date-input"
      ).value;
      if (!todoDeadline) {
        todoDeadline = "not set";
      }

      let todoPriority;
      editForm
        .querySelectorAll(".edit-popup__priority-input")
        .forEach((option) => {
          if (option.checked) {
            todoPriority = option.value;
          }
        });

      // console.log(todoTitle, todoDeadline, todoDescription, todoPriority);
      APP.updateTodo(formId, {
        title: todoTitle,
        deadline: todoDeadline,
        description: todoDescription,
        priority: todoPriority,
      });

      const todosOnPage = document.querySelectorAll(".todo");

      todosOnPage.forEach((todo) => {
        if (todo.id === formId) {
          todo.querySelector(".todo__title").textContent = todoTitle;
          todo.querySelector(".todo__date").textContent = todoDeadline;
          todo.removeAttribute("class");
          todo.setAttribute("class", "todo");
          todo.classList.add(`todo__${todoPriority}-priority`);
        }
      });

      editForm.classList.add("hidden");
      overlay.classList.add("hidden");
    });

    todoContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("todo__edit-button")) {
        const htmlTodoId = event.target.closest(".todo").id;
        let todoObj = APP.getTodo(htmlTodoId);

        const todoTitle = todoObj.title;
        const todoDescription = todoObj.description;
        const todoPriority = todoObj.priority;
        const todoDeadline = todoObj.deadline;

        editForm.querySelector(".edit-popup__title-input").value = todoTitle;
        editForm.querySelector(".edit-popup__description-input").value =
          todoDescription;
        editForm.querySelector("#edit-popup__date-input").value = todoDeadline;
        editForm
          .querySelectorAll(".edit-popup__priority-input")
          .forEach((option) => {
            if (option.value === todoPriority) {
              option.checked = true;
            }
          });
        editForm.setAttribute("id", htmlTodoId);
        DOM.showEditForm();
      } else if (event.target.classList.contains("todo__delete-button")) {
        const htmlTodoId = event.target.closest(".todo").id;
        APP.removeTodo(htmlTodoId);
        DOM.removeTodoFromUi(htmlTodoId);
      }
    });

    editFormCloseBtn.addEventListener("click", () => {
      editForm.classList.add("hidden");
      overlay.classList.add("hidden");
    });
  } // end of constructor here

  static showOverlay() {
    overlay.classList.remove("hidden");
  }

  static hideOverlay() {
    overlay.classList.add("hidden");
  }

  static showAddForm() {
    addForm.classList.remove("hidden");
  }

  static hideAddForm() {
    addForm.classList.add("hidden");
  }

  static showTodoForm() {
    todoForm.classList.remove("hidden");
  }

  static hideTodoForm() {
    todoForm.classList.add("hidden");
  }

  static showGroupForm() {
    groupForm.classList.remove("hidden");
  }

  static hideGroupForm() {
    groupForm.classList.add("hidden");
  }

  static clearAddTodoOption() {
    addTodoOption.classList.remove("add-form__selected-option");
  }

  static clearAddGroupOption() {
    addGroupOption.classList.remove("add-form__selected-option");
  }

  static markAddGroupOptionSelected() {
    addGroupOption.classList.add("add-form__selected-option");
  }

  static markAddTodoOptionSelected() {
    addTodoOption.classList.add("add-form__selected-option");
  }

  static renderTodo(todo) {
    let todoHtml = document.createElement("div");
    todoHtml.classList.add("todo");
    todoHtml.classList.add(`todo__${todo.priority}-priority`);
    // todoHtml.classList.add(`${todo.id}`);
    todoHtml.setAttribute("id", `${todo.id}`);

    todoHtml.innerHTML = `
      <input type="checkbox" class="todo__checkbox">
      <p class="todo__title">${todo.title}</p>
      <button class="todo__details-button">Details</button>
      <p class="todo__date">${todo.deadline}</p>
      <i class="fa-solid fa-pen-to-square todo__edit-button"></i>
      <i class="fa-solid fa-trash-can todo__delete-button"></i>
    `;

    todoContainer.prepend(todoHtml);

    DOM.addEventsToTodo(todoHtml);

    DOM.hideOverlay();
    DOM.hideAddForm();
  }

  static clearAddTodoForm() {
    document.querySelector(".todo__title-input").value = "";
    document.querySelector(".todo__description-input").value = "";
    document.querySelector("#todo__date-input").value = "";
  }

  static clearAddGroupForm() {
    document.querySelector(".group__name-input").value = "";
  }

  static updateFormGroupSelection() {
    const groupItems = document.querySelectorAll(".group");
    formGroupSelectEl.innerHTML = "";
    groupItems.forEach((group) => {
      const groupEl = document.createElement("option");
      groupEl.value = group.textContent;
      groupEl.textContent = group.textContent;
      formGroupSelectEl.appendChild(groupEl);
    });
  }

  static addEventsToTodo(todoEl) {
    let cb = todoEl.querySelector(".todo__checkbox");
    cb.addEventListener("change", () => {
      const todo = cb.nextSibling.nextSibling; // get the title of the todo
      if (cb.checked) {
        todo.classList.add("strikethrough");
      } else {
        todo.classList.remove("strikethrough");
      }
    });
  }

  static showEditForm() {
    editForm.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  static removeTodoFromUi(id) {
    const todos = document.querySelectorAll(".todo");
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        todos[i].remove();
        break;
      }
    }
  }
}

export default DOM;
