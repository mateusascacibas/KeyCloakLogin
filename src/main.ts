import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http'; // Importando HttpClientModule
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'; // Keycloak
import { provideRouter, RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    HttpClientModule,
    KeycloakAngularModule,
    KeycloakService,
    RouterModule,
    provideRouter([]),
  ], // Adicionando HttpClientModule e KeycloakService
}).catch((err) => console.error(err));
