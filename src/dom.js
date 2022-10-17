import Todo from './todo.js';
import APP from './index.js';
import Utils from './utils.js';
import Storage from './storage.js';

const overlay = document.querySelector('.overlay');
const sidebar = document.querySelector('.sidebar');
const addForm = document.querySelector('.add-form-container');
const groupForm = document.querySelector('.add-form__group');
const addTodoOption = document.querySelector('.add-form__add-todo-option');
const addGroupOption = document.querySelector('.add-form__add-group-option');
const addBtn = document.querySelector('.add-button');
const addFormCloseBtn = document.querySelector('.add-form__close-button');
const todoForm = document.querySelector('.add-form__todo');
const todoContainer = document.querySelector('.todo-container');
const sidebarGroupEl = document.querySelector('.groups');
const formGroupSelectEl = document.querySelector('#todo__group-options');
const editForm = document.querySelector('.edit-todo-popup');
const editFormCloseBtn = document.querySelector('.edit-popup__close-button');
const editTitleInput = document.querySelector('.edit-popup__title-input');
const editDescriptionInput = document.querySelector('.edit-popup__description-input');
const todoPopup = document.querySelector('.todo-popup-container');
const todoPopupCloseBtn = document.querySelector('.todo-popup__close-button');
const todoPopupTitle = document.querySelector('.todo-popup__title');
const todoPopupDescription = document.querySelector('.todo-popup__description');
const todoPopupPriority = document.querySelector('.todo-popup__priority');
const todoPopupDeadline = document.querySelector('.todo-popup__deadline');
const todoPopupGroup = document.querySelector('.todo-popup__group');
const sidebarTimeOptions = document.querySelectorAll('.sidebar__time-option');
const todoFormTitleInput = document.querySelector('.todo__title-input');
const todoFormDescriptionInput = document.querySelector('.todo__description-input');
const todoFormDateInput = document.querySelector('#todo__date-input');
const todoFormGroupOption = document.querySelector('#todo__group-options');
const todoFormPriorityCheckboxes = document.querySelectorAll('.todo__priority-input');
const groupFormGroupNameInput = document.querySelector('.group__name-input');
const editFormDateInput = document.querySelector('#edit-popup__date-input');
const editFormPriorityCheckboxes = document.querySelectorAll('.edit-popup__priority-input');
const editFormTitleInput = document.querySelector('.edit-popup__title-input');
const editFormDescriptionInput = document.querySelector('.edit-popup__description-input');
const groupFormRemainingCharacters = document.querySelector('.group__remaining-characters-value');

