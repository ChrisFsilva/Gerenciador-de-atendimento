import { Routes } from '@angular/router';

//--------------------------------------------------
//------------ PÁGINAS IMPORTADAS ------------------
//--------------------------------------------------
//------------- AREA DO VENDEDOR -------------------
//--------------------------------------------------
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Fila } from './pages/fila/fila';
import { Followup } from './pages/followup/followup';
import { Dashboard } from './pages/dashboard/dashboard';
import { Gamificacao } from './pages/gamificacao/gamificacao';
import { GamificacaoGuard } from './guards/gamificacao.guard';
import { LojaCheia } from './pages/lojaCheia/lojaCheia';
import { Pendencias } from './pages/pendencias/pendencias';
import { Futuro } from './pages/futuro/futuro';
import { Historico } from './pages/historico/historico';

//--------------------------------------------------
//-------------- AREA GERENCIAL --------------------
//--------------------------------------------------
import { FilaGerencial } from './pages/area-gerencial/fila/fila';
import { AreaGerencial } from './pages/area-gerencial/area-gerencial';
import { FollowsGerencial } from './pages/area-gerencial/follows-gerencial/follows-gerencial';
//--------------------------------------------------
//------------ MÓDULO DE SEGURANÇA -----------------
//--------------------------------------------------
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['vendedor']
        },
        children: [
            {
                path: '',
                redirectTo: 'fila',
                pathMatch: 'full'
            },
            {
                path: 'fila',
                component: Fila,
                canActivate: [authGuard]
            },
            {
                path: 'followup',
                component: Followup,
                canActivate: [authGuard]
            },
            {
                path: 'dashboard',
                component: Dashboard,
                canActivate: [authGuard]
            },
            {
                path: 'gamificacao',
                component: Gamificacao,
                canActivate: [authGuard],
                canDeactivate: [GamificacaoGuard]
            },
            {
                path: 'lojaCheia',
                component: LojaCheia,
                canActivate: [authGuard]
            },
            {
                path: 'pendencias',
                component: Pendencias,
                canActivate: [authGuard]
            },
            {
                path: 'futuro',
                component: Futuro,
                canActivate: [authGuard]
            },
            {
                path: 'historico',
                component: Historico,
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: 'gerencial',
        component: AreaGerencial,
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['gerente', 'admin', 'diretoria']
        },
        children: [
            {
                path: '',
                redirectTo: 'fila',
                pathMatch: 'full'
            },
            {
                path: 'fila',
                component: FilaGerencial
            },
            {
                path: 'follows',
                component: FollowsGerencial
            }
        ]
    }
];
