
function selectAssignment(assignmentId) {
    sessionStorage.setItem('selectedAssignment', assignmentId);
    window.location.href = 'tutor-assignment-details.html';
}
function login(){
    window.location.href = 'login.html';

}