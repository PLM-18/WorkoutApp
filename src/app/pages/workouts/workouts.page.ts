import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService, Workout } from '../../services/workout.service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss'],
  standalone: false
})
export class WorkoutsPage implements OnInit {
  workouts: Workout[] = [];
  selectedType: string = 'all';
  types: string[] = ['all', 'Weight Loss', 'Muscle Gain', 'Cardio', 'Strength'];

  constructor(
    private workoutService: WorkoutService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadWorkouts();
  }

  ionViewWillEnter() {
    this.loadWorkouts();
  }

  loadWorkouts() {
    if (this.selectedType === 'all') {
      this.workouts = this.workoutService.getAllWorkouts();
    } else {
      this.workouts = this.workoutService.getWorkoutsByType(this.selectedType);
    }
  }

  filterWorkouts(event: any) {
    this.selectedType = event.detail.value;
    this.loadWorkouts();
  }

  openWorkoutDetails(id: number) {
    this.router.navigate(['/tabs/workouts', id]);
  }
}