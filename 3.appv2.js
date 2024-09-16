// Simulate login
document.getElementById('loginForm1')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if ((username === 'ayush' && password === '2024') || (username === 'user' && password === '12345')) {
        window.location.href = '4.dashboard1.html';
    } else {
        document.getElementById('loginError').textContent = 'Invalid login details';
    }
});






// Toggle dark mode
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
});



// Default budget limit if not set
const DEFAULT_BUDGET_LIMIT = 0;

// Load budget limit from localStorage or use default
function loadBudgetLimit() {
    return parseFloat(localStorage.getItem('budgetLimit')) || DEFAULT_BUDGET_LIMIT;
}

// Save budget limit to localStorage
function saveBudgetLimit(limit) {
    localStorage.setItem('budgetLimit', limit);
}

// Display the budget limit on the dashboard
function displayBudgetLimit() {
    const budgetLimit = loadBudgetLimit();
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = `Budget Limit: ₹${budgetLimit.toFixed(2)}`;
}

// Update balance display and check budget
function updateBalance(totalAmount) {
    const balanceElement = document.getElementById('balance');
    const outOfMoneyElement = document.getElementById('outOfMoney');
    const budgetLimit = loadBudgetLimit();

    balanceElement.textContent = `Current Balance: ₹${(budgetLimit - totalAmount).toFixed(2)}`;

    if (totalAmount >= budgetLimit) {
        outOfMoneyElement.style.display = 'block';
    } else {
        outOfMoneyElement.style.display = 'none';
    }
}

// Handle budget form submission
document.getElementById('budgetForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const budgetLimit = parseFloat(document.getElementById('budgetLimit').value);

    if (isNaN(budgetLimit) || budgetLimit <= 0) {
        alert('Please enter a valid budget limit.');
        return;
    }

    saveBudgetLimit(budgetLimit);
    document.getElementById('budgetLimit').value = '';
    loadExpenses();
});

// Load expenses from localStorage and display only the 5 latest
function loadExpenses() {
    const expenseTable = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const latestExpenses = expenses.slice(-5); // Get the last 5 expenses
    let totalAmount = 0;

    expenseTable.innerHTML = ''; // Clear existing rows

    latestExpenses.forEach((expense) => {
        const newRow = expenseTable.insertRow();
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);

        // Display the date
        cell1.textContent = new Date(expense.date).toDateString();  // Convert date to readable format
        cell2.textContent = new Date(expense.date).toLocaleTimeString();
        cell3.textContent = expense.name;
        cell4.textContent = `₹${parseFloat(expense.amount).toFixed(2)}`;
        totalAmount += parseFloat(expense.amount);

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = `
            <button class="noselect"><span class="text">Saved</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
        `;
        deleteButton.className = 'deleteButton'; 
        deleteButton.onclick = function () {
            deleteExpense(expense.date); 
        };
        cell5.appendChild(deleteButton);
    });

    updateBalance(totalAmount);
}


// Handle adding new expenses
document.getElementById('expenseForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = document.getElementById('expenseAmount').value;
    const expenseDate = document.getElementById('expenseDate').value || new Date().toISOString(); // Defaults to current date if empty

    if (expenseName.trim() === '' || isNaN(expenseAmount) || expenseAmount <= 0) {
        alert('Please enter valid expense details.');
        return;
    }

    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({ name: expenseName, amount: expenseAmount, date: new Date(expenseDate).toISOString() });
    localStorage.setItem('expenses', JSON.stringify(expenses));

    loadExpenses();  // Reload expenses
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDate').value = '';  // Clear the date field
});


// Delete an expense
function deleteExpense(date) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const updatedExpenses = expenses.filter(expense => expense.date !== date);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    loadExpenses(); // Reload expenses to reflect the changes
}

// Function to generate monthly expenses data
function getMonthlyExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const monthlyData = {};

    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-M

        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }
        monthlyData[month] += parseFloat(expense.amount);
    });

    return monthlyData;
}


// Handle history button click
document.getElementById('historyBtn')?.addEventListener('click', function () {
    window.location.href = '6.expensehistory.html';
});

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    window.location.href = '1.loginpage.html';
});

// On page load
window.onload = function () {
    displayBudgetLimit();
    loadExpenses();
    renderMonthlyExpensesChart();
    renderExpenseCategoriesChart();
};


// Custom cursor effect
const cursor = document.querySelector('.blob');

document.addEventListener('mousemove', function (e) {
    const x = e.clientX;
    const y = e.clientY;
    
    // Update blob's position based on mouse cursor position
    cursor.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
});

