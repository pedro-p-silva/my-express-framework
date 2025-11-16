export interface AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}