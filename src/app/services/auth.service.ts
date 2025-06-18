import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

export interface User {
  username: string;
  password: string;
  name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  private _currentUser = new BehaviorSubject<User | null>(null);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage?.create();
    this.checkAuth();
  }

  async checkAuth() {
    const currentUser = await this.storage?.get('currentUser');
    if (currentUser) {
      this._isAuthenticated.next(true);
      this._currentUser.next(currentUser);
    }
  }

  isAuthenticated() {
    return this._isAuthenticated.asObservable();
  }

  currentUser() {
    return this._currentUser.asObservable();
  }

  async register(user: User) {

    const users = await this.storage?.get('users') || [];

    const exists = users.find((u: User) => u.username === user.username);
    if (exists) {
      return { success: false, message: 'Username already exists' };
    }

    users.push(user);
    await this.storage?.set('users', users);

    return this.login(user.username, user.password);
  }

  async login(username: string, password: string) {
    const users = await this.storage?.get('users') || [];

    const user = users.find((u: User) =>
      u.username === username && u.password === password);

    if (user) {
      await this.storage?.set('currentUser', user);
      this._isAuthenticated.next(true);
      this._currentUser.next(user);
      return { success: true, user };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  }

  async logout() {
    await this.storage?.remove('currentUser');
    this._isAuthenticated.next(false);
    this._currentUser.next(null);
    return true;
  }
}