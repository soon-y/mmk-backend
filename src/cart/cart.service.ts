import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../supabase.client'
import { CartDto } from './dto/cart'

@Injectable()
export class CartService {
  async getCart(user: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('cart').select('*').eq('user', user).order('index', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  async dropCart(user: string) {
    const supabase = getSupabaseClient()
    const { error } = await supabase.from('cart').delete().eq('user', user)

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }

    return { message: 'Cart deleted for user' }
  }

  async addCart(user: string, product: CartDto) {
    const supabase = getSupabaseClient()

    const { data: existing, error: selectError } = await supabase
      .from('cart')
      .select('*')
      .eq('user', user)
      .eq('id', product.id)
      .eq('size', product.size)
      .eq('color', product.color)
      .limit(1)

    if (selectError) {
      throw new Error(`Select failed: ${selectError.message}`)
    }

    if (existing && existing.length > 0) {
      const current = existing[0]
      const updatedQnt = (current.qnt ?? 1) + 1

      const { error: updateError } = await supabase.from('cart').update({ qnt: updatedQnt })
        .eq('user', user)
        .eq('id', product.id)
        .eq('size', product.size)
        .eq('color', product.color)

      if (updateError) {
        throw new Error(`Insert failed: ${updateError.message}`)
      }
      return { message: 'Cart updated for user' }
    } else {
      const newData = {
        user,
        id: product.id,
        size: product.size,
        color: product.color,
        qnt: product.qnt,
        created_at: new Date(),
      }

      const { error: insertError } = await supabase.from('cart').insert(newData)

      if (insertError) {
        throw new Error(`Insert failed: ${insertError.message}`)
      }
      return { message: 'Cart added for user' }
    }
  }

  async deleteCart(user: string, product: CartDto) {
    const supabase = getSupabaseClient()

    const { error } = await supabase.from('cart').delete()
      .eq('user', user)
      .eq('id', product.id)
      .eq('size', product.size)
      .eq('color', product.color)
      .eq('qnt', product.qnt)

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }

    return { message: 'Cart deleted for user' }
  }

  async updateCartQnt(user: string, index: number, qnt: number) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('cart').select('*').eq('user', user).order('index', { ascending: false })

    if (error) {
      throw new Error(`Select failed: ${error.message}`)
    }

    if (!data || index < 0 || index >= data.length) {
      throw new Error('Invalid index')
    }

    const item = data[index]

    const { error: updateError } = await supabase.from('cart').update({ qnt })
      .eq('user', user)
      .eq('id', item.id)
      .eq('size', item.size)
      .eq('color', item.color)

    if (updateError) {
      throw new Error(`Update failed: ${updateError.message}`)
    }

    return { message: 'Cart quantity updated' }
  }

  async getCartQnt(user: string, query: { id: number; size: number; color: number }) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('cart').select('qnt')
    .eq('user', user)
    .eq('id', query.id)
    .eq('size', query.size)
    .eq('color', query.color)
    .limit(1)

  if (error) throw new Error(error.message)

  return data?.[0]?.qnt ?? 0 
  }
}
