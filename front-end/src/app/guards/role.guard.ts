import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const usuarioJson = sessionStorage.getItem('usuario');

  if (!usuarioJson) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const usuario = JSON.parse(usuarioJson);
    const perfil = usuario?.perfil;
    const perfisPermitidos = route.data?.['roles'] as string[] | undefined;

    if (perfisPermitidos?.includes(perfil)) {
      return true;
    }
  } catch (erro) {
    console.error('Erro ao ler usuário da sessão', erro);
  }

  router.navigate(['/home']);
  return false;
};
