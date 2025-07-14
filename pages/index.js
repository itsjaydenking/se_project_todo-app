import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../utils/Section.js";

// === DOM ELEMENTS ===
const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopup = document.querySelector("#add-todo-popup");
const addTodoForm = document.forms["add-todo-form"];
const addTodoCloseBtn = addTodoPopup.querySelector(".popup__close");
const counterText = document.querySelector(".counter__text");

// === MODAL HELPERS ===
const openModal = (modal) => {
  modal.classList.add("popup_visible");
};

const closeModal = (modal) => {
  modal.classList.remove("popup_visible");
};

// === COUNTER UPDATE ===
function updateCounter() {
  const allItems = document.querySelectorAll(".todo");
  const completedItems = document.querySelectorAll(".todo_completed");
  counterText.textContent = `Showing ${completedItems.length} out of ${allItems.length} completed`;
}

// === TODO GENERATION ===
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

// === SECTION INSTANCE ===
const todoSection = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todoElement = generateTodo(item);
    todoSection._container.append(todoElement);
  },
  containerSelector: ".todos__list",
});

// === INITIAL RENDER ===
todoSection.renderItems();
updateCounter();

// === FORM VALIDATION ===
const formValidator = new FormValidator(validationConfig, addTodoForm);
formValidator.enableValidation();
formValidator.resetValidation();

// === EVENT LISTENERS ===
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

  const newTodoData = {
    name,
    date,
    completed: false,
  };

  todoSection.addItem(newTodoData);

  closeModal(addTodoPopup);
  addTodoForm.reset();
  formValidator.resetValidation();
  updateCounter();
});
