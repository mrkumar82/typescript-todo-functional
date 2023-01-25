import './style.css';
import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>('#app');
const form = document.querySelector<HTMLFormElement>('#task-form');
const taskInput = document.querySelector<HTMLInputElement>('#task-input');
let tasks: Task[] = loadTask();

tasks.forEach(addListItem);

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (taskInput?.value == '' || taskInput?.value == null) return;

  const newTask: Task = {
    id: uuidv4(),
    title: taskInput.value,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);

  addListItem(newTask);
  saveData();
  taskInput.value = '';
});

function loadTask(): Task[] {
  const taskJson = localStorage.getItem('task');
  if (taskJson == null) return [];
  return JSON.parse(taskJson);
}

function saveData() {
  localStorage.setItem('task', JSON.stringify(tasks));
}

function addListItem(task: Task): void {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  const button = document.createElement('button');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveData();
  });
  button.id = task.id;
  button.textContent = 'X';
  button.addEventListener('click', removeItem);

  item.id = task.id;
  label.append(checkbox, task.title, button);
  item.append(label);

  list?.append(item);
}

function removeItem(event: any): void {
  const id = event.target.id;
  const elm = document.getElementById(id) as HTMLLIElement;
  elm.remove();
  const filterItem = tasks.filter((item) => item.id !== id);
  tasks = filterItem;
  saveData();
}
