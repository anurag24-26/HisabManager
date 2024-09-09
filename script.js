// Select elements
const addEntryBtn = document.getElementById('addEntry');
const entryList = document.getElementById('entryList');
const nameSuggestions = document.getElementById('nameSuggestions');
const searchPerson = document.getElementById('searchPerson');

// Get stored data from localStorage (if any)
let transactions = JSON.parse(localStorage.getItem('transactions')) || {};

// Function to render all transactions
function renderTransactions(filter = '') {
    entryList.innerHTML = ''; // Clear the list
    nameSuggestions.innerHTML = ''; // Clear name suggestions

    for (const person in transactions) {
        // If a filter is applied, skip non-matching names
        if (filter && !person.toLowerCase().includes(filter.toLowerCase())) {
            continue;
        }

        const personTransactions = transactions[person];
        let totalLent = 0;
        let totalBorrowed = 0;

        // Calculate total lent and borrowed for each person
        personTransactions.forEach(trans => {
            if (trans.type === 'lent') {
                totalLent += parseFloat(trans.amount);
            } else {
                totalBorrowed += parseFloat(trans.amount);
            }
        });

        // Display the person's name as a header with total summary
        const personHeader = document.createElement('tr');
        personHeader.innerHTML = `
            <td colspan="5"><strong>${person}</strong> - Total Lent: ${totalLent}, Total Borrowed: ${totalBorrowed}</td>
        `;
        entryList.appendChild(personHeader);

        // Display each transaction of that person
        personTransactions.forEach((trans, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${person}</td>
                <td>${trans.amount}</td>
                <td>${trans.date}</td>
                <td>${trans.type}</td>
                <td>
                    <button class="edit-btn" onclick="editTransaction('${person}', ${index})">
                        <img src="pencil-svgrepo-com.svg" alt="Edit" />
                    </button>
                    <button class="delete-btn" onclick="deleteTransaction('${person}', ${index})">
                        <img src="delete-1487-svgrepo-com.svg" alt="Delete" />
                    </button>
                </td>
            `;
            entryList.appendChild(newRow);
        });
        

        // Add person to the name suggestions (datalist)
        const option = document.createElement('option');
        option.value = person;
        nameSuggestions.appendChild(option);
    }
}

// Add entry on button click
addEntryBtn.addEventListener('click', () => {
    const personName = document.getElementById('personName').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;

    if (personName && amount && date && type) {
        // If this person already has transactions, append to their array
        if (!transactions[personName]) {
            transactions[personName] = [];
        }
        transactions[personName].push({ amount, date, type });

        // Store the updated transactions in localStorage
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Re-render the transaction list and suggestions
        renderTransactions();

        // Clear inputs
        document.getElementById('personName').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('date').value = '';
        document.getElementById('type').value = 'lent';
    } else {
        alert("Please fill all fields!");
    }
});

// Edit transaction function
function editTransaction(person, index) {
    const trans = transactions[person][index];
    document.getElementById('personName').value = person;
    document.getElementById('amount').value = trans.amount;
    document.getElementById('date').value = trans.date;
    document.getElementById('type').value = trans.type;

    deleteTransaction(person, index); // Remove the old transaction for update
}

// Delete transaction function
function deleteTransaction(person, index) {
    transactions[person].splice(index, 1);

    // If no more transactions for the person, delete them entirely
    if (transactions[person].length === 0) {
        delete transactions[person];
    }

    // Update localStorage and re-render the transactions
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
}

// Filter transactions based on the search input
searchPerson.addEventListener('input', () => {
    const filter = searchPerson.value;
    renderTransactions(filter);
});

// Initial rendering when the page loads
renderTransactions();
