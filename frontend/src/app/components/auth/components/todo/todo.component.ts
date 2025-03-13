import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TaskService, Task } from '../../../services/task.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';

interface User {
  _id?: string; // Opsiyonel; backend'den geldikten sonra genellikle tanımlı olur.
  fullname: string;
  email: string;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  typeName: string = 'task';
  users: User[] = [];
  tasks: Task[] = [];
  list: any[] = [];
  newUser: Partial<User> = { fullname: '', email: '' };
  // Çoklu kullanıcı seçimi için user alanı string dizisi olarak tanımlandı.
  newItem: Partial<Task> = { startDate: '', endDate: '', title: '', user: [] as string[], completed: false };

  selectedUser: User | null = null;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
    this.changeType(this.typeName);
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (res: any[]) => {
        this.users = res.map(u => ({ _id: u._id, fullname: u.name, email: u.email }));
        if (this.typeName === 'user') {
          this.list = this.users;
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  // Kullanıcı isimlerini virgülle ayrılmış biçimde döndürür.
  getUserFullName(user: string | string[]): string {
    if (Array.isArray(user)) {
      return user.map(userId => {
        const foundUser = this.users.find(u => u._id === userId);
        return foundUser ? foundUser.fullname : 'Atanmadı';
      }).join(', ');
    } else {
      const foundUser = this.users.find(u => u._id === user);
      return foundUser ? foundUser.fullname : 'Atanmadı';
    }
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        // Yalnızca ana görevleri (alt görev olmayanları) listeye ekliyoruz.
        if (this.typeName === 'task') {
          this.list = this.tasks.filter(task => !task.parentTask);
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  changeType(type: string) {
    this.typeName = type;
    if (type === 'user') {
      this.list = this.users;
    } else if (type === 'task') {
      // Görevler arasında alt görevleri filtreleyerek yalnızca ana görevleri gösteriyoruz.
      this.list = this.tasks.filter(task => !task.parentTask);
    }
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }

  saveUser() {
    if (this.newUser.fullname && this.newUser.email) {
      const registerModel = {
        name: this.newUser.fullname,
        email: this.newUser.email,
        password: "defaultPassword"
      };
      this.authService.register(registerModel).subscribe({
        next: (res: any) => {
          const createdUser = res.user;
          const userObj: User = {
            fullname: createdUser.name,
            email: createdUser.email
          };
          this.users.push(userObj);
          if (this.typeName === 'user') {
            this.list = this.users;
          }
          this.newUser = { fullname: '', email: '' };
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  save() {
    if (this.newItem.startDate && this.newItem.endDate && this.newItem.title) {
      const task: Task = {
        startDate: this.newItem.startDate,
        endDate: this.newItem.endDate,
        title: this.newItem.title,
        user: this.newItem.user,
        completed: this.newItem.completed || false
      };
      this.taskService.addTask(task).subscribe({
        next: (savedTask: Task) => {
          console.log('Task saved:', savedTask);
          this.tasks.push(savedTask);
          // Sadece ana görevleri listeye ekle (alt görev eklenmişse listede görünmesin)
          if (this.typeName === 'task') {
            if (!savedTask.parentTask) {
              this.list = this.tasks.filter(t => !t.parentTask);
            }
          }
          // Görev kaydedildikten sonra formu temizle.
          this.newItem = { startDate: '', endDate: '', title: '', user: [] as string[], completed: false };
        },
        error: (err: any) => {
          console.error('Error saving task:', err);
        }
      });
    }
  }

  removeUser(user: User) {
    if (user._id) {
      this.authService.deleteUser(user._id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== user._id);
          if (this.typeName === 'user') {
            this.list = this.users;
          }
          if (this.selectedUser === user) {
            this.selectedUser = null;
          }
        },
        error: (err: any) => {
          console.error('Kullanıcı silinemedi:', err);
        },
        complete: () => {
          this.loadUsers();
        }
      });
    }
  }
  
  // Silme işlemi için SweetAlert2 pop-up'ı kullanıyoruz.
  remove(task: Task) {
    if (!task._id) return;
  
    Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu görevi silmek istediğinize emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    }).then((result: SweetAlertResult<any>) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:5000/api/tasks/${task._id}`).subscribe({
          next: () => {
            if (!task.parentTask) {
              this.tasks = this.tasks.filter(t => t.parentTask !== task._id);
            }
            this.tasks = this.tasks.filter(t => t._id !== task._id);
            // Listeyi yeniden filtreleyerek yalnızca ana görevleri gösteriyoruz.
            this.list = this.tasks.filter(t => !t.parentTask);
            Swal.fire('Silindi!', 'Görev başarıyla silindi.', 'success');
          },
          error: (err) => {
            console.error("Silme işlemi başarısız:", err);
            Swal.fire('Hata!', 'Görev silinemedi.', 'error');
          }
        });
      }
    });
  }
  
  toggleComplete(item: Task) {
    if (item._id) {
      const updatedCompleted = !item.completed;
      this.taskService.updateTask(item._id, { completed: updatedCompleted }).subscribe({
        next: (updatedTask: Task) => {
          item.completed = updatedTask.completed;
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  isUserSelected(userId: string | undefined): boolean {
    if (!userId) return false;
    return Array.isArray(this.newItem.user) && this.newItem.user.includes(userId);
  }
  
  toggleUserSelection(userId: string | undefined): void {
    if (!userId) return;
    if (!Array.isArray(this.newItem.user)) {
      this.newItem.user = [];
    }
    if (this.newItem.user.includes(userId)) {
      this.newItem.user = this.newItem.user.filter((id: string) => id !== userId);
    } else {
      this.newItem.user.push(userId);
    }
  }

  goToTaskDetail(task: Task): void {
    if (!task.parentTask && task._id) {
      const taskId: string = task._id;
      this.router.navigate(['/taskdetail'], { queryParams: { id: taskId } });
    }
  }

  // Görevin bitiş tarihine kalan gün sayısını hesaplar.
  getRemainingDays(task: Task): number {
    const end = new Date(task.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  }
}
