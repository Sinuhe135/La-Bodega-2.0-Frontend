import { CreateAccountDto } from "../dtos/account/create_account.dto";
import { GetAllAccountsResponseDto } from "../dtos/account/get_all_accounts_response.dto";
import { CreateCategoryResponseDto } from "../dtos/category/create_category_reponse.dto";
import { PaginatedResult, PaginationParams } from "../types/pagination";
import { apiClient } from "./client";

export async function getAllAccountsByCategoryApi(categoryId: number, limit: number, page: number) : Promise<PaginatedResult<GetAllAccountsResponseDto>> {
    const token = useUserToken().value

    const paginationQuery : PaginationParams = {
        limit: limit.toString(),
        page: page.toString(),
    }

    const response = await apiClient.get(`/account/all/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: paginationQuery,
    });

    console.log('getAllAccountsByCategoryApi response', response.data)

    return response.data;
}

export async function createAccountApi(categoryId: number, name: string, email: string, password: string, platform: string, username: string) : Promise<CreateCategoryResponseDto> {
    const token = useUserToken().value

    const createAccountDto: CreateAccountDto = {
        categoryId: categoryId,
        name: name,
        email: email,
        password: password,
        platform: platform,
        username: username,
    }

    console.log('createAccountDto', createAccountDto)

    const response = await apiClient.post('/account', createAccountDto, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}