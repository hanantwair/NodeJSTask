async function uploadImage() {
    const files = document.getElementById("file").files;
    if (files.length) {
        const formData = new FormData();
        formData.append('file', files[0]);
        try {
            validateFile(files[0]);
            const response = await fetch('/api/upload', {
                method: "POST",
                body: formData
            });
            const text = await response.text();
            window.alert(text);
        } catch (err) {
            window.alert(err);
        }
    } else {
        window.alert('No files!');
    }
}

function validateFile(file) {
    const fileExtension = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg", "image/apng", "image/avif"];
    if (!fileExtension.includes(file.type)) {
        throw new Error("The file must be an image!");
    }
    if (file.size < 8500 || file.size > 114000) {
        throw new Error("file size must be between 8661 and 113906");
    }
}

async function deleteImage(imgName) {
    const response = await fetch(`/api/files/delete/${imgName}`, {
        method: "POST"
    });
    const text = await response.text();
    window.alert(text);
    window.location.reload();
}
