const addButton = document.querySelector(".add-button");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
const cancelBtn = document.getElementById("cancel-btn");
const addItemBtn = document.getElementById("add-item-btn");
const itemNameInput = document.getElementById("item-name");
const amountInput = document.getElementById("amount");
const typeInputs = document.querySelectorAll('input[name="type"]');
const clearButton = document.querySelector(".clear-button");
const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");
const expenseChart = document.getElementById("expenseChart");

let totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
let totalExpense = parseFloat(localStorage.getItem('totalExpense')) || 0;
let bal = parseFloat(localStorage.getItem('balance')) || 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let todos = JSON.parse(localStorage.getItem('todos')) || [];

let chart;

function initializeChart() {
    const ctx = expenseChart.getContext('2d');
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: [
                    'rgb(161, 160, 158)',
                    'rgb(121, 121, 119)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'SF Pro', sans-serif"
                        },
                        padding: 20
                    }
                }
            }
        }
    });
}

function updateChart() {
    chart.data.datasets[0].data = [totalIncome, totalExpense];
    chart.update();
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span>${todo.text}</span>
            </div>
            <div class="todo-actions">
                <button class="todo-delete">×</button>
            </div>
        `;
        
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => toggleTodo(index));
        
        const deleteBtn = li.querySelector('.todo-delete');
        deleteBtn.addEventListener('click', () => deleteTodo(index));
        
        todoList.appendChild(li);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        todoInput.value = '';
        renderTodos();
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

clearButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all data?')) {
        localStorage.clear();
        totalIncome = 0;
        totalExpense = 0;
        bal = 0;
        transactions = [];
        todos = [];
        
        document.querySelector('.income-amount').innerHTML = `$${totalIncome}`;
        document.querySelector('.expenses-amount').innerHTML = `$${totalExpense}`;
        document.querySelector('.balance-amount').innerHTML = `$${bal}`;
        renderTodos();
        updateChart();
    }
});

addButton.addEventListener('click',function(){
    modal.style.display="flex";
})
closeBtn.addEventListener("click",function(){
    modal.style.display='none';
    resetForm();
})
cancelBtn.addEventListener("click",function(){
    modal.style.display='none';
    resetForm();
})
window.onclick=function(event){
    if (event.target ==modal) {
        modal.style.display='none'
        resetForm()
    }
}
addItemBtn.addEventListener("click",function(){
    const name=itemNameInput.value.trim();
    const amount =parseFloat(amountInput.value)
    const type = Array.from(typeInputs).find(input => input.checked).value;
    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please fill in all fields with valid values");
        return;
    }
    
    const details = {name, amount, type, date: new Date().toISOString()}
    console.log(details);
    
    transactions.push(details);
    
    if (details.type==='income') {
        totalIncome += amount;
        console.log(`total income is ${totalIncome}`);
        document.querySelector('.income-amount').innerHTML=`$${totalIncome}`;
        localStorage.setItem('totalIncome', totalIncome);
    } else {
        totalExpense += amount;
        console.log(`total expense is ${totalExpense}`);
        document.querySelector('.expenses-amount').innerHTML=`$${totalExpense}`;
        localStorage.setItem('totalExpense', totalExpense);
    }
    
    bal = totalIncome-totalExpense;
    document.querySelector('.balance-amount').innerHTML=`$${bal}`;
    localStorage.setItem('balance', bal);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateChart();
    modal.style.display = "none";
    resetForm();
})
function resetForm() {
    itemNameInput.value = "";
    amountInput.value = "";
    typeInputs[0].checked = true; 
}

initializeChart();
renderTodos();
