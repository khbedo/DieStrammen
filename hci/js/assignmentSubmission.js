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

const maxFiles = 1; // Maximum number of files allowed

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
	submissionStatus.style.display = 'block'; 
	const submittedFilesList = document.getElementById('submittedFilesList');
    submittedFilesList.innerHTML = ''; // Leere den Container
    files.forEach(fileName => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.textContent = fileName; // Zeige den Dateinamen an
        submittedFilesList.appendChild(fileItem);
    });
	
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

const pointsConfig = {
    pointsEarnedBeforeDeadline: 1, // Points earned for early submission
    daysBeforeDeadline: 7, // How many days before deadline to earn points
    pointCostForDeadlineExtension: 1 // Cost to extend deadline
};

// User points class to manage points for a specific course
class CoursePoints {
    constructor(courseId) {
        this.courseId = courseId;
        this.points = 0;
        this.deadlineExtensionUsed = false;
    }

    // Add points for early submission
    addPoints() {
        this.points += pointsConfig.pointsEarnedBeforeDeadline;
        this.saveToStorage();
    }

    // Spend points to extend deadline
    spendPointsForDeadlineExtension() {
        if (this.points >= pointsConfig.pointCostForDeadlineExtension && !this.deadlineExtensionUsed) {
            this.points -= pointsConfig.pointCostForDeadlineExtension;
            this.deadlineExtensionUsed = true;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Save points to local storage
    saveToStorage() {
        localStorage.setItem(`coursePoints_${this.courseId}`, JSON.stringify({
            points: this.points,
            deadlineExtensionUsed: this.deadlineExtensionUsed
        }));
    }

    // Load points from local storage
    loadFromStorage() {
        const savedPoints = localStorage.getItem(`coursePoints_${this.courseId}`);
        if (savedPoints) {
            const data = JSON.parse(savedPoints);
            this.points = data.points;
            this.deadlineExtensionUsed = data.deadlineExtensionUsed;
        }
    }
}

// Modify existing code to integrate points system
function initializePointsSystem() {
    // Assuming we have a way to identify the current course
    const currentCourseId = 'informatik_web_development';

    // Create or load course points
    const coursePoints = new CoursePoints(currentCourseId);
    coursePoints.loadFromStorage();

    // Add points display to the assignment submission page
    const pointsDisplay = document.createElement('div');
    pointsDisplay.id = 'pointsDisplay';
    pointsDisplay.className = 'points-display';
    pointsDisplay.innerHTML = `
        <h3>Punktekonto</h3>
        <p>Aktuelle Punkte: <span id="currentPoints">${coursePoints.points}</span></p>
    `;

    // Add deadline extension button
    const deadlineExtensionBtn = document.createElement('button');
    deadlineExtensionBtn.id = 'deadlineExtensionBtn';
    deadlineExtensionBtn.className = 'deadline-extension-btn';
    deadlineExtensionBtn.textContent = 'Abgabefrist um 1 Tag verlängern';
    deadlineExtensionBtn.addEventListener('click', () => {
        if (coursePoints.spendPointsForDeadlineExtension()) {
            // Update points display
            document.getElementById('currentPoints').textContent = coursePoints.points;

            // Logic to extend deadline (you'll need to implement this based on your specific deadline handling)
            extendDeadline(1); // Extend by 1 day

            // Disable button after use
            deadlineExtensionBtn.disabled = true;
            deadlineExtensionBtn.textContent = 'Verlängerung bereits genutzt';

            showNotification('Abgabefrist um 1 Tag verlängert!', 'success');
        } else {
            showNotification('Nicht genügend Punkte oder Verlängerung bereits genutzt', 'error');
        }
    });

    // Function to check and award points for early submission
    function checkEarlySubmission() {
        const deadline = new Date('2025-01-15T23:59:00'); // Hardcoded from HTML, replace with dynamic method
        const earlySubmissionDate = new Date(deadline);
        earlySubmissionDate.setDate(earlySubmissionDate.getDate() - pointsConfig.daysBeforeDeadline);

        if (new Date() <= earlySubmissionDate) {
            coursePoints.addPoints();
            document.getElementById('currentPoints').textContent = coursePoints.points;
            showNotification(`Punkt für frühe Abgabe erhalten! Aktuelle Punkte: ${coursePoints.points}`, 'success');
        }
    }

    // Function to extend deadline (placeholder - implement according to your specific requirements)
    function extendDeadline(days) {
        // This is a placeholder. You'll need to implement actual deadline extension logic
        console.log(`Deadline extended by ${days} day(s)`);
    }

    // Add points display and deadline extension button to the page
    const assignmentSection = document.querySelector('.assignment-section');
    assignmentSection.insertBefore(pointsDisplay, assignmentSection.firstChild);
    assignmentSection.insertBefore(deadlineExtensionBtn, submitBtn);

    // Check for early submission when script loads
    checkEarlySubmission();

    // Optional: Add points check to submission
    submitBtn.addEventListener('click', checkEarlySubmission);
}
function extendDeadline(days) {
    // Hole das Deadline-Textfeld
    const deadlineTextElement = document.getElementById('deadlineText');

    // Konvertiere den aktuellen Deadline-Text in ein Datum
    const currentDeadline = parseDeadlineText(deadlineTextElement.textContent);

    // Verlängere das Datum um die angegebene Anzahl von Tagen
    currentDeadline.setDate(currentDeadline.getDate() + days);

    // Formatiere das neue Datum zurück in den Anzeigetext
    const newDeadlineText = formatDeadlineText(currentDeadline);

    // Aktualisiere den Anzeigetext
    deadlineTextElement.textContent = newDeadlineText;

    // Optional: Speichere die neue Deadline (z.B. im LocalStorage)
    localStorage.setItem('assignmentDeadline', currentDeadline.toISOString());

    // Zeige Benachrichtigung
    showNotification(`Abgabefrist um ${days} Tag(e) verlängert!`, 'success');
}

const assignmentConfig = {
    courseId: 'informatik_web_development',
    title: 'Projektarbeit Web-Entwicklung',
    initialDeadline: new Date('2025-01-26T23:59:00'),
    pointsForEarlySubmission: 1,
    daysBeforeDeadlineToEarnPoints: 7
};

class AssignmentPointsManager {
    constructor(courseId) {
        this.courseId = courseId;
        this.loadState();
    }

    loadState() {
        const savedState = localStorage.getItem(`assignment_${this.courseId}_state`);
        if (savedState) {
            const state = JSON.parse(savedState);
            this.points = state.points || 0;
            this.deadline = new Date(state.deadline || assignmentConfig.initialDeadline);
            this.deadlineExtensionUsed = state.deadlineExtensionUsed || false;
        } else {
            this.points = 0;
            this.deadline = new Date(assignmentConfig.initialDeadline);
            this.deadlineExtensionUsed = false;
        }
    }

    saveState() {
        localStorage.setItem(`assignment_${this.courseId}_state`, JSON.stringify({
            points: this.points,
            deadline: this.deadline,
            deadlineExtensionUsed: this.deadlineExtensionUsed
        }));
    }

    addPoints() {
        this.points += assignmentConfig.pointsForEarlySubmission;
        this.saveState();
        return this.points;
    }

    spendPointsForDeadlineExtension() {
        if (this.points > 0 && !this.deadlineExtensionUsed) {
            this.points--;
            this.deadline.setDate(this.deadline.getDate() + 1);
            this.deadlineExtensionUsed = true;
            this.saveState();
            return true;
        }
        return false;
    }
}

function updatePointsDisplay(points) {
    const pointsElement = document.getElementById('currentPoints');
    pointsElement.textContent = points;
}

function updateDeadlineDisplay(deadline) {
    const deadlineTextElement = document.getElementById('deadlineText');
    deadlineTextElement.textContent = deadline.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) + ' Uhr';
}

// Hilfsfunktion zum Parsen des Deadline-Textes
function parseDeadlineText(deadlineText) {
    // Erwarte Format: "TT. Monat JJJJ, HH:MM Uhr"
    const parts = deadlineText.split(/[.,\s]/);
    const day = parseInt(parts[0]);
    const monthNames = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    const month = monthNames.indexOf(parts[1]);
    const year = parseInt(parts[2]);
    const [hours, minutes] = parts[4].split(':').map(Number);

    return new Date(year, month, day, hours, minutes);
}

// Hilfsfunktion zum Formatieren des Datums
function formatDeadlineText(date) {
    const monthNames = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    return `${date.getDate()}. ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${
        String(date.getHours()).padStart(2, '0')
    }:${
        String(date.getMinutes()).padStart(2, '0')
    } Uhr`;
}

// Beim Laden der Seite die gespeicherte Deadline laden (falls vorhanden)
document.addEventListener('DOMContentLoaded', () => {
    const savedDeadline = localStorage.getItem('assignmentDeadline');
    if (savedDeadline) {
        const deadlineDate = new Date(savedDeadline);
        const deadlineTextElement = document.getElementById('deadlineText');
        deadlineTextElement.textContent = formatDeadlineText(deadlineDate);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const pointsManager = new AssignmentPointsManager(assignmentConfig.courseId);

    // Initial UI setzen
    updateDeadlineDisplay(pointsManager.deadline);
    updatePointsDisplay(pointsManager.points);

    // Deadline verlängern
    const extendDeadlineBtn = document.getElementById('extendDeadlineBtn');
    extendDeadlineBtn.addEventListener('click', () => {
        if (pointsManager.spendPointsForDeadlineExtension()) {
            updateDeadlineDisplay(pointsManager.deadline);
            updatePointsDisplay(pointsManager.points);
            showNotification('Abgabefrist um 1 Tag verlängert!', 'success');
        } else {
            showNotification('Keine Punkte verfügbar oder Verlängerung bereits genutzt.', 'error');
        }
    });

    // Assignment erfolgreich abgeben
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', () => {
        if (files.size === 0) {
            showSubmissionStatus('Bitte wählen Sie mindestens eine Datei aus.', 'error');
            return;
        }

        // Punkte erhöhen
        const newPoints = pointsManager.addPoints();
        updatePointsDisplay(newPoints);
        showNotification(`Punkt für erfolgreiche Abgabe erhalten! Aktuelle Punkte: ${newPoints}`, 'success');

        // Abgabe-Logik
        showSubmissionStatus('Assignment wurde erfolgreich abgegeben!', 'success');
        setTimeout(() => {
            files.clear();
            fileList.innerHTML = '';
            submissionStatus.style.display = 'none';
            previewContainer.style.display = 'none';
        }, 3000);
    });
});

// Initialize points system when DOM is loaded
document.getElementById('assignmentTitle').textContent = assignmentConfig.title;
document.getElementById('currentPoints').textContent = pointsManager.points;