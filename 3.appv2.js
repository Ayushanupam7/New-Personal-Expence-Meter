// Simulate login
document.getElementById('loginForm1')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'ayush' && password === '2024')
        {
        // Redirect to dashboard on successful login
        window.location.href = '4.dashboard1.html';
    } else {
        // Show error message
        document.getElementById('loginError').textContent = 'Invalid login details';
    }
});





// Default budget limit if not set
const DEFAULT_BUDGET_LIMIT = 10000;

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

    // Save budget limit to localStorage
    saveBudgetLimit(budgetLimit);
    
    // Clear form field
    document.getElementById('budgetLimit').value = '';

    // Reload expenses to reflect the new budget limit
    loadExpenses();
});

// Load expenses from localStorage and display only the 5 latest
function loadExpenses() {
    const expenseTable = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const latestExpenses = expenses.slice(-5); // Get the last 5 expenses
    let totalAmount = 0;

    expenseTable.innerHTML = ''; // Clear existing rows

    latestExpenses.forEach((expense, index) => {
        const newRow = expenseTable.insertRow();
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);

        cell1.textContent = new Date(expense.date).toDateString();
        cell2.textContent = new Date(expense.date).toLocaleTimeString();

        cell3.textContent = expense.name;
        cell4.textContent = `₹${parseFloat(expense.amount).toFixed(2)}`;
        totalAmount += parseFloat(expense.amount);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
            deleteExpense(expense.date); // Use date to identify expense
        };
        cell5.appendChild(deleteButton);
    });

    // Update balance with the new total amount
    updateBalance(totalAmount);
}

// Handle adding new expenses
document.getElementById('expenseForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = document.getElementById('expenseAmount').value;

    // Validate inputs
    if (expenseName.trim() === '' || isNaN(expenseAmount) || expenseAmount <= 0) {
        alert('Please enter valid expense details.');
        return;
    }
    
    // Save expense to localStorage
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({ name: expenseName, amount: expenseAmount, date: new Date().toISOString() });
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Add expense to table
    loadExpenses(); // Reload expenses to reflect the new entry

    // Clear form fields
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
});

// Delete an expense
function deleteExpense(date) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const updatedExpenses = expenses.filter(expense => expense.date !== date);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    loadExpenses(); // Reload expenses to reflect the changes
}

// Load expenses and budget limit when the dashboard loads
window.onload = function () {
    displayBudgetLimit();
    loadExpenses();
};

// Handle history button click
document.getElementById('historyBtn')?.addEventListener('click', function () {
    window.location.href = '6.expensehistory.html'; // Make sure this file exists
});
// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    window.location.href = '1.loginpage.html';
});


// Include this function in appv2.js

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

// Function to render the monthly expenses chart
function renderMonthlyExpensesChart() {
    const monthlyData = getMonthlyExpenses();

    const ctx = document.getElementById('monthlyExpensesChart').getContext('2d');

    const labels = Object.keys(monthlyData).sort(); // Get sorted months
    const data = labels.map(label => monthlyData[label]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Expenses',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (₹)'
                    }
                }
            }
        }
    });
}

// Handle the Show Chart button click
document.getElementById('showChartBtn')?.addEventListener('click', function () {
    const chartCanvas = document.getElementById('monthlyExpensesChart');
    
    if (chartCanvas.style.display === 'none') {
        chartCanvas.style.display = 'block';
        renderMonthlyExpensesChart();
    } else {
        chartCanvas.style.display = 'none';
    }
});

// Load expenses and budget limit when the dashboard loads
window.onload = function () {
    displayBudgetLimit();
    loadExpenses();
};
