import { Routes } from '@angular/router';
import { Login } from './pages/login/login'
import { Home } from './pages/home/home';
import { Fila } from './pages/fila/fila';
import { Followup } from './pages/followup/followup';
import { Dashboard } from './pages/dashboard/dashboard';
import { Gamificacao } from './pages/gamificacao/gamificacao';
import { LojaCheia } from './pages/lojaCheia/lojaCheia';
import { Pendencias } from './pages/pendencias/pendencias';
import { Futuro } from './pages/futuro/futuro';

// Rota de acesso as paginas
export const routes: Routes = [
    /* Definir a página de login como inicial */
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component: Login
    },
    // Página home
    {
        path:'home',
        component: Home,
        // Componentes da página home
        children: [
            // Tela inicial ao ser carregada dentro do Home
            {
                path:'',
                redirectTo:'fila',
                pathMatch: 'full'
            },
            {
                path:'fila',
                component: Fila
            },
            {
                path:'followup',
                component: Followup
            },
            {
                path:'dashboard',
                component: Dashboard
            },
            {
                path:'gamificacao',
                component: Gamificacao
            },
            {
                path:'lojaCheia',
                component: LojaCheia
            },
            {
                path:'pendencias',
                component: Pendencias
            },
            {
                path:'futuro',
                component: Futuro
            }

        ]
    }
];