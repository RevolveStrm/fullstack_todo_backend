import { PrismaClient, TaskPriority, TaskStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRaw`TRUNCATE TABLE users CASCADE`;
  await prisma.$queryRaw`TRUNCATE TABLE tasks CASCADE`;

  const passwordHash1 = await bcrypt.hash('password123', 12);
  const passwordHash2 = await bcrypt.hash('adminpassword', 12);
  const passwordHash3 = await bcrypt.hash('guestpassword', 12);

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: passwordHash1,
      role: UserRole.USER,
      refreshToken: null,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: passwordHash2,
      role: UserRole.ADMIN,
      refreshToken: null,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: passwordHash3,
      role: UserRole.USER,
      refreshToken: null,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Complete project report',
        description: 'Finish the annual project report for submission.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        userId: user1.id,
      },
      {
        title: 'Team meeting',
        description: 'Prepare slides for the team meeting.',
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'System check',
        description: 'Perform a full system diagnostics.',
        status: TaskStatus.CANCELED,
        priority: TaskPriority.HIGH,
        userId: admin.id,
      },
      {
        title: 'Bug fixing',
        description: 'Fix the bugs found in the last sprint.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        userId: user2.id,
      },
      {
        title: 'Code review',
        description: 'Review the code submitted by team members.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        userId: user2.id,
      },
      {
        title: 'Update documentation',
        description: 'Ensure all project documentation is up to date.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        userId: user1.id,
      },
      {
        title: 'Server maintenance',
        description: 'Conduct a regular maintenance check on the server.',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        userId: admin.id,
      },
      {
        title: 'Prepare budget proposal',
        description: 'Create a detailed budget proposal for the upcoming quarter.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'Refactor old codebase',
        description: 'Refactor the outdated codebase to improve performance.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        userId: user1.id,
      },
      {
        title: 'User interface redesign',
        description: 'Redesign the user interface for better UX.',
        status: TaskStatus.CANCELED,
        priority: TaskPriority.LOW,
        userId: user1.id,
      },
      {
        title: 'Security patch deployment',
        description: 'Apply the latest security patches to the production environment.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'Prepare quarterly presentation',
        description: 'Create slides for the quarterly business review presentation.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        userId: user1.id,
      },
      {
        title: 'Database optimization',
        description: 'Optimize database queries for better performance.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        userId: user1.id,
      },
      {
        title: 'API documentation update',
        description: 'Update the API documentation to reflect new changes.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'Test new features',
        description: 'Test newly implemented features before release.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'Create unit tests',
        description: 'Write unit tests for the newly added functionalities.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        userId: user1.id,
      },
      {
        title: 'Client feedback review',
        description: 'Review client feedback and plan next steps.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        userId: user1.id,
      },
      {
        title: 'Team performance analysis',
        description: 'Analyze team performance metrics for the past month.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'Project milestone review',
        description: 'Review the progress on current project milestones.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        userId: user1.id,
      },
      {
        title: 'Create marketing campaign plan',
        description: 'Plan the next marketing campaign with a focus on digital channels.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        userId: user1.id,
      },
      {
        title: 'Create API integration plan',
        description: 'Draft a plan for integrating external APIs into the system.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'Prepare training materials',
        description: 'Prepare training materials for the new team members.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'Customer support training',
        description: 'Train the customer support team on new product features.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        userId: user1.id,
      },
      {
        title: 'Marketing content creation',
        description: 'Create content for the marketing team.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        userId: user1.id,
      },
      {
        title: 'Develop new user features',
        description: 'Develop new features based on user feedback.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        userId: user1.id,
      },
      {
        title: 'Task delegation plan',
        description: 'Plan the task delegation for the next sprint.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        userId: user1.id,
      },
      {
        title: 'Codebase cleanup',
        description: 'Remove unused code and files from the repository.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        userId: user1.id,
      },
    ],
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
