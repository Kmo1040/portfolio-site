const bills = JSON.parse(localStorage.getItem('bills')) || [];

function renderBills() {
    const tbody = document.getElementById('bill-table-body');
    tbody.innerHTML = '';

    let total = 0;
    let dueSoon = 0;
    const today = new Date();

    bills.forEach((bill, index) => {
        total += parseFloat(bill.amount);

        const dueDate = new Date(bill.date);
        const diff = (dueDate - today) / (1000 * 60 * 60 * 24);
        if (dff <= 5 && !bill.paid) dueSoon++;

        const row = document.createElement('tr');
        row.innerHTML = `
        <td class="${bill.paid ? 'paid' : ''}">${bill.name}</td>
        <td>${bill.date}</td>
        <td>$${bill.amount}</td>
        <td class="${bill.autopay ? 'autopay-true' : ''}">${bill.autopay ? 'Yes' : 'No'}</td>
        <td>
            <input type="checkbox" ${bill.paid ? 'checked' : ''} onclick="togglePaid(${index})">
        </td>
        <td><button onclick="removeBill(${index})">X</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('total-amount').textContent = total.toFixed(2);
    document.getElementById('due-soon-count').textContent = dueSoon;
    localStorage.setItem('bills', JSON.stringify(bills));
}

function addBill() {
    const name = document.getElementById('bill-name').value;
    const date = document.getElementById('bill-date').value;
    const amount = document.getElementById('bill-amount').value;
    const autopay = document.getElementById('bill-autopay').checked;

    if (!name || !date || !amount) {
        alert('Please fill out all fields!');
        return;
    }

    bills.push({ name, date, amount, autopay, paid: false });
    renderBills();

    document.getElementById('bill-name').value = '';
    document.getElementById('bill-date').value = '';
    document.getElementById('bill-amount').value = '';
    document.getElementById('bill-autopay').checked = false;
}

function removeBill(index) {
    bills.splice(index, 1);
    renderBills();
}

function togglePaid(index) {
    bills[index].paid = !bills[index].paid;
    renderBills();
}

document.getElementById('add-bill').addEventListener('click', addBill);

renderBills();