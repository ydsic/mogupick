import { apiFetch } from './client';

export const createBrand = (brandName: string) => apiFetch(`/brand`, 'POST', { body: brandName });

export const deleteBrand = (brandId: number) => apiFetch(`/brand/${brandId}`, 'DELETE');
