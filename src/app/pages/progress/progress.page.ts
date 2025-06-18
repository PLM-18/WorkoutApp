import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { WorkoutService, Workout } from '../../services/workout.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: false
})
export class ProgressPage implements OnInit {
  completedWorkouts: Workout[] = [];

  constructor(
    private workoutService: WorkoutService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadProgress();
  }

  ionViewWillEnter() {
    this.loadProgress();
  }

  async loadProgress() {
    this.completedWorkouts = await this.workoutService.loadCompletedWorkouts();
  }

  async resetProgress() {
    const alert = await this.alertController.create({
      header: 'Reset Progress',
      message: 'Are you sure you want to reset all your workout progress? This cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Reset',
          handler: async () => {
            const success = await this.workoutService.resetProgress();

            if (success) {
              this.completedWorkouts = [];

              const toast = await this.toastController.create({
                message: 'Your progress has been reset',
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }
}