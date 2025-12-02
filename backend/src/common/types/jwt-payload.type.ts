export interface JwtPayload {
	sub: number;
	email: string;
	iat?: number;
	exp?: number;
}

export interface JwtPayloadWithRefreshToken extends JwtPayload {
	refreshToken: string;
}