class DOM {
  overlay = document.querySelector('.overlay');
  randomValue = 5;
  constructor() {
    addBtn.addEventListener('click', () => {
      DOM.showElement(overlay, addForm);
      DOM.updateFormGroupSelection();
      DOM.resetGroupCharacterLimit(50);
    });

    addFormCloseBtn.addEventListener('click', () => {
      DOM.hideElement(overlay, addForm);
    });

    addGroupOption.addEventListener('click', () => {
      DOM.hideElement(todoForm);
      DOM.showElement(groupForm);
      DOM.clearAddTodoOption();
      DOM.markAddGroupOptionSelected();
    });

    addTodoOption.addEventListener('click', () => {
      DOM.showElement(todoForm);
      DOM.hideElement(groupForm);
      DOM.markAddTodoOptionSelected();
      DOM.clearAddGroupOption();
    });

    todoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = todoFormTitleInput.value;
      const description = todoFormDescriptionInput.value;
      const checkedStatus = false; // this is the default value and it is needed when creating the todo object
      let date = todoFormDateInput.value;

      if (!date) {
        // show a descriptive message instead of a blank space
        date = 'Not set';
      }

      let group = todoFormGroupOption.value;
      group = group.trim();

      let priority;
      todoFormPriorityCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          priority = checkbox.classList[1].split('-'); // todo__priority-level-LOW / MEDIUM / HARD
        }
      });

      priority = priority[priority.length - 1]; // LOW / MEDIUM / HARD
      let uniqueId = Utils.generateUniqueId();

      let todo = new Todo(title, description, date, priority, group, uniqueId, checkedStatus);
      DOM.renderTodo(todo);
      DOM.clearAddTodoForm();
      APP.addTodoToGroup(todo, todo.group);
    });

    groupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let groupName = groupFormGroupNameInput.value.slice(0, 50);
      groupName = Utils.removeExtraWhitespace(groupName);
      DOM.renderGroup(groupName);
      DOM.clearAddGroupForm();
      DOM.hideElement(overlay, addForm);
      APP.addGroup(groupName);
    });

    editForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!editForm.id) {
        return;
      }

      const formId = editForm.id;
      const todoTitle = editTitleInput.value;
      const todoDescription = editDescriptionInput.value;

      let todoDeadline = editFormDateInput.value;
      if (!todoDeadline) {
        todoDeadline = 'not set';
      }

      let todoPriority;
      editFormPriorityCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          todoPriority = checkbox.value;
        }
      });

      APP.updateTodo(formId, {
        title: todoTitle,
        deadline: todoDeadline,
        description: todoDescription,
        priority: todoPriority,
      });

      const todosOnPage = document.querySelectorAll('.todo');

      todosOnPage.forEach((todo) => {
        if (todo.id === formId) {
          todo.querySelector('.todo__title').textContent = todoTitle;
          todo.querySelector('.todo__date').textContent = todoDeadline;
          todo.removeAttribute('class');
          todo.setAttribute('class', 'todo');
          todo.classList.add(`todo__${todoPriority}-priority`);
        }
      });
      DOM.hideElement(overlay, editForm);
    });

    todoContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('todo__edit-button')) {
        const htmlTodoId = event.target.closest('.todo').id; // i could declare this in the outer scope, but that will flood the console with errors if the user clicks anywhere in the container so i have to rewrite it in each if scope
        let todoObj = APP.getTodo(htmlTodoId);

        const todoTitle = todoObj.title;
        const todoDescription = todoObj.description;
        const todoPriority = todoObj.priority;
        const todoDeadline = todoObj.deadline;

        DOM.populateAndSetupEditForm({
          title: todoTitle,
          description: todoDescription,
          deadline: todoDeadline,
          priority: todoPriority,
          id: htmlTodoId,
        });

        DOM.showElement(overlay, editForm);
      } else if (event.target.classList.contains('todo__delete-button')) {
        const htmlTodoId = event.target.closest('.todo').id;
        APP.removeTodo(htmlTodoId);
        DOM.removeTodoFromUi(htmlTodoId);
      } else if (event.target.classList.contains('todo__details-button')) {
        const htmlTodoId = event.target.closest('.todo').id;
        const todoItem = APP.getTodo(htmlTodoId);
        DOM.populateTodoPopup(todoItem);
        DOM.showElement(overlay, todoPopup);
      } else if (event.target.classList.contains('todo__checkbox')) {
        const htmlTodo = event.target.closest('.todo');
        const htmlTodoId = htmlTodo.id;
        const htmlTodoTitle = htmlTodo.querySelector('.todo__title');
        const checkbox = event.target;
        if (checkbox.checked) {
          htmlTodoTitle.classList.add('strikethrough');
        } else {
          htmlTodoTitle.classList.remove('strikethrough');
        }
        APP.updateTodo(htmlTodoId, { checked: checkbox.checked });
      }
    });

    editFormCloseBtn.addEventListener('click', () => {
      DOM.hideElement(overlay, editForm);
    });

    todoPopupCloseBtn.addEventListener('click', () => {
      DOM.hideElement(overlay, todoPopup);
    });

    sidebarGroupEl.addEventListener('click', (event) => {
      if (event.target.classList.contains('group')) {
        let group = event.target;
        DOM.highlightSelectedSidebarOption(group);
        let groupName = event.target.textContent.trim();
        let groupTodos = APP.getTodosFromGroup(groupName);
        DOM.renderTodos(groupTodos);
      } else if (event.target.classList.contains('group__delete-button')) {
        event.stopPropagation();
        const group = event.target.parentElement;
        const groupName = group.textContent.trim();
        DOM.removeGroupFromUi(group);
        APP.deleteGroup(groupName);
        DOM.removeTodosFromGroup(groupName);
      }
    });

    sidebarTimeOptions.forEach((option) => {
      option.addEventListener('click', (event) => {
        const selectedOption = event.target.textContent; // Today / Next 7 days / Current Month / All

        const selectedOptionHtml = event.target;
        DOM.highlightSelectedSidebarOption(selectedOptionHtml);
        const todos = APP.getAllTodos();
        todoContainer.innerHTML = '';
        const currentDate = new Date();

        if (selectedOption === 'Today') {
          todos.forEach((todo) => {
            const todoDeadlineDay = todo.deadline.split('-')[2];
            const currentDay = currentDate.getDate().toString();
            if (todoDeadlineDay === currentDay) {
              DOM.renderTodo(todo);
            }
          });
        } else if (selectedOption === 'Next 7 days') {
          const currentDayAsNumber = parseInt(currentDate.getDate());
          const currentMonth = (currentDate.getMonth() + 1).toString(); // january is 0
          const currentMonthAsNumber = parseInt(currentMonth);

          todos.forEach((todo) => {
            const todoDeadlineDayAsNumber = parseInt(todo.deadline.split('-')[2]);
            const todoDeadlineMonth = todo.deadline.split('-')[1];
            const todoDeadlineMonthAsNumber = parseInt(todoDeadlineMonth);

            if (todoDeadlineMonth === currentMonth) {
              if (todoDeadlineDayAsNumber - currentDayAsNumber <= 6) {
                DOM.renderTodo(todo);
              }
            } else if (todoDeadlineMonthAsNumber - currentMonthAsNumber == 1) {
              // for situations like 29.10 and 02.11, so consecutive months that still fit in the 7 day range
              const currentMonthDays = Utils.getCurrentMonthDays(currentMonthAsNumber);
              const daysDifference = currentMonthDays - currentDayAsNumber + todoDeadlineDayAsNumber;
              if (daysDifference <= 6) {
                DOM.renderTodo(todo);
              }
            }
          });
        } else if (selectedOption === 'Current month') {
          const currentMonth = (currentDate.getMonth() + 1).toString();
          todos.forEach((todo) => {
            const todoDeadlineMonth = todo.deadline.split('-')[1];
            if (todoDeadlineMonth === currentMonth) {
              DOM.renderTodo(todo);
            }
          });
        } else if (selectedOption === 'All') {
          todos.forEach((todo) => {
            DOM.renderTodo(todo);
          });
        }
      });
    });

    window.addEventListener('DOMContentLoaded', () => {
      const storedData = Storage.getStoredData();
      if (storedData) {
        APP.updateGroups(storedData);
        const storedGroups = APP.getGroupNames();
        storedGroups.forEach((group) => {
          if (group !== 'First Group') {
            // the 'First Group' is created automatically and is the default group.
            DOM.renderGroup(group);
          }
        });
        const todos = APP.getAllTodos();
        todos.forEach((todo) => {
          DOM.renderTodo(todo);
        });
      } else {
        let groups = {
          'First Group': [],
        };
        APP.setGroups(groups);
      }
    });

    groupFormGroupNameInput.addEventListener('input', () => {
      const inputLength = groupFormGroupNameInput.value.length;
      const charactersDifference = 50 - inputLength;
      if (charactersDifference >= 0) {
        groupFormRemainingCharacters.textContent = charactersDifference;
      }
    });
  } // end of constructor here

  static showElement(...elementsToDisplay) {
    elementsToDisplay.forEach((element) => {
      element.classList.remove('hidden');
    });
  }

  static hideElement(...elementsToHide) {
    elementsToHide.forEach((element) => {
      element.classList.add('hidden');
    });
  }

  static clearAddTodoOption() {
    addTodoOption.classList.remove('add-form__selected-option');
  }

  static clearAddGroupOption() {
    addGroupOption.classList.remove('add-form__selected-option');
  }

  static markAddGroupOptionSelected() {
    addGroupOption.classList.add('add-form__selected-option');
  }

  static markAddTodoOptionSelected() {
    addTodoOption.classList.add('add-form__selected-option');
  }

  static renderTodo(todo) {
    let todoHtml = document.createElement('div');
    todoHtml.classList.add('todo');
    todoHtml.classList.add(`todo__${todo.priority}-priority`);
    todoHtml.setAttribute('id', `${todo.id}`);

    todoHtml.innerHTML = `
      <input type="checkbox" class="todo__checkbox" ${todo.checked ? 'checked' : ''}>
      <p class="todo__title ${todo.checked ? 'strikethrough' : ''}">${todo.title}</p>
      <button class="todo__details-button">Details</button>
      <p class="todo__date">${todo.deadline}</p>
      <i class="fa-solid fa-pen-to-square todo__edit-button"></i>
      <i class="fa-solid fa-trash-can todo__delete-button"></i>
    `;

    todoContainer.prepend(todoHtml);
    DOM.hideElement(overlay, addForm);
  }

  static renderGroup(groupName) {
    const groupItemHtml = document.createElement('li');
    groupItemHtml.classList.add('group');
    groupName = groupName.trim();
    groupItemHtml.innerHTML = `${groupName} <i class="fa-solid fa-trash-can group__delete-button"></i>`;
    sidebarGroupEl.appendChild(groupItemHtml);
  }

  static clearAddTodoForm() {
    todoFormTitleInput.value = '';
    todoFormDateInput.value = '';
    todoFormDescriptionInput.value = '';
  }

  static clearAddGroupForm() {
    groupFormGroupNameInput.value = '';
  }

  static updateFormGroupSelection() {
    const groupItems = document.querySelectorAll('.group');
    formGroupSelectEl.innerHTML = '';
    groupItems.forEach((group) => {
      const groupEl = document.createElement('option');
      groupEl.value = group.textContent;
      groupEl.textContent = group.textContent;
      formGroupSelectEl.appendChild(groupEl);
    });
  }

  static removeTodoFromUi(id) {
    const todos = document.querySelectorAll('.todo');
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        todos[i].remove();
        break;
      }
    }
  }

  static populateTodoPopup(todoData) {
    todoPopupTitle.textContent = todoData.title;
    todoPopupDescription.textContent = todoData.description;
    todoPopupPriority.textContent = todoData.priority;
    todoPopupDeadline.textContent = todoData.deadline;
    todoPopupGroup.textContent = todoData.group;
  }

  static populateAndSetupEditForm(todoData) {
    editFormTitleInput.value = todoData.title;
    editFormDescriptionInput.value = todoData.description;
    editFormDateInput.value = todoData.deadline;

    editFormPriorityCheckboxes.forEach((checkbox) => {
      if (checkbox.value === todoData.priority) {
        checkbox.checked = true;
      }
    });
    editForm.setAttribute('id', todoData.id);
  }

  static renderTodos(todos) {
    todoContainer.innerHTML = '';
    if (!todos) {
      return;
    }
    todos.forEach((todo) => {
      DOM.renderTodo(todo);
    });
  }

  static highlightSelectedSidebarOption(element) {
    const sidebarOptions = sidebar.querySelectorAll('li');
    sidebarOptions.forEach((option) => option.classList.remove('sidebar-selected-option'));
    element.classList.add('sidebar-selected-option');
  }

  static removeGroupFromUi(el) {
    el.remove();
  }

  static resetGroupCharacterLimit(value) {
    groupFormRemainingCharacters.textContent = value;
  }

  static removeTodosFromGroup(groupName) {
    location.reload();
  }
}

export default DOM;
