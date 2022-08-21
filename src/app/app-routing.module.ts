import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CardsComponent } from './cards/cards.component';
import { ProfileComponent } from './profile/profile.component';
import { SkillsCardComponent } from './skills-card/skills-card.component';
import { LandingComponent } from './landing/landing.component';
import { FinalComponent } from './final/final.component';

const routes: Routes = [
  { path: '',   redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'cards-page', component: CardsComponent},
  { path: 'profile-page', component: ProfileComponent},
  { path: 'skills-page', component: SkillsCardComponent },
  { path: 'final', component: FinalComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
