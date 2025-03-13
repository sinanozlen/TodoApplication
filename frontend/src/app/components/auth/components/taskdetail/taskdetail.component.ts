import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-taskdetail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taskdetail.component.html',
  styleUrls: ['./taskdetail.component.css']
})
export class TaskDetailComponent implements OnInit {
  mainTask: Task | null = null;
  subTasks: Task[] = [];
  newSubTask: Partial<Task> = { startDate: '', endDate: '', title: '', user: [], completed: false };
  users: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTaskDetail();
    this.loadUsers();
  }

  loadTaskDetail(): void {
    const taskId = this.route.snapshot.queryParamMap.get('id') as string;
    if (taskId) {
      this.taskService.getTaskDetail(taskId).subscribe({
        next: (data: any) => {
          this.mainTask = data.mainTask;
          this.subTasks = data.subTasks;
        },
        error: err => {
          console.error("Görev detayları alınamadı", err);
        }
      });
    }
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (res: any[]) => { this.users = res; },
      error: err => { console.error("Kullanıcılar alınamadı", err); }
    });
  }

  addSubTask(): void {
    if (this.mainTask && this.newSubTask.startDate && this.newSubTask.endDate && this.newSubTask.title) {
      const subTask: Task = {
        startDate: this.newSubTask.startDate,
        endDate: this.newSubTask.endDate,
        title: this.newSubTask.title,
        user: this.newSubTask.user,
        completed: this.newSubTask.completed || false,
        parentTask: this.mainTask._id
      };
      this.taskService.addTask(subTask).subscribe({
        next: (savedTask: Task) => {
          this.subTasks.push(savedTask);
          this.newSubTask = { startDate: '', endDate: '', title: '', user: [], completed: false };
        },
        error: err => {
          console.error("Alt görev eklenemedi", err);
        }
      });
    }
  }

  removeSubTask(subTaskId: string): void {
    this.taskService.deleteTask(subTaskId).subscribe({
      next: () => {
        this.subTasks = this.subTasks.filter(task => task._id !== subTaskId);
      },
      error: err => {
        console.error("Alt görev silinemedi", err);
      }
    });
  }

  /**
   * Kullanıcının adını getirir
   * Eğer kullanıcı birden fazlaysa, isimleri virgülle birleştirerek döndürür.
   */
  getUserFullName(user: string | string[]): string {
    if (Array.isArray(user)) {
      return user.map(userId => {
        const foundUser = this.users.find(u => u._id === userId);
        return foundUser ? foundUser.name || foundUser.fullname : 'Atanmadı';
      }).join(', ');
    } else {
      const foundUser = this.users.find(u => u._id === user);
      return foundUser ? foundUser.name || foundUser.fullname : 'Atanmadı';
    }
  }
}
