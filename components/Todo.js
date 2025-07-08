import { v4 as uuidv4 } from "https://jspm.dev/uuid";

class Todo {
  constructor(data, selector) {
    this.data = data;
    this.selector = selector;

    this.element = null;
    this.nameEl = null;
    this.dateEl = null;
    this.checkboxEl = null;
    this.labelEl = null;
    this.deleteBtn = null;
  }

  _setEventListeners() {
    if (this.deleteBtn) {
      this.deleteBtn.addEventListener("click", () => this._deleteTodo());
    }

    if (this.checkboxEl) {
      this.checkboxEl.addEventListener("change", (evt) =>
        this._toggleComplete(evt)
      );
    }
  }

  _deleteTodo() {
    this.element.remove();
  }

  _toggleComplete(evt) {
    if (evt.target.checked) {
      this.element.classList.add("todo_completed");
    } else {
      this.element.classList.remove("todo_completed");
    }
  }

  _formatDueDate() {
    if (!this.data.date) return "";

    let dateObj;
    if (this.data.date instanceof Date) {
      dateObj = this.data.date;
    } else {
      dateObj = new Date(this.data.date);
      if (isNaN(dateObj.getTime())) return this.data.date;
    }

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  getView() {
    const template = document.querySelector(this.selector);
    if (!template) {
      throw new Error(`Template with selector "${this.selector}" not found`);
    }

    const clone = template.content.cloneNode(true);
    const todoElement = clone.querySelector(".todo");
    if (!todoElement) {
      throw new Error(`No element with class "todo" in template`);
    }

    this.element = todoElement;

    this.nameEl = this.element.querySelector(".todo__name");
    this.dateEl = this.element.querySelector(".todo__date");
    this.checkboxEl = this.element.querySelector(".todo__completed");
    this.labelEl = this.element.querySelector(".todo__label");
    this.deleteBtn = this.element.querySelector(".todo__delete-btn");

    if (this.nameEl) {
      this.nameEl.textContent = this.data.name ?? "";
    }

    if (this.dateEl) {
      this.dateEl.textContent = this._formatDueDate();
    }

    if (this.checkboxEl) {
      this.checkboxEl.checked = !!this.data.completed;

      const uniqueId = `todo-${uuidv4()}`;
      this.checkboxEl.id = uniqueId;

      if (this.labelEl) {
        this.labelEl.setAttribute("for", uniqueId);
      }
    }

    this._setEventListeners();

    return this.element;
  }
}

export default Todo;
