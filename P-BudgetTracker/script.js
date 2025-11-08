let bills = JSON.parse(localStorage.getItem('bills')) || [];
let income = parseFloat(localStorage.getItem('income')) || 0;
const billList = document.getElementById('bill-list');
const totalBills = document.getElementById('total-bills');
const remaining = document.getElementById('remaining');

document.getElementById('income').value = income || '';
updateTotals();

function renderBills() {
    billList.innerHTML = '';
    const today = new Date();
    const showPaid = document.getElementById('toggle-paid').checked;

    bills.sort((a, b) => new Date(a.date) - new Date(b.date));

    bills.forEach((bill, index) => {
        if (!showPaid && bill.paid) return;

        const dueDate = new Date(bill.date);
        const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);

        const row = document.createElement('tr');
        row.className = bill.paid ? 'paid' : '';
        if (diffDays <= 3 && !bill.paid) row.classList.add('due-soon');
        
        row.innerHTML = `
            <td>${bill.name}</td>
            <td>${bill.date}</td>
            <td>$${parseFloat(bill.amount).toFixed(2)}</td>
            <td>${bill.notes || ''}</td>
            <td>${bill.autopay ? '✓' : '𐄂'}</td>
            <td>
                <button onclick="togglePaid(${index})">${bill.paid ? 'Undo' : 'Mark Paid'}</button>
                <button onclick="removeBill(${index})">𐄂</button>
            </td>
        `;
        billList.appendChild(row);
    });

    updateTotals();
}

function updateTotals() {
    const total = bills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
    totalBills.textContent = total.toFixed(2);
    remaining.textContent = (income - total).toFixed(2);
    localStorage.setItem('bills', JSON.stringify(bills));
}

function addBill() {
    const name = document.getElementById('bill-name').value.trim();
    const date = document.getElementById('bill-date').value;
    const amount = parseFloat(document.getElementById('bill-amount').value);
    const notes = document.getElementById('bill-notes').value;
    const autopay = document.getElementById('bill-autopay').checked;

    if (!name || !date || isNaN(amount)) return alert('Please fill out all required fields.');

    bills.push({ name, date, amount, notes, autopay, paid: false });
    document.querySelectorAll('#bill-name, #bill-date, #bill-amount, #bill-notes, #bill-autopay')
        .forEach(el => el.value = el.type === 'checkbox' ? false : '');
    renderBills();
}

function togglePaid(index) {
    bills[index].paid = !bills[index].paid;
    renderBills();
}

function removeBill(index) {
    bills.splice(index, 1);
    renderBills();
}

document.getElementById('add-bill').addEventListener('click', addBill);
document.getElementById('toggle-paid').addEventListener('change', renderBills);
document.getElementById('save-income').addEventListener('click', () => {
    income = parseFloat(document.getElementById('income').value) || 0;
    localStorage.setItem('income', income);
    updateTotals();
});

document.getElementById('export-csv').addEventListener('click', () => {
    let csv = "Bill,Due Date,Amount,Notes,Autopay,Paid\n";
    bills.forEach(b => {
        csv += `${b.name},${b.date},${b.amount},${b.notes || ''},${b.autopay ? 'Yes' : 'No'},${b.paid ? 'Yes' : 'No'}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "budget.csv"
    link.click();
});

document.getElementById('reset-month').addEventListener('click', () => {
    if (confirm("Start fresh for a new month?")) {
        bills = [];
        localStorage.removeItem('bills');
        renderBills();
    }
});

renderBills();