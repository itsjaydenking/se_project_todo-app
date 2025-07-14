import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../utils/Section.js";
import PopupWithForm from "../utils/PopupWithForm.js";
import TodoCounter from "../utils/TodoCounter.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// === DOM ELEMENTS ===
const addTodoButton = document.querySelector(".button_action_add");
const addTodoForm = document.forms["add-todo-form"];

// === DATE PARSE HELPER ===
function parseDateInput(dateInput) {
  let date = "";
  if (dateInput) {
    date = new Date(dateInput);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  }
  return date;
}

// === COUNTER INSTANCE ===
const todoCounter = new TodoCounter(initialTodos, ".counter__text");

// === TODO GENERATION ===
function generateTodo(data) {
  const todo = new Todo(data, "#todo-template");
  const todoElement = todo.getView();

  todoElement.addEventListener("change", (evt) => {
    if (evt.target.classList.contains("todo__completed")) {
      const checked = evt.target.checked;
      todoCounter.updateCompleted(checked);
    }
  });

  todoElement.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("todo__delete-btn")) {
      if (todoElement.querySelector(".todo__completed").checked) {
        todoCounter.updateCompleted(false);
      }
      todoCounter.updateTotal(false);
      todoElement.remove();
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

// === POPUP INSTANCE ===
const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (inputValues) => {
    const name = inputValues.name.trim();
    const date = parseDateInput(inputValues.date);
    const id = uuidv4();

    const newTodo = { name, date, id, completed: false };
    todoSection.addItem(newTodo);
    todoCounter.updateTotal(true);

    formValidator.resetValidation();
    addTodoPopup.close();
  },
});

// === INITIAL RENDER ===
todoSection.renderItems();

// === FORM VALIDATION ===
const formValidator = new FormValidator(validationConfig, addTodoForm);
formValidator.enableValidation();
formValidator.resetValidation();

// === EVENT LISTENERS ===
addTodoPopup.setEventListeners();
addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});
