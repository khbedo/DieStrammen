let uploadedFiles = [];

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');

dropzone.addEventListener('click', () => {
    fileInput.click();
});

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'green';
});

dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = '';
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '';
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!uploadedFiles.some(f => f.name === file.name)) {
            uploadedFiles.push(file);
            updateFileList();
        }
    });
}

function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
    updateFileList();
}

function updateFileList() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    
    uploadedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <button onclick="removeFile('${file.name}')">Entfernen</button>
        `;
        fileList.appendChild(fileItem);
    });
}
