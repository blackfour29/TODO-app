const addBtn = document.querySelector('.add-button');
const overlay = document.querySelector('.overlay');
const addForm = document.querySelector('.add-form-container');
const addFormCloseBtn = document.querySelector('.add-form__close-button');
const addTodoOption = document.querySelector('.add-form__add-todo-option');
const addGroupOption = document.querySelector('.add-form__add-group-option');
const todoForm = document.querySelector('.add-form__todo');
const groupFrom = document.querySelector('.add-form__group');


addBtn.addEventListener('click', () => {
  showElement(overlay, addForm);
})

addFormCloseBtn.addEventListener('click', () => {
  hideElement(overlay, addForm);
})

addGroupOption.addEventListener('click', () => {
  hideElement(todoForm);
  showElement(groupFrom);
  addTodoOption.classList.remove('add-form__selected-option');
  addGroupOption.classList.add('add-form__selected-option');
})

addTodoOption.addEventListener('click', () => {
  showElement(todoForm);
  hideElement(groupFrom);
  addTodoOption.classList.add('add-form__selected-option');
  addGroupOption.classList.remove('add-form__selected-option');
})

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log("submitted");
})

groupFrom.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log("submitted");
})





function showElement(...elementsToDisplay){
  elementsToDisplay.forEach(element => {
    element.classList.remove('hidden');
  })
}

function hideElement(...elementsToHide){
  elementsToHide.forEach(element => {
    element.classList.add('hidden');
  })
}
