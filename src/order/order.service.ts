import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../supabase.client'
import { ProductDto } from './dto/product'
import { OrderDto } from './dto/order'

@Injectable()
export class OrderService {
  async getOrders(user: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('orders').select(`*`)
      .eq('userId', user)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw new Error(error.message)
    return data?.[0] || null
  }

  async getThisOrder(user: string, orderId: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('orders').select(`*`)
      .eq('userId', user)
      .eq('orderId', orderId)
      .limit(1)

    if (error) throw new Error(error.message)
    return data || null
  }

  async getAllOrders(user: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('orders').select(`*`)
      .eq('userId', user).order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  }

  async getAllOrderedProducts(user: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('orderedProducts').select(`*`)
      .eq('userId', user).order('id', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  }

  async addOrder(orderInfo: OrderDto, productInfo: ProductDto[]) {
    const supabase = getSupabaseClient()

    const short = require('short-uuid')
    const translator = short()
    const orderId = translator.new()

    const { error } = await supabase.from('orders').insert([
      {
        orderId,
        created_at: new Date(),
        ...orderInfo
      },
    ])

    if (error) {
      throw new Error(`Insert failed: ${error.message}`)
    }

    const productsToInsert = productInfo.map((item) => ({
      orderId,
      ...item,
    }))

    const { error: insertionError } = await supabase.from('orderedProducts').insert(productsToInsert)

    if (insertionError) {
      throw new Error(`Insert failed: ${insertionError.message}`)
    }

    return { message: 'orders added for user' }
  }

  async updateOrderStatus(orderId: string, info: ProductDto) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('orders')
      .update('')
      .eq('orderId', orderId)

    if (error) {
      throw new Error(`Update failed: ${error.message}`)
    }

    return data
  }
}
