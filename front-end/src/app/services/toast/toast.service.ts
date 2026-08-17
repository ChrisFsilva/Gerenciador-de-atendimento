import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastModel {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toasts: ToastModel[] = [];

  private toastSubject = new BehaviorSubject<ToastModel[]>([]);

  toast$ = this.toastSubject.asObservable();

  success(message: string) {
    this.add(message, 'success');
  }

  error(message: string) {
    this.add(message, 'error');
  }

  warning(message: string) {
    this.add(message, 'warning');
  }

  
  info(message: string) {
    this.add(message, 'info');
  }
  
  private add(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) {
    
    const toast: ToastModel = {
      id: Date.now(),
      message,
      type
    };

    this.toasts.push(toast);

    this.toastSubject.next([...this.toasts]);
    console.log('Criando popup:', toast.id);
    setTimeout(() => {
      this.remove(toast.id);
    }, 3000);
  }

  remove(id: number) {
    console.log('Removendo popup:', id);
    this.toasts = this.toasts.filter(
      t => t.id !== id
    );

    this.toastSubject.next([...this.toasts]);

  }

}