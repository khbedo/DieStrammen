// assignmentCorrection.js

// Simulierte Studentendaten und Dateien (würde normalerweise vom Backend geladen)
const studentData = {
    name: 'Max Mustermann',
    id: '12345678',
    assignment: 'Assignment 1: Grundlagen der Java-Programmierung',
    submittedFiles: [
        'Hauptprogramm.java',
        'Hilfsfunktionen.java'
    ]
};

// Funktion zum Herunterladen von Dateien
function downloadFile(filename) {
    // In einer realen Anwendung würde dies einen Download-Endpoint aufrufen
    alert(`Herunterladen von: ${filename}`);
}

// Funktion zum Vorschau der Korrektur
function previewCorrection() {
    const points = document.getElementById('points').value;
    const notes = document.getElementById('correctionNotes').value;
    
    if (points === '' || notes.trim() === '') {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    // Vorschau-Modal oder -Overlay implementieren
    alert(`Vorschau der Korrektur:\nPunkte: ${points}/100\nNotizen: ${notes}`);
}

// Formular-Absende-Handler
document.getElementById('correctionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const points = document.getElementById('points').value;
    const notes = document.getElementById('correctionNotes').value;
    const correctionFile = document.getElementById('correctionFile').files[0];

    // Validierung
    if (points === '' || notes.trim() === '') {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }

    // In einer realen Anwendung würde dies Daten an den Server senden
    const correctionData = {
        studentId: studentData.id,
        assignmentId: 'A1',
        points: parseInt(points),
        notes: notes,
        correctionFile: correctionFile ? correctionFile.name : null
    };

    console.log('Korrektur eingereicht:', correctionData);
    alert('Korrektur erfolgreich eingereicht!');
});

// Initialisierung der Seite
function initPage() {
    document.getElementById('studentName').textContent = studentData.name;
    document.getElementById('studentId').textContent = studentData.id;
    document.getElementById('assignmentTitle').textContent = studentData.assignment;

    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Vorherige Einträge löschen

    studentData.submittedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="filename">${file}</span>
            <button onclick="downloadFile('${file}')">Herunterladen</button>
        `;
        fileList.appendChild(fileItem);
    });
}

// Seite initialisieren, wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', initPage);

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

dropzone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

const maxFiles = 2; // Maximum number of files allowed

function handleFiles(fileListPreview) {
    // Check if adding these files would exceed the max limit
    if (files.size + fileListPreview.length > maxFiles) {
        showSubmissionStatus(`Es sind maximal ${maxFiles} Dateien erlaubt.`, 'error');
        return;
    }

    for (const file of fileListPreview) {
        if (files.size >= maxFiles) {
            showSubmissionStatus(`Sie können maximal ${maxFiles} Dateien hinzufügen.`, 'error');
            break;
        }

        if (file.size > maxFileSize) {
            showSubmissionStatus(`${file.name} ist zu groß (max. 10MB)`, 'error');
            continue;
        }

        if (!allowedTypes.includes(file.type)) {
            showSubmissionStatus(`${file.name} hat ein ungültiges Format`, 'error');
            continue;
        }

        if (!files.has(file.name)) {
            files.add(file.name);
            addFileToList(file);
            if (file.type.startsWith('image/')) {
                showPreview(file);
            }
        }
    }
}

function addFileToList(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';

    const icon = document.createElement('i');
    icon.className = `file-icon fas ${getFileIcon(file.type)}`;

    const meta = document.createElement('div');
    meta.className = 'file-meta';
    meta.innerHTML = `
                <span>${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
            `;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Entfernen';
    deleteBtn.onclick = () => {
        fileItem.remove();
        files.delete(file.name);
        if (files.size === 0) {
            previewContainer.style.display = 'none';
        }
    };

    fileInfo.appendChild(icon);
    fileInfo.appendChild(meta);
    fileItem.appendChild(fileInfo);
    fileItem.appendChild(deleteBtn);
    fileList.appendChild(fileItem);

    // Simulate upload progress
    simulateUpload(fileItem.querySelector('.progress'));
}


function getFileIcon(type) {
    switch(type) {
        case 'application/pdf': return 'fa-file-pdf';
        case 'application/zip': return 'fa-file-archive';
        case 'image/jpeg':
        case 'image/png': return 'fa-file-image';
        default: return 'fa-file';
    }
}

function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function simulateUpload(progressBar) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        progressBar.style.width = `${progress}%`;
    }, 200);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

submitBtn.addEventListener('click', () => {
    if (files.size === 0) {
        showSubmissionStatus('Bitte wählen Sie mindestens eine Datei aus.', 'error');
        return;
    }

    showSubmissionStatus('Assignment wurde erfolgreich abgegeben!', 'success');

    setTimeout(() => {
        files.clear();
        fileList.innerHTML = '';
        submissionStatus.style.display = 'none';
        previewContainer.style.display = 'none';
    }, 3000);
});

// Logout-Funktion (Platzhalter)
function logout() {
    // Implementieren Sie die Logout-Logik
    window.location.href = 'login.html';
}