class ListControl {
  constructor() {
    this.date_data = new Date();
    this.calWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    this.calMonthName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    this.element_info = null;

    this.editButton = document.querySelector(".button_edit");
    this.deleteButton = document.querySelector(".button_delete");
    this.checkboxes = document.querySelectorAll(
      '.taskList input[type="checkbox"]'
    );

    this.addButton = document.querySelector(".button_add");
    this.taskInput = document.getElementById("taskInput");
    this.exitButton = document.querySelector(".button_exit");

    // Event listener
    // this.editButton.addEventListener(
    //   "click",
    //   this.toggleDeleteCheck.bind(this)
    // );

    // EVENT LISTENER
    this.editButton.addEventListener("click", () => {
      this.toggleDeleteCheck();
    });
    this.deleteButton.addEventListener("click", () => {
      this.deleteTasks();
    });
    this.taskInput.addEventListener("input", () => {
      this.toggleAddButton();
    });

    this.addButton.addEventListener("click", () => {
      this.addButtonProcess();
    });
    this.exitButton.addEventListener("click", () => {
      fetch("/")
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    });
  }

  updateCheckboxes = () => {
    this.checkboxes = document.querySelectorAll(
      '.taskList input[type="checkbox"]'
    );
  };

  // List-Structure
  toggleDeleteCheck = () => {
    if (this.deleteButton.style.display === "none") {
      this.showDeleteCheck();
    } else {
      this.hideDeleteCheck();
    }
  };

  showDeleteCheck = () => {
    this.deleteButton.style.display = "block";
    this.checkboxes.forEach((checkbox) => {
      checkbox.style.display = "block";
    });
  };

  hideDeleteCheck = () => {
    this.deleteButton.style.display = "none";
    this.checkboxes.forEach((checkbox) => {
      checkbox.style.display = "none";
    });
  };

  deleteTasks = () => {
    this.checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        // checkbox.closest("li").remove();
        checkbox.parentNode.parentNode.remove();
      }
    });

    this.hideDeleteCheck();
  };

  toggleAddButton = () => {
    if (this.taskInput.value.trim() !== "") {
      this.addButton.style.display = "block";
    } else {
      this.addButton.style.display = "none";
    }
  };

  addButtonProcess = () => {
    const newTask = this.taskInput.value.trim();
    this.taskInput.value = "";
    if (newTask !== "") {
      const taskList = document.querySelector(".taskList");
      const li = document.createElement("li");
      const liWrapper = document.createElement("div");
      const checkbox = document.createElement("input");
      const label = document.createElement("label");
      // Add Hidden value
      const hidden_input = document.createElement("input");

      // Fill Checkbox for sending data purpose into app.js
      // checkbox.name = `new${taskList.childElementCount + 1}`;
      // checkbox.value = newTask;
      hidden_input.name = `new${taskList.childElementCount + 1}`;
      hidden_input.value = newTask;
      hidden_input.type = "text";
      hidden_input.style.display = "none";
      liWrapper.appendChild(hidden_input);
      //
      checkbox.type = "checkbox";
      checkbox.id = `item${taskList.childElementCount + 1}`;
      checkbox.style.display = "none";
      // add data-is-active new
      // checkbox.setAttribute("data-is-active", "true");

      // Add Hidden value and

      label.setAttribute("for", `item${taskList.childElementCount + 1}`);
      label.textContent = newTask;

      liWrapper.appendChild(checkbox);
      liWrapper.appendChild(label);
      liWrapper.classList.add("li_sub_wrapper");
      li.appendChild(liWrapper);
      taskList.appendChild(li);
      this.updateCheckboxes();
    }
  };

  // Others

  getCurrentDateInfo = () => {
    return `${this.date_data.getDate()} ${
      this.calWeekDays[this.date_data.getDay()]
    } ${this.date_data.getFullYear()}`;
  };

  getDocuInfo = () => {
    return document.querySelector(".the_day");
  };

  setElementInfo = () => {
    this.element_info = this.getDocuInfo();
    this.element_info.textContent = this.getCurrentDateInfo();
  };
}

const list = new ListControl();
