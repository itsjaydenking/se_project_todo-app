import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopup = document.querySelector("#add-todo-popup");
const addTodoForm = document.querySelector("#add-todo-form");
const addTodoCloseBtn = addTodoPopup.querySelector(".popup__close");
const todosList = document.querySelector(".todos__list");
const counterText = document.querySelector(".counter__text");

const openModal = (modal) => {
  modal.classList.add("popup_visible");
};

const closeModal = (modal) => {
  modal.classList.remove("popup_visible");
};

function updateCounter() {
  const allItems = todosList.querySelectorAll(".todo");
  const completedItems = todosList.querySelectorAll(".todo_completed");
  counterText.textContent = `Showing ${completedItems.length} out of ${allItems.length} completed`;
}

function generateTodo(data) {
  const todo = new Todo(data, "#todo-template");
  const todoElement = todo.getView();

  todoElement.addEventListener("change", (evt) => {
    if (evt.target.classList.contains("todo__completed")) {
      updateCounter();
    }
  });

  todoElement.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("todo__delete-btn")) {
      setTimeout(updateCounter, 0);
    }
  });

  return todoElement;
}

addTodoButton.addEventListener("click", () => {
  openModal(addTodoPopup);
});

addTodoCloseBtn.addEventListener("click", () => {
  closeModal(addTodoPopup);
});

addTodoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const name = evt.target.name.value.trim();
  if (!name) return;

  const dateInput = evt.target.date.value;
  let date = "";
  if (dateInput) {
    const dateObj = new Date(dateInput);
    date = dateObj.toISOString();
  }

  const values = { name, date, completed: false };
  const todoElement = generateTodo(values);
  todosList.append(todoElement);

  closeModal(addTodoPopup);
  addTodoForm.reset();
  formValidator.resetValidation();
  updateCounter();
});

initialTodos.forEach((item) => {
  const todoElement = generateTodo(item);
  todosList.append(todoElement);
});
updateCounter();

const formValidator = new FormValidator(validationConfig, addTodoForm);
formValidator.enableValidation();
formValidator.resetValidation();
