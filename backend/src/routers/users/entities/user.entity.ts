export class UserEntity {
	id: number;
	email: string;
	nickname: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}
