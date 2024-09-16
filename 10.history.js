// Toggle dark mode
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    
    // Save the theme preference in localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// On page load, check for theme preference
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
});





// Load expenses from localStorage and display them in the history table
function loadHistory() {
    const historyTable = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    historyTable.innerHTML = ''; // Clear existing rows

    expenses.forEach(expense => {
        const newRow = historyTable.insertRow();
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);

        cell1.textContent = new Date(expense.date).toDateString();
        cell2.textContent = new Date(expense.date).toLocaleTimeString();
        cell3.textContent = expense.name;
        cell4.textContent = `₹${parseFloat(expense.amount).toFixed(2)}`;
    });
}

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    window.location.href = '1.loginpage.html';
});

// Handle back button click
document.getElementById('backBtn')?.addEventListener('click', function () {
    window.location.href = '4.dashboard1.html'; // Ensure this path is correct
});

// Load history when the page loads
window.onload = loadHistory;


const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.className = 'delete-btn'; // Add this line
deleteButton.onclick = function () {
    deleteExpense(expense.date); // Use date to identify expense
};
cell5.appendChild(deleteButton);

// On page load, check for theme preference
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
});

