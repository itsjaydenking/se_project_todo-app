import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";
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

// === CALLBACKS ===
function handleCheck(evt, todoInstance) {
  const isCompleted = evt.target.checked;
  todoInstance.element.classList.toggle("todo_completed", isCompleted);
  todoInstance.data.completed = isCompleted;
  todoCounter.updateCompleted(isCompleted ? true : false);
}

function handleDelete(todo) {
  const name = todo.data.name?.trim() || "this task";
  if (!confirm(`Are you sure you want to delete the task: ${name}?`)) return;

  const wasCompleted = todo.data.completed;

  todo.element.remove();
  todoCounter.updateTotal(false);
  if (wasCompleted) {
    todoCounter.updateCompleted(false);
  }
}

// === TODO GENERATION ===
function generateTodo(data) {
  const todo = new Todo(data, "#todo-template", handleCheck, handleDelete);
  return todo.getView();
}

// === SECTION INSTANCE ===
const todoSection = new Section({
  items: initialTodos,
  renderer: (item) => generateTodo(item),
  containerSelector: ".todos__list",
});

// === POPUP INSTANCE ===
const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (inputValues) => {
    const name = inputValues.name.trim();
    const date = parseDateInput(inputValues.date);
    const id = uuidv4();

    const newTodoData = { name, date, id, completed: false };
    const newTodoElement = generateTodo(newTodoData);

    todoSection.addItem(newTodoElement);
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
