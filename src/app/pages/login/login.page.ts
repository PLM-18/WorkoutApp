import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  isLogin = true;

  loginData = {
    username: '',
    password: ''
  };

  signupData: User = {
    username: '',
    password: '',
    name: '',
    email: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  async login() {
    if (!this.loginData.username || !this.loginData.password) {
      this.presentToast('Please enter username and password');
      return;
    }

    const result = await this.authService.login(
      this.loginData.username,
      this.loginData.password
    );

    if (result.success) {
      this.router.navigate(['/tabs/workouts']);
    } else {
      this.presentToast(result.message || 'Login failed');
    }
  }

  async signup() {
    if (!this.signupData.username || !this.signupData.password) {
      this.presentToast('Username and password are required');
      return;
    }

    const result = await this.authService.register(this.signupData);

    if (result.success) {
      this.router.navigate(['/tabs/workouts']);
    } else {
      this.presentToast(result.message || 'Registration failed');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}