function logout() {
    window.location.href = 'login.html';
}

function returnToAssignments() {
    window.location.href = 'tutor-assignment-list.html';
}

function reviewSubmission(student) {
    window.location.href = 'assignment-correction-list.html';
}

document.addEventListener('DOMContentLoaded', function () {
    const assignmentId = sessionStorage.getItem('selectedAssignment');
    const titleElement = document.getElementById('assignmentTitle');
    const uncorrectedSection = document.querySelector('.submission-section:nth-of-type(1)');
    const correctedSection = document.querySelector('.submission-section:nth-of-type(2)');

    if (assignmentId === 'A0') {
        // Falls es sich um ein abgeschlossenes Assignment handelt
        titleElement.textContent = 'Assignment 0: Entwicklungsumgebung einrichten';

        // Nur korrigierte Abgaben anzeigen
        uncorrectedSection.style.display = 'none';

        correctedSection.innerHTML = `
                <h3>Korrigierte Abgaben</h3>
                <div id="correctedSubmissions">
                    <div class="submission-card corrected">
                        <h4>Student 1</h4>
                        <div class="submission-meta">
                            <span>Abgabezeit: 20.01.2025 10:00</span>
                            <span>Status: Korrigiert</span>
                        </div>
                    </div>
                    <div class="submission-card corrected">
                        <h4>Student 2</h4>
                        <div class="submission-meta">
                            <span>Abgabezeit: 20.01.2025 11:30</span>
                            <span>Status: Korrigiert</span>
                        </div>
                    </div>
                    <div class="submission-card corrected">
                        <h4>Student 3</h4>
                        <div class="submission-meta">
                            <span>Abgabezeit: 24.01.2025 12:00</span>
                            <span>Status: Korrigiert</span>
                        </div>
                    </div>
                    <div class="submission-card corrected">
                        <h4>Student 4</h4>
                        <div class="submission-meta">
                            <span>Abgabezeit: 24.01.2025 10:45</span>
                            <span>Status: Korrigiert</span>
                        </div>
                    </div>
                        </div>
            `;
    } else {
        // Standardanzeige für aktive Assignments
        titleElement.textContent = 'Assignment 1: Grundlagen der Java-Programmierung';
    }
});