function logout() {
    window.location.href = 'login.html';
}

function returnToAssignments() {
    window.location.href = 'tutor-assignment-list.html';
}

function reviewSubmission(student) {
    alert(`Abgabe von ${student} wird überprüft.`);
}
