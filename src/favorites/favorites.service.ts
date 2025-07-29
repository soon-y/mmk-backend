import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../supabase.client'
import { FavoritesDto } from './dto/favorites.dto'

@Injectable()
export class FavoritesService {
  async getFavorites(user: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('favorites').select('id, size, color').eq('user', user).order('index', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  async dropFavorites(user: string) {
    const supabase = getSupabaseClient()
    const { error } = await supabase.from('favorites').delete().eq('user', user)

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }

    return { message: 'Favorites deleted for user' }
  }

  async addFavorites(user: string, product: FavoritesDto) {
    const supabase = getSupabaseClient()

    const { data: existing, error: selectError } = await supabase
      .from('favorites')
      .select('index')
      .eq('user', user)
      .eq('id', product.id)
      .eq('color', product.color)
      .limit(1)

    if (selectError) {
      throw new Error(`Select failed: ${selectError.message}`)
    }

    if (existing && existing.length > 0) {
      return { message: 'Favorite already exists' }
    }

    const newData = {
      user,
      id: product.id,
      size: product.size,
      color: product.color,
      created_at: new Date(),
    }

    const { error: insertError } = await supabase.from('favorites').insert(newData)

    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`)
    }
    return { message: 'Favorites updated for user' }
  }

  async deleteFavorites(user: string, product: FavoritesDto) {
    const supabase = getSupabaseClient()

    const { error } = await supabase.from('favorites').delete()
      .eq('user', user)
      .eq('id', product.id)
      .eq('color', product.color)

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }

    return { message: 'Favorites deleted for user' }
  }

}
