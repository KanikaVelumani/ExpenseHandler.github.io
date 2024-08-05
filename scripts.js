document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');
    const expenseChartCanvas = document.getElementById('expense-chart').getContext('2d');
    const scrollUpButton = document.getElementById('scroll-up');
    const scrollDownButton = document.getElementById('scroll-down');
    const expenseListContainer = document.getElementById('expense-list-container');

    let expenses = [];
    let dailyExpenses = {};
    let monthlyExpenses = {};
    let annualExpenses = {};
    let categoryExpenses = {
        'Food': {},
        'Entertainment': {},
        'Health': {},
        'Other': {}
    };

    const chart = new Chart(expenseChartCanvas, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                createDataset('Food', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)'),
                createDataset('Entertainment', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'),
                createDataset('Health', 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
                createDataset('Other', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)')
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addExpense();
    });

    scrollUpButton.addEventListener('click', function () {
        expenseListContainer.scrollTop -= 20; // Adjust the scroll amount as needed
    });

    scrollDownButton.addEventListener('click', function () {
        expenseListContainer.scrollTop += 20; // Adjust the scroll amount as needed
    });

    function createDataset(label, backgroundColor, borderColor) {
        return {
            label,
            data: [],
            backgroundColor,
            borderColor,
            borderWidth: 1
        };
    }

    function addExpense() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const dateInput = document.getElementById('date').value;
        const date = dateInput ? new Date(dateInput) : new Date();
        const category = document.getElementById('category').value;
        
        if (description && !isNaN(amount)) {
            const dateString = formatDate(date);
            const expense = { description, amount, date: dateString, category };
            expenses.push(expense);
            addExpenseToList(expense);
            updateRecords(expense);
            updateChart();
            expenseForm.reset();
            document.getElementById('description').focus();
        } else {
            alert("Please enter a valid description and amount.");
        }
    }

    function formatDate(date) {
        return date.toLocaleDateString();
    }

    function getMonthString(date) {
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    function getYearString(date) {
        return date.getFullYear().toString();
    }

    function addExpenseToList(expense) {
        const li = document.createElement('li');
        li.innerHTML = `${expense.description} <span>$${expense.amount.toFixed(2)}</span> <small>${expense.date}</small> <small>${expense.category}</small>`;
        expenseList.appendChild(li);
    }

    function updateTotal() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    function updateRecords(expense) {
        const date = new Date(expense.date);
        const dateString = formatDate(date);
        const monthString = getMonthString(date);
        const yearString = getYearString(date);

        dailyExpenses[dateString] = (dailyExpenses[dateString] || 0) + expense.amount;
        monthlyExpenses[monthString] = (monthlyExpenses[monthString] || 0) + expense.amount;
        annualExpenses[yearString] = (annualExpenses[yearString] || 0) + expense.amount;
        categoryExpenses[expense.category][dateString] = (categoryExpenses[expense.category][dateString] || 0) + expense.amount;

        updateTotal();
    }

    function updateChart() {
        const labels = Object.keys(dailyExpenses);
        chart.data.labels = labels;

        chart.data.datasets.forEach(dataset => {
            const category = dataset.label;
            dataset.data = labels.map(label => categoryExpenses[category][label] || 0);
        });

        chart.update();
    }
});
