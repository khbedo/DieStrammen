const users = [
    { email: 'student@uni.de', password: 'test123' },
    { email: 'demo@uni.de', password: 'demo123' }
];

const subjects = [
    { id: 'math', name: 'Mathematik' },
    { id: 'physics', name: 'Physik' },
    { id: 'cs', name: 'Informatik' }
];

const assignments = {
    math: [
        { id: 1, name: 'Lineare Algebra Übung 1', deadline: '2025-01-15', team: true },
        { id: 2, name: 'Analysis Übung 2', deadline: '2025-01-20', team: false }
    ],
    physics: [
        { id: 3, name: 'Mechanik Protokoll', deadline: '2025-01-18', team: true },
        { id: 4, name: 'Elektrodynamik Aufgaben', deadline: '2025-01-25', team: false }
    ],
    cs: [
        { id: 5, name: 'Programmieraufgabe 1', deadline: '2025-01-22', team: true },
        { id: 6, name: 'Datenbanken Projekt', deadline: '2025-01-30', team: true }
    ]
};
