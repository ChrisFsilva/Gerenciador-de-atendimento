import { Routes } from '@angular/router';
import { Login } from './pages/login/login'
import { Home } from './pages/home/home';

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
    {
        path:'home',
        component: Home
    }

];