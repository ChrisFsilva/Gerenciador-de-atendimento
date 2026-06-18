import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (
    req,
    next
) => {
    if (typeof window === 'undefined'){
        return next(req);
    }

    const token = localStorage.getItem('token');
     console.log('TOKEN ENCONTRADO:', token);

    if (!token){
        return next(req);
    }

    const novaRequisicao = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    console.log('TOKEN GERADO:', token);
    console.log(novaRequisicao.headers.get('Authorization'));
    return next(novaRequisicao);
};