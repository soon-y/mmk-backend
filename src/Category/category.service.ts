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

  async replaceAll(categories: CategoryDto[]) {
    const supabase = getSupabaseClient()
    const { error: deleteError } = await supabase.from('category').delete().neq('id', -1)

    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`)
    }

    const { data, error: insertError } = await supabase.from('category').insert(categories)

    if (insertError) {
      console.error('Insert error:', insertError)
      throw new Error(`Insert failed: ${insertError.message}`)
    }

    console.log(data)

    return { message: 'Categories replaced' }
  }

}
