// Constantes pour la configuration académique
export const GRADE_LEVELS = [
  { value: 'CP', label: 'CP' },
  { value: 'CE1', label: 'CE1' },
  { value: 'CE2', label: 'CE2' },
  { value: 'CM1', label: 'CM1' },
  { value: 'CM2', label: 'CM2' },
  { value: '6eme', label: '6ème' },
  { value: '5eme', label: '5ème' },
  { value: '4eme', label: '4ème' },
  { value: '3eme', label: '3ème' },
  { value: '2nde', label: '2nde' },
  { value: '1ere', label: '1ère' },
  { value: 'Tle', label: 'Terminale' }
];

// Générer les années scolaires (année courante +/- 1 an)
export const getAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  // Année précédente, courante et suivante
  for (let i = -1; i <= 1; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    years.push({
      value: `${startYear}-${endYear}`,
      label: `${startYear}-${endYear}`
    });
  }
  
  return years;
};

// Configuration par défaut des classes
export const CLASS_CONFIG = {
  defaultCapacity: 30,
  maxCapacity: 40,
  minCapacity: 1
};