const Level = require('../models/Level');

// Récupérer tous les niveaux
exports.getLevels = async (req, res) => {
  try {
    const levels = await Level.find({ isActive: true }).sort('order');
    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des niveaux', error: error.message });
  }
};

// Créer un nouveau niveau
exports.createLevel = async (req, res) => {
  try {
    const { name, displayName, order } = req.body;

    // Vérifier si le niveau existe déjà
    const existingLevel = await Level.findOne({ name });
    if (existingLevel) {
      return res.status(400).json({ message: 'Ce niveau existe déjà' });
    }

    const level = new Level({
      name,
      displayName,
      order
    });

    await level.save();
    res.status(201).json(level);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du niveau', error: error.message });
  }
};

// Mettre à jour un niveau
exports.updateLevel = async (req, res) => {
  try {
    const { name, displayName, order, isActive } = req.body;
    const level = await Level.findById(req.params.id);

    if (!level) {
      return res.status(404).json({ message: 'Niveau non trouvé' });
    }

    // Vérifier si le nouveau nom existe déjà pour un autre niveau
    if (name !== level.name) {
      const existingLevel = await Level.findOne({ name });
      if (existingLevel) {
        return res.status(400).json({ message: 'Ce nom de niveau existe déjà' });
      }
    }

    level.name = name || level.name;
    level.displayName = displayName || level.displayName;
    level.order = order || level.order;
    level.isActive = isActive !== undefined ? isActive : level.isActive;

    await level.save();
    res.json(level);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du niveau', error: error.message });
  }
};

// Supprimer un niveau
exports.deleteLevel = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);
    
    if (!level) {
      return res.status(404).json({ message: 'Niveau non trouvé' });
    }

    // Suppression logique
    level.isActive = false;
    await level.save();
    
    res.json({ message: 'Niveau supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du niveau', error: error.message });
  }
}; 