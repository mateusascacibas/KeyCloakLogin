import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  // Aqui você pode adicionar o redirecionamento forçado
  {
    path: '',
    redirectTo: '/', // Garante que o caminho tenha uma barra no final
    pathMatch: 'full',
  },
  // Você pode adicionar outras rotas conforme necessário
  {
    path: '**',
    redirectTo: '/', // Garante que todas as rotas erradas redirecionem para home com barra
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
