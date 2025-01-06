function addTeamMember() {
    const email = document.getElementById('team-email').value;
    if (email) {
        const teamMembers = document.getElementById('team-members');
        const member = document.createElement('div');
        member.className = 'team-member';
        member.innerHTML = `
            <span style="flex-grow: 1">${email}</span>
            <button onclick="this.parentElement.remove()" style="width: auto">Entfernen</button>
        `;
        teamMembers.appendChild(member);
        document.getElementById('team-email').value = '';
    }
}
