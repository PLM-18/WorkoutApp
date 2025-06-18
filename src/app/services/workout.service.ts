// src/app/services/workout.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  equipment: string;
}

export interface Workout {
  id: number;
  name: string;
  type: string;
  description: string;
  duration: string;
  image: string;
  exercises: Exercise[];
  completed?: boolean;
  dateCompleted?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workouts: Workout[] = [
    {
      id: 1,
      name: 'Beginner Weight Loss',
      type: 'Weight Loss',
      description: 'A beginner-friendly workout program focused on helping you shed those first few pounds.',
      duration: '30 minutes',
      image: 'assets/workouts/weight-loss.gif',
      exercises: [
        { name: 'Jumping Jacks', sets: 3, reps: 20, equipment: 'None' },
        { name: 'Bodyweight Squats', sets: 3, reps: 15, equipment: 'None' },
        { name: 'Push-ups', sets: 3, reps: 10, equipment: 'None' },
        { name: 'Lunges', sets: 3, reps: 10, equipment: 'None' },
        { name: 'Plank', sets: 3, reps: 30, equipment: 'None' }
      ]
    },
    {
      id: 2,
      name: 'Muscle Building',
      type: 'Muscle Gain',
      description: 'Focus on building lean muscle mass with these resistance exercises.',
      duration: '45 minutes',
      image: 'assets/workouts/muscle-gain.gif',
      exercises: [
        { name: 'Push-ups', sets: 4, reps: 12, equipment: 'None' },
        { name: 'Dumbbell Rows', sets: 4, reps: 10, equipment: 'Dumbbells' },
        { name: 'Goblet Squats', sets: 3, reps: 15, equipment: 'Kettlebell or Dumbbell' },
        { name: 'Overhead Press', sets: 3, reps: 12, equipment: 'Dumbbells' },
        { name: 'Dumbbell Lunges', sets: 3, reps: 10, equipment: 'Dumbbells' }
      ]
    },
    {
      id: 3,
      name: 'HIIT Cardio',
      type: 'Cardio',
      description: 'High-intensity interval training to maximize calorie burn in minimal time.',
      duration: '20 minutes',
      image: 'assets/workouts/cardio.gif',
      exercises: [
        { name: 'Burpees', sets: 4, reps: 10, equipment: 'None' },
        { name: 'Mountain Climbers', sets: 4, reps: 30, equipment: 'None' },
        { name: 'High Knees', sets: 4, reps: 30, equipment: 'None' },
        { name: 'Jump Squats', sets: 4, reps: 15, equipment: 'None' },
        { name: 'Speed Skaters', sets: 4, reps: 20, equipment: 'None' }
      ]
    },
    {
      id: 4,
      name: 'Core Strength',
      type: 'Strength',
      description: 'Focus on building a strong and stable core with these targeted exercises.',
      duration: '25 minutes',
      image: 'assets/workouts/core.gif',
      exercises: [
        { name: 'Plank', sets: 3, reps: 45, equipment: 'None' },
        { name: 'Bicycle Crunches', sets: 3, reps: 20, equipment: 'None' },
        { name: 'Russian Twists', sets: 3, reps: 16, equipment: 'None' },
        { name: 'Leg Raises', sets: 3, reps: 15, equipment: 'None' },
        { name: 'Mountain Climbers', sets: 3, reps: 20, equipment: 'None' }
      ]
    }
  ];

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage?.create();
  }

  getAllWorkouts() {
    return [...this.workouts];
  }

  getWorkoutById(id: number) {
    return this.workouts.find(workout => workout.id === id);
  }

  getWorkoutsByType(type: string) {
    return this.workouts.filter(workout => workout.type === type);
  }

  async markWorkoutCompleted(workoutId: number) {
    // Find workout in the array
    const index = this.workouts.findIndex(w => w.id === workoutId);
    if (index !== -1) {
      this.workouts[index].completed = true;
      this.workouts[index].dateCompleted = new Date();
      
      // Store in local storage
      await this.saveCompletedWorkouts();
      return true;
    }
    return false;
  }

  async saveCompletedWorkouts() {
    const completed = this.workouts.filter(w => w.completed);
    await this.storage?.set('completedWorkouts', completed);
  }

  async loadCompletedWorkouts() {
    const completed = await this.storage?.get('completedWorkouts') || [];
    
    // Update the workouts array with completion status
    if (completed.length > 0) {
      completed.forEach((comp: Workout) => {
        const index = this.workouts.findIndex(w => w.id === comp.id);
        if (index !== -1) {
          this.workouts[index].completed = true;
          this.workouts[index].dateCompleted = new Date(comp.dateCompleted ?? new Date());
        }
      });
    }
    
    return this.workouts.filter(w => w.completed);
  }

  async resetProgress() {
    // Reset completion status for all workouts
    this.workouts.forEach(workout => {
      workout.completed = false;
      workout.dateCompleted = undefined;
    });
    
    // Clear storage
    await this.storage?.remove('completedWorkouts');
    return true;
  }
}