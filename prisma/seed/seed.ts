import { PrismaClient, TaskStatus, UserRole } from '@prisma/client';
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
				status: TaskStatus.UNDONE,
				priority: 1,
				userId: user1.id,
			},
			{
				title: 'Team meeting',
				description: 'Prepare slides for the team meeting.',
				status: TaskStatus.UNDONE,
				priority: 2,
				userId: user1.id,
			},
			{
				title: 'System check',
				description: 'Perform a full system diagnostics.',
				status: TaskStatus.DONE,
				priority: 3,
				userId: admin.id,
			},
			{
				title: 'Bug fixing',
				description: 'Fix the bugs found in the last sprint.',
				status: TaskStatus.UNDONE,
				priority: 2,
				userId: user2.id,
			},
			{
				title: 'Code review',
				description: 'Review the code submitted by team members.',
				status: TaskStatus.UNDONE,
				priority: 1,
				userId: user2.id,
			},
			{
				title: 'Update documentation',
				description: 'Ensure all project documentation is up to date.',
				status: TaskStatus.UNDONE,
				priority: 3,
				userId: user1.id,
			},
			{
				title: 'Server maintenance',
				description: 'Conduct a regular maintenance check on the server.',
				status: TaskStatus.DONE,
				priority: 4,
				userId: admin.id,
			},
		],
	});
}

main()
	.then(() => {
		console.log('Data has been seeded successfully.');
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
