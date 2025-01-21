import { describe, beforeEach, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClassManager from '../ClassManager';
import * as studentService from '../../../shared/services/studentService';
import * as classService from '../../../shared/services/classService';

vi.mock('../../../shared/services/studentService');
vi.mock('../../../shared/services/classService');

describe('ClassManager - Ajout étudiant', () => {
  const mockClass = {
    _id: 'class1',
    name: '6ème A',
    students: []
  };

  const mockStudent = {
    _id: 'student1',
    name: 'Jean Dupont'
  };

  beforeEach(() => {
    vi.spyOn(studentService, 'addStudentToClass').mockResolvedValue({});
    vi.spyOn(classService, 'getClassById').mockResolvedValue({
      ...mockClass,
      students: [mockStudent]
    });
  });

  it('devrait ajouter un étudiant à une classe', async () => {
    // Render
    render(<ClassManager />);

    // Simuler l'ouverture du modal de gestion des étudiants
    const manageButton = await screen.findByText('Gérer les étudiants');
    fireEvent.click(manageButton);

    // Attendre que le modal soit ouvert
    await screen.findByText('Gestion des étudiants - 6ème A');

    // Simuler la sélection d'un étudiant
    const select = screen.getByPlaceholderText('Sélectionnez des étudiants');
    fireEvent.change(select, { target: { value: 'student1' } });

    // Vérifier que l'étudiant a été ajouté
    await waitFor(() => {
      expect(studentService.addStudentToClass).toHaveBeenCalledWith('class1', 'student1');
      expect(classService.getClassById).toHaveBeenCalledWith('class1');
    });

    // Vérifier que l'étudiant apparaît dans la liste
    const studentName = await screen.findByText('Jean Dupont');
    expect(studentName).toBeInTheDocument();
  });
});