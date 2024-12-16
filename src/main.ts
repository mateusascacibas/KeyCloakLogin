import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { KeycloakService } from 'keycloak-angular';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak
      .init({
        config: {
          url: 'http://localhost:8080',
          realm: 'projeto_empresa',
          clientId: 'projeto_empresa_client',
        },
        initOptions: {
          onLoad: 'check-sso', // ou 'login-required' se necessário
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
          checkLoginIframe: false,
        },
      })
      .then(() => console.log('Keycloak inicializado com sucesso'))
      .catch((error) => console.error('Erro ao inicializar Keycloak:', error));
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter([]),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    KeycloakService,
  ],
}).catch((err) => console.error('Erro ao inicializar o Keycloak:', err));
