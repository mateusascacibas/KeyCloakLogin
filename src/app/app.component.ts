import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoggedIn; else notLoggedIn">
      <h1>Bem-vindo!</h1>
      <p>Token: {{ accessToken }}</p>
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #notLoggedIn>
      <button (click)="login()">Login</button>
    </ng-template>
  `,
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  token: any = {
    access_token: null,
    refresh_token: null,
    id_token: null,
  };

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    try {
      this.isLoggedIn = await this.keycloakService.isLoggedIn();
      if (this.isLoggedIn) {
        this.loadTokens();
        console.log('Usuário autenticado. Token:', this.token.access_token);
      } else {
        console.log('Usuário não está autenticado.');
      }
    } catch (error) {
      console.error('Erro ao verificar status do login:', error);
    }
  }

  async loadTokens() {
    try {
      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      this.token.access_token = await this.keycloakService.getToken(); // Access Token
      this.token.refresh_token = keycloakInstance.refreshToken; // Refresh Token
      this.token.id_token = keycloakInstance.idToken; // ID Token
      console.log('Tokens carregados:', this.token);
    } catch (error) {
      console.error('Erro ao carregar tokens:', error);
    }
  }

  login() {
    this.keycloakService.login();
  }

  async logout() {
    try {
      // Garante que o KeycloakInstance esteja inicializado
      if (!this.keycloakService.getKeycloakInstance()) {
        console.log('Reinicializando Keycloak...');
        await this.keycloakService.init({
          config: {
            url: 'http://localhost:8080',
            realm: 'projeto_empresa',
            clientId: 'projeto_empresa_client',
          },
          initOptions: {
            onLoad: 'check-sso',
            checkLoginIframe: false,
          },
        });
      }

      console.log('Chamando logout...');
      await this.keycloakService.logout(window.location.origin);
      console.log('Logout realizado com sucesso.');
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Token copiado para a área de transferência!');
    });
  }
}
