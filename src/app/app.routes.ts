import { Routes } from '@angular/router';
import { Login } from './pages/login/login'
import { Fila } from './pages/fila/fila';

// Rota de acesso as paginas
export const routes: Routes = [
    /* Definir a página de login como inicial */
    {
        path:'',
        redirectTo:'login',
        pathMatch: 'full'
    },
    /* Criar rota da página de login*/
    {
        path:'login',
        component: Login
    },
    /* Criar rota da página de login*/
    {
        path:'fila',
        component: Fila
    },

];