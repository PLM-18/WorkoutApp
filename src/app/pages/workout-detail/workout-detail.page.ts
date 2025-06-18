import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { WorkoutService, Workout, Exercise } from '../../services/workout.service';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.page.html',
  styleUrls: ['./workout-detail.page.scss'],
  standalone: false
})
export class WorkoutDetailPage implements OnInit {
  workout: Workout | undefined;

  constructor(
    private route: ActivatedRoute,
    private workoutService: WorkoutService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadWorkout();
  }

  ionViewWillEnter() {
    this.loadWorkout();
  }

  loadWorkout() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.workout = this.workoutService.getWorkoutById(id);
  }

  async markAsCompleted() {
    if (!this.workout) return;

    const success = await this.workoutService.markWorkoutCompleted(this.workout.id);

    if (success) {
      this.workout.completed = true;
      this.workout.dateCompleted = new Date();

      const toast = await this.toastController.create({
        message: 'Workout marked as completed!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
    }
  }
}