class Todo {
  constructor(data, selector) {
    this.data = data;
    this.selector = selector;
    this.element = null;
  }

  _setEventListeners() {
    const deleteBtn = this.element.querySelector(".todo__delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => this._deleteTodo());
    }

    const checkbox = this.element.querySelector(".todo__completed");
    if (checkbox) {
      checkbox.addEventListener("change", (evt) => this._toggleComplete(evt));
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
    if (this.data.date instanceof Date) {
      return this.data.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return this.data.date;
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

    const nameEl = todoElement.querySelector(".todo__name");
    if (nameEl) {
      nameEl.textContent = this.data.name ?? "";
    }

    const dateEl = todoElement.querySelector(".todo__date");
    if (dateEl) {
      dateEl.textContent = this._formatDueDate();
    }

    const checkbox = todoElement.querySelector(".todo__completed");
    if (checkbox) {
      checkbox.checked = !!this.data.completed;
      const uniqueId = `todo-${crypto.randomUUID()}`;
      checkbox.id = uniqueId;
      const label = todoElement.querySelector(".todo__label");
      if (label) {
        label.setAttribute("for", uniqueId);
      }
    }

    this.element = todoElement;
    this._setEventListeners();
    return this.element;
  }
}

export default Todo;
