function getImage() {
    let name = document.getElementById("fileName").value;
    if (name.length === 0) {
        alert('Please Type a File Name');
    }
    else {
        window.location.href = `/api/files/${name}`;
    }
}

function deleteImage() {
    let name = document.getElementById("fileName").value;
    if (name.length === 0) {
        alert('Please Type a File Name');
    } else {
        fetch(`/api/files/delete/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        })
            .then(response => response.text()).then(message => { document.documentElement.innerHTML = message; })
            .catch(err => { alert('Error: ' + err); });
        // window.location.href = `/api/files/delete/${name}`;
    }
}