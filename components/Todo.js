class Todo {
  constructor(data, selector, handleCheck, handleDelete) {
    this.data = data;
    this.selector = selector;
    this.handleCheck = handleCheck;
    this.handleDelete = handleDelete;
  }

  _setEventListeners() {
    this.deleteBtn?.addEventListener("click", () => {
      this.handleDelete?.(this);
    });

    this.checkboxEl?.addEventListener("change", (evt) => {
      this.handleCheck?.(evt, this);
    });
  }

  _formatDueDate() {
    if (!this.data.date) return "";

    const dateObj = new Date(this.data.date);
    
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  _populateContent() {
    const uniqueId = `todo-${this.data.id}`;

    this.nameEl.textContent = this.data.name ?? "";
    this.dateEl.textContent = this._formatDueDate();
    this.checkboxEl.checked = !!this.data.completed;
    this.checkboxEl.id = uniqueId;
    this.labelEl.setAttribute("for", uniqueId);
  }

  _queryElements() {
    this.nameEl = this.element.querySelector(".todo__name");
    this.dateEl = this.element.querySelector(".todo__date");
    this.checkboxEl = this.element.querySelector(".todo__completed");
    this.labelEl = this.element.querySelector(".todo__label");
    this.deleteBtn = this.element.querySelector(".todo__delete-btn");
  }

  getView() {
    const template = document.querySelector(this.selector);
    const clone = template.content.cloneNode(true);

    this.element = clone.querySelector(".todo");

    this._queryElements();
    this._populateContent();
    this._setEventListeners();

    return this.element;
  }
}

export default Todo;
