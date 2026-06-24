import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks() {
    return this.tasksService.getAllTasks();
  }

 @Post()
createTask(
  @Body('title') title: string,
  @Body('priority') priority: string,
) {
  return this.tasksService.createTask(title, priority);
}

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(Number(id));
  }

  @Patch(':id')
  completeTask(@Param('id') id: string) {
    return this.tasksService.completeTask(Number(id));
  }
}