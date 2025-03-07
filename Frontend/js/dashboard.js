document.addEventListener('DOMContentLoaded', function() {
  const taskList = document.getElementById('task-list');
  const newTaskInput = document.getElementById('new-task');
  const addTaskButton = document.getElementById('add-task');

  addTaskButton.addEventListener('click', function() {
      const taskText = newTaskInput.value.trim();
      if (taskText) {
          const li = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = 'task' + (taskList.children.length + 1);
          const label = document.createElement('label');
          label.htmlFor = checkbox.id;
          label.textContent = taskText;
          li.appendChild(checkbox);
          li.appendChild(label);
          taskList.appendChild(li);
          newTaskInput.value = '';
      }
  });

  newTaskInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          addTaskButton.click();
      }
  });
});