function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    const tutor = tutors.find(t => t.username === username && t.password === password);
    
    if (tutor) {
        loginError.classList.add('hidden');
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('coursePage').classList.remove('hidden');
    } else {
        loginError.classList.remove('hidden');
    }
}

function updateGroupList() {
    const assignmentId = document.getElementById('assignmentSelect').value;
    const groupSelect = document.getElementById('groupSelect');
    const selectedAssignmentGroup = document.getElementById('selectedAssignmentGroup');
    
    if (assignmentId) {
        groupSelect.classList.remove('hidden');
        groupSelect.innerHTML = '<option value="">Gruppe auswählen...</option>';
        
        assignmentGroups[assignmentId].forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            groupSelect.appendChild(option);
        });
    } else {
        groupSelect.classList.add('hidden');
        selectedAssignmentGroup.classList.add('hidden');
    }
}

function selectCourse() {
    document.getElementById('coursePage').classList.add('hidden');
    document.getElementById('managementPage').classList.remove('hidden');
}

function showTab(tabName) {
    ['groups', 'points', 'submissions'].forEach(tab => {
        document.getElementById(tab + 'Tab').classList.add('hidden');
    });
    document.getElementById(tabName + 'Tab').classList.remove('hidden');
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
            <button class="delete-file" onclick="removeFile(this)">×</button>
        `;
        fileList.appendChild(fileItem);
    });
    
    dropZone.classList.add('success');
    setTimeout(() => {
        dropZone.classList.remove('success');
    }, 2000);
}

function removeFile(button) {
    const fileItem = button.parentElement;
    dropZone.classList.add('remove');
    
    setTimeout(() => {
        fileItem.remove();
        dropZone.classList.remove('remove');
    }, 2000);
}

document.getElementById('groupSelect').addEventListener('change', function() {
    const assignmentId = document.getElementById('assignmentSelect').value;
    const groupId = this.value;
    const selectedAssignmentGroup = document.getElementById('selectedAssignmentGroup');
    const currentSelection = document.getElementById('currentSelection');
    
    if (groupId) {
        selectedAssignmentGroup.classList.remove('hidden');
        const assignment = document.getElementById('assignmentSelect').options[document.getElementById('assignmentSelect').selectedIndex].text;
        const group = this.options[this.selectedIndex].text;
        currentSelection.textContent = `${assignment} - ${group}`;
    } else {
        selectedAssignmentGroup.classList.add('hidden');
    }
});

// File handling event listeners
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('success');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('success');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Initialize example data
document.getElementById('groupsList').innerHTML = `
    <p>Gruppe 1: Max, Anna</p>
    <p>Gruppe 2: Lisa, Tom</p>
`;

document.getElementById('pointsList').innerHTML = `
    <p>Gruppe 1: 15/20 Punkten</p>
    <p>Gruppe 2: 18/20 Punkten</p>
`;