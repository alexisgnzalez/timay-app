import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CardsComponent } from './cards/cards.component';

const routes: Routes = [
  { path: '',   redirectTo: '/main-page', pathMatch: 'full' },
  { path: 'main-page', component: MainPageComponent },
  { path: 'cards-page', component: CardsComponent},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
