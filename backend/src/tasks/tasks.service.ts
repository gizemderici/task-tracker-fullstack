import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  getAllTasks() {
    return this.prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

 createTask(title: string, priority: string) {
  return this.prisma.task.create({
    data: {
      title,
      priority,
    },
  });
}

  deleteTask(id: number) {
    return this.prisma.task.delete({
      where: {
        id: id,
      },
    });
  }

  completeTask(id: number) {
    return this.prisma.task.update({
      where: {
        id: id,
      },
      data: {
        completed: true,
      },
    });
  }
}