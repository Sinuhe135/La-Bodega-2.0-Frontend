import { CreateCategoryDto } from "../dtos/category/create_category.dto";
import { CreateCategoryResponseDto } from "../dtos/category/create_category_reponse.dto";
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

export async function createCategoryApi(name: string) : Promise<CreateCategoryResponseDto> {
    const token = useUserToken().value

    const createCategoryDto: CreateCategoryDto = {
        name: name,
    }

    const response = await apiClient.post('/category', createCategoryDto, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}