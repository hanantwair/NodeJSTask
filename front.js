async function uploadImage() {
    const files = document.getElementById("file").files;
    if (files.length) {
        const formData = new FormData();
        formData.append('file', files[0]);
        if (validateFile(files[0])) {
            const response = await fetch('/api/upload', {
                method: "POST",
                body: formData
            });
            const text = await response.text();
            window.alert(text);
        }
    } else {
        window.alert('No files!');
    }
}

function validateFile(file) {
    const fileExtension = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg", "image/apng", "image/avif"];
    if (fileExtension.includes(file.type)) {
        if (file.size >= 8500 && file.size <= 114000) {
            return true;
        }
        window.alert('file size must be between 8661 and 113906');
        return false;
    }
    window.alert('file type must be one of [jpeg, gif, png, ...]');
    return false;
}

async function deleteImage(imgName) {
    const response = await fetch(`/api/files/delete/${imgName}`, {
        method: "POST"
    });
    const text = await response.text();
    window.alert(text);
    window.location.reload();

}
