import { GetAllCategoriesResponseDto } from "../dtos/category/get_all_categories_response.dto";
import { apiClient } from "./client";

export async function getAllCategoriesApi() : Promise<GetAllCategoriesResponseDto[]> {
    const token = useUserToken().value

    const response = await apiClient.get('/category/all', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}