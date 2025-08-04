import React from 'react';
import EnhancedExerciseTypes from '../components/exercises/EnhancedExerciseTypes';

const ExercisesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <EnhancedExerciseTypes
        onExerciseComplete={(exercise, result) => console.log('Exercise completed:', exercise, result)}
        onProgressUpdate={(progress) => console.log('Progress updated:', progress)}
      />
    </div>
  );
};

export default ExercisesPage; 