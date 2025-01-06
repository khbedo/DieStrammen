let currentUser = null;
let currentSubject = null;
let currentAssignment = null;

function showPage(pageId) {
    document.querySelectorAll('.container').forEach(container => {
        container.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
}

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        loadSubjects();
        showPage('subject-page');
    } else {
        document.getElementById('login-error').textContent = 'Ungültige Anmeldedaten';
    }
});

function loadSubjects() {
    const container = document.getElementById('subject-buttons');
    container.innerHTML = '';
    subjects.forEach(subject => {
        const button = document.createElement('button');
        button.className = 'selection-button';
        button.textContent = subject.name;
        button.onclick = () => {
            currentSubject = subject.id;
            loadAssignments(subject.id);
            showPage('assignment-page');
        };
        container.appendChild(button);
    });
}

function loadAssignments(subjectId) {
    const container = document.getElementById('assignment-buttons');
    container.innerHTML = '';
    assignments[subjectId].forEach(assignment => {
        const button = document.createElement('button');
        button.className = 'selection-button';
        button.textContent = assignment.name;
        button.onclick = () => {
            currentAssignment = assignment;
            document.getElementById('submission-title').textContent = assignment.name;
            document.getElementById('deadline').textContent = new Date(assignment.deadline).toLocaleDateString('de-DE') + ' 23:59 Uhr';
            document.getElementById('team-section').style.display = assignment.team ? 'block' : 'none';
            showPage('submission-page');
        };
        container.appendChild(button);
    });
}

function submitAssignment() {
    alert('Aufgabe wurde erfolgreich eingereicht!');
    showPage('subject-page');
}
