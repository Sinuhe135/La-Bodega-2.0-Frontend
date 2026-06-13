import { CurrentUserResponseDto } from "../dtos/auth/current_user_response.dto";
import { LoginDto } from "../dtos/auth/login.dto";
import { LoginResponseDto } from "../dtos/auth/login_response.dto";
import { apiClient } from "./client";

export async function loginApi(username: string, keyHash: string) : Promise<LoginResponseDto> {
    const loginDto : LoginDto = {
        username: username,
        keyHash: keyHash
    }

    const response = await apiClient.post('/auth/login',loginDto);

    return {
        jwt: response.data.jwt,
    }
}

export async function signupApi(username: string, keyHash: string) : Promise<LoginResponseDto> {
    const loginDto : LoginDto = {
        username: username,
        keyHash: keyHash
    }

    const response = await apiClient.post('/auth/signup',loginDto);

    return {
        jwt: response.data.jwt,
    }
}

export async function getCurrentUserApi(token:string | null) : Promise<CurrentUserResponseDto> {
    // const token = useUserToken().value
    console.log('Getting current user with token:', token)

    const response = await apiClient.get('/auth/current', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return {
        id: response.data.id,
        username: response.data.username,
    }
}