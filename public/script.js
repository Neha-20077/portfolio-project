// LOAD DATA
function loadData() {
    fetch('/getData')
        .then(res => res.json())
        .then(data => {
            let output = "";
            data.forEach(d => {
                output += `
                <tr>
                    <td>${d.id}</td>
                    <td>${d.name}</td>
                    <td>${d.email}</td>
                    <td>${d.message}</td>
                    <td>
                        <button onclick="deleteData(${d.id})">Delete</button>
                        <button onclick="editData(${d.id}, '${d.name}', '${d.email}', '${d.message}')">Edit</button>
                    </td>
                </tr>
                `;
            });
            document.getElementById('tableData').innerHTML = output;
        });
}

// FORM SUBMIT
document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    }).then(() => {
        document.getElementById('form').reset();
        loadData();
    });
});

// DELETE
function deleteData(id) {
    fetch('/delete/' + id, { method: 'DELETE' })
        .then(() => loadData());
}

// EDIT
function editData(id, name, email, message) {
    const newName = prompt("Edit name:", name);
    const newEmail = prompt("Edit email:", email);
    const newMsg = prompt("Edit message:", message);

    fetch('/update/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: newName,
            email: newEmail,
            message: newMsg
        })
    }).then(() => loadData());
}

// LOAD ON START
loadData();