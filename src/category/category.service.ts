import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../supabase.client'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoryService {
  async getCategory() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('category').select('*').order('id', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }

  async replaceAll(categories: CategoryDto[], files: Express.Multer.File[]) {
    const supabase = getSupabaseClient()
    const imageUrls: { [key: number]: string } = {}

    for (const file of files) {
      const idFromField = parseInt(file.fieldname.split('-')[1])
      const ext = file.originalname.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage.from('category-img').upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      })

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { data } = supabase.storage.from('category-img').getPublicUrl(fileName)
      imageUrls[idFromField] = data.publicUrl
    }

    const updatedCategories = categories.map((cat) => ({
      ...cat, image: imageUrls[cat.id] ?? cat.image,
    }))

    const { error: deleteError } = await supabase.from('category').delete().neq('id', -1)

    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`)
    }

    const { error: insertError } = await supabase.from('category').insert(updatedCategories)

    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`)
    }

    return { message: 'Categories replaced' }
  }

}
