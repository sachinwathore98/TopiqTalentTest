function determineGroup(grade) {
  if (['Class 3', 'Class 4', 'Class 5'].includes(grade)) return 'GROUP_A';
  if (['Class 6', 'Class 7', 'Class 8'].includes(grade)) return 'GROUP_B';
  if (['Class 9', 'Class 10'].includes(grade)) return 'GROUP_C';
  if (['Class 11', 'Class 12'].includes(grade)) return 'GROUP_D';
  return 'GROUP_E';
}

function generateRollNumber() {
  return `TTT2026-${Math.floor(100000 + Math.random() * 900000)}`;
}

module.exports = { determineGroup, generateRollNumber };