'use server';

import { revalidatePath } from 'next/cache';

export async function deleteProduct(formData: FormData) {
  console.log('Mock: Delete product functionality');
  // let id = Number(formData.get('id'));
  // await deleteProductById(id);
  // revalidatePath('/');
}
