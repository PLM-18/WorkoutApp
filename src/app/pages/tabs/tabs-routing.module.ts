import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'workouts',
        children: [
          {
            path: '',
            loadChildren: () => import('../workouts/workouts.module').then(m => m.WorkoutsPageModule)
          },
          {
            path: ':id',
            loadChildren: () => import('../workout-detail/workout-detail.module').then(m => m.WorkoutDetailPageModule)
          }
        ]
      },
      {
        path: 'progress',
        loadChildren: () => import('../progress/progress.module').then(m => m.ProgressPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/workouts',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/workouts',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }