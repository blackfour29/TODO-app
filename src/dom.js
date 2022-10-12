import Todo from './todo.js';
import APP from './index.js'; 


const overlay = document.querySelector('.overlay');
const addForm = document.querySelector('.add-form-container');
const groupForm = document.querySelector('.add-form__group');
const addTodoOption = document.querySelector('.add-form__add-todo-option');
const addGroupOption = document.querySelector('.add-form__add-group-option');
const addBtn = document.querySelector('.add-button');
const addFormCloseBtn = document.querySelector('.add-form__close-button');
const todoForm = document.querySelector('.add-form__todo');
const todoContainer = document.querySelector('.todo-container')
const sidebarGroupEl = document.querySelector('.groups');
const formGroupSelectEl = document.querySelector('#todo__group-options');

class DOM {
  
  constructor(){
    console.log('y');
    addBtn.addEventListener('click', () => {
      DOM.showOverlay();
      DOM.updateUserGroups();
      DOM.showAddForm();
    })

    addFormCloseBtn.addEventListener('click', () => {
      DOM.hideOverlay();
      DOM.hideAddForm();
    })

    addGroupOption.addEventListener('click', () => {
      DOM.hideTodoForm();
      DOM.showGroupForm();
      DOM.clearAddTodoOption();
      DOM.markAddGroupOptionSelected();
    })

    addTodoOption.addEventListener('click', () => {
      DOM.showTodoForm();
      DOM.hideGroupForm();
      DOM.markAddTodoOptionSelected();
      DOM.clearAddGroupOption();
    })

    todoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = todoForm.querySelector('.todo__title-input').value;
      const description = todoForm.querySelector('.todo__description-input').value;
      let date = todoForm.querySelector('#todo__date-input').value;
      
      if(date === 'undefined'){  // need to check if the value of date is the string 'undefined', if it is show something else instead
        date = 'Not set';
      }
      
      const group = todoForm.querySelector('#todo__group-options').value;
      let priority;

      const priorityCheckboxes = document.querySelectorAll('.todo__priority-input');
      priorityCheckboxes.forEach(checkbox => {
        if(checkbox.checked){
          priority = checkbox.classList[1].split('-'); // todo__priority-level-LOW / MEDIUM / HARD
        }
      });

      priority = priority[priority.length - 1];

      let todo = new Todo(title, description, date, priority, group);
      DOM.renderTodo(todo);
      DOM.clearAddTodoForm();
      APP.addTodoToGroup(todo, todo.group);
      console.log("submitted");
    })


    groupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let groupItem = document.createElement('li');
      groupItem.classList.add('group');

      let groupName = document.querySelector('.group__name-input').value;
      groupItem.textContent = `${groupName}`;

      sidebarGroupEl.appendChild(groupItem);
      DOM.clearAddGroupForm();
      DOM.hideOverlay();
      DOM.hideAddForm();
      APP.addGroup(`${groupName}`);
    })

  } // end of constructor here

  static showOverlay(){
    overlay.classList.remove('hidden');
  }

  static hideOverlay(){
    overlay.classList.add('hidden');
  }

  static showAddForm(){
    addForm.classList.remove('hidden');
  }

  static hideAddForm(){
    addForm.classList.add('hidden');
  }

  static showTodoForm(){
    todoForm.classList.remove('hidden');
  }

  static hideTodoForm(){
    todoForm.classList.add('hidden');
  }
  
  static showGroupForm(){
    groupForm.classList.remove('hidden');
  }
  
  static hideGroupForm(){
    groupForm.classList.add('hidden');
  }

  static clearAddTodoOption(){
    addTodoOption.classList.remove('add-form__selected-option');
  }

  static clearAddGroupOption(){
    addGroupOption.classList.remove('add-form__selected-option');
  }
  
  static markAddGroupOptionSelected(){
    addGroupOption.classList.add('add-form__selected-option');
  }

  static markAddTodoOptionSelected(){
    addTodoOption.classList.add('add-form__selected-option');
  }

  static renderTodo(todo){

    let todoHtml = document.createElement('div');
    todoHtml.classList.add('todo');
    todoHtml.classList.add(`todo__${todo.priority}-priority`);

     todoHtml.innerHTML = `
      <input type="checkbox" class="todo__checkbox">
      <p class="todo__title">${todo.title}</p>
      <button class="todo__details-button">Details</button>
      <p class="todo__date">${todo.deadline.format}</p>
      <button class="todo__edit-button"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="todo__delete-button"><i class="fa-solid fa-trash-can"></i></button>
    `;

    todoContainer.prepend(todoHtml);

    DOM.hideOverlay();
    DOM.hideAddForm();
    
  }

  static clearAddTodoForm(){
    document.querySelector('.todo__title-input').value = '';
    document.querySelector('.todo__description-input').value = '';
    document.querySelector('#todo__date-input').value = '';
  }

  static clearAddGroupForm(){
    document.querySelector('.group__name-input').value = '';
  }

  static updateUserGroups(){
    const groupItems = document.querySelectorAll('.group');
    formGroupSelectEl.innerHTML = ''; 
    console.log(groupItems.length);
      groupItems.forEach(group => {
      const groupEl = document.createElement('option');
      groupEl.value = group.textContent;
      console.log(`Added ${group.textContent}`);
      groupEl.textContent = group.textContent;
      formGroupSelectEl.appendChild(groupEl);
    });

  }
  
}


export default DOM;