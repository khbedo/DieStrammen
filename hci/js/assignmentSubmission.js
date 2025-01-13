const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const submitBtn = document.getElementById('submitBtn');
const submissionStatus = document.getElementById('submissionStatus');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const files = new Set();
const maxFileSize = 10 * 1024 * 1024; // 10MB
const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png'];

let currentGroup = [];
const maxGroupSize = 4; // Maximale Gruppengröße

// Beispiel-Nutzerdaten (später durch echte Datenbank/API ersetzen)
const availableUsers = [
    { id: 1, name: "Max Mustermann", course: "Informatik" },
    { id: 2, name: "Anna Schmidt", course: "Informatik" },
    { id: 3, name: "Tim Meyer", course: "Informatik" },
    { id: 4, name: "Laura Weber", course: "Medieninformatik" },
    { id: 5, name: "Jan Müller", course: "Informatik" },
    { id: 6, name: "Sofia Krüger", course: "Medieninformatik" }
];

function createGroupSection() {
    const groupSection = document.createElement('div');
    groupSection.className = 'group-section';
    groupSection.innerHTML = `
        <h3>Gruppe bilden</h3>
        <div class="search-container">
            <div class="search-header">
                <input type="text" id="userSearch" placeholder="Nutzer suchen..." class="search-input">
                <span class="available-count">Verfügbare Nutzer: <span id="userCount">0</span></span>
            </div>
            <div id="searchResults" class="search-results hidden"></div>
        </div>
        <div id="currentGroup" class="current-group">
            <h4>Aktuelle Gruppe (<span id="groupCount">0</span>/${maxGroupSize})</h4>
            <div id="groupMembers" class="group-members"></div>
        </div>
    `;

    const submitBtn = document.querySelector('#submitBtn');
    submitBtn.parentNode.insertBefore(groupSection, submitBtn);

    // Event Listener Setup
    const searchInput = document.getElementById('userSearch');
    const searchResults = document.getElementById('searchResults');

    // Bei Fokus die Liste anzeigen und alle Nutzer laden
    searchInput.addEventListener('focus', () => {
        searchResults.classList.remove('hidden');
        showAllUsers();
    });

    // Bei Klick außerhalb die Liste verstecken
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    searchInput.addEventListener('input', handleSearch);

    // Initial Nutzerliste laden
    showAllUsers();
    renderGroup();
}

function showAllUsers() {
    const availableCount = availableUsers.filter(user =>
        !currentGroup.some(member => member.id === user.id)
    ).length;

    document.getElementById('userCount').textContent = availableCount;
    displayFilteredUsers(availableUsers.filter(user =>
        !currentGroup.some(member => member.id === user.id)
    ));
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = availableUsers.filter(user =>
        (user.name.toLowerCase().includes(searchTerm) ||
            user.course.toLowerCase().includes(searchTerm)) &&
        !currentGroup.some(member => member.id === user.id)
    );

    displayFilteredUsers(filteredUsers);
}

function displayFilteredUsers(users) {
    const searchResults = document.getElementById('searchResults');

    if (users.length === 0) {
        searchResults.innerHTML = '<div class="no-results">Keine Nutzer gefunden</div>';
        return;
    }

    searchResults.innerHTML = users.map(user => `
        <div class="search-result-item" onclick="addToGroup(${user.id})">
            <div class="user-info">
                <span class="user-name">${user.name}</span>
                <span class="user-course">${user.course}</span>
            </div>
            <button class="add-user-btn">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    `).join('');
}

// Rest der Funktionen bleiben gleich...
function addToGroup(userId) {
    if (currentGroup.length >= maxGroupSize) {
        showNotification('Die maximale Gruppengröße ist erreicht!', 'error');
        return;
    }

    const user = availableUsers.find(u => u.id === userId);
    if (user && !currentGroup.some(member => member.id === userId)) {
        currentGroup.push(user);
        renderGroup();
        saveGroupToStorage();
        showAllUsers();
    }
}

function removeFromGroup(userId) {
    currentGroup = currentGroup.filter(member => member.id !== userId);
    renderGroup();
    saveGroupToStorage();
    showAllUsers();
}

function renderGroup() {
    const groupMembers = document.getElementById('groupMembers');
    document.getElementById('groupCount').textContent = currentGroup.length;

    groupMembers.innerHTML = currentGroup.map(member => `
        <div class="group-member">
            <div class="user-info">
                <span class="user-name">${member.name}</span>
                <span class="user-course">${member.course}</span>
            </div>
            <button onclick="removeFromGroup(${member.id})" class="remove-member">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function saveGroupToStorage() {
    localStorage.setItem('assignmentGroup', JSON.stringify(currentGroup));
}

function loadGroupFromStorage() {
    const savedGroup = localStorage.getItem('assignmentGroup');
    if (savedGroup) {
        currentGroup = JSON.parse(savedGroup);
        renderGroup();
        showAllUsers();
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    createGroupSection();
    loadGroupFromStorage();
});

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

function handleFiles(fileList) {
    // Check if adding these files would exceed the max limit
    if (files.size + fileList.length > maxFiles) {
        showSubmissionStatus(`Es sind maximal ${maxFiles} Dateien erlaubt.`, 'error');
        return;
    }

    for (const file of fileList) {
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

function showSubmissionStatus(message, type) {
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    submissionStatus.innerHTML = `
                <i class="fas ${icon}"></i>
                ${message}
            `;
    submissionStatus.className = 'submission-status ' + type;
}