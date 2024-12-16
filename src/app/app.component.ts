import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    KeycloakAngularModule,
  ],
})
export class AppComponent implements OnInit {
  token: any;
  authCode: string | undefined;

  constructor(
    public keycloak: KeycloakService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const idToken = localStorage.getItem('id_token');

    if (accessToken && refreshToken) {
      this.token = {
        access_token: accessToken,
        refresh_token: refreshToken,
        id_token: idToken,
      };
    } else {
      this.route.queryParams.subscribe((params) => {
        if (params['code']) {
          this.authCode = params['code'];
          this.getToken();
        }
      });
    }
  }

  // Função para login, redirecionando para o Keycloak
  login() {
    const keycloakUrl = `http://localhost:8080/realms/projeto_empresa/protocol/openid-connect/auth?client_id=projeto_empresa_client&response_type=code&scope=openid&redirect_uri=http://localhost:4200/`;
    window.location.href = keycloakUrl;
  }

  // Função para logout
  logout() {
    this.keycloak.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
    this.token = null;
    this.router.navigate(['/']);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Token copiado para a área de transferência!');
    });
  }

  get isKeycloakLoggedIn(): boolean {
    return !!this.keycloak.getKeycloakInstance()?.authenticated;
  }

  // Função para trocar o Authorization Code pelo Token
  getToken() {
    const tokenUrl =
      'http://localhost:8080/realms/projeto_empresa/protocol/openid-connect/token';

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', 'projeto_empresa_client');
    body.set('client_secret', 'jjx1kwzGy6QVahZOINnNfUPwqG5enJ3e');
    body.set('code', this.authCode as string);
    body.set('redirect_uri', 'http://localhost:4200/');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(tokenUrl, body.toString(), { headers }).subscribe(
      (response: any) => {
        console.log('Token recebido:', response);
        this.token = response;
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('id_token', response.id_token);

        // Atualiza a UI
        this.router.navigate(['/']); // Redireciona para a página principal
      },
      (error) => {
        console.error('Erro ao obter token:', error);
      }
    );
  }

  get isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('access_token');
    return !!accessToken;
  }
}
