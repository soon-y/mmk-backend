import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../supabase.client'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UsersService {

  async findUserByEmail(email: string): Promise<any | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('members').select('*').eq('email', email).single()

    if (error) return null
    return data
  }

  async createUser(name: string, email: string, password: string) {
    const supabase = getSupabaseClient()
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()

    const { data, error } = await supabase.from('members').insert([
      {
        id: userId,
        name,
        email,
        password: hashedPassword,
        avatar_url: `https://i.pravatar.cc/1000?u=${userId}`,
        created_at: new Date(),
        admin: false,
      },
    ])

    if (error) {
      throw new Error(error.message)
    }
    return data
  }

  async findByEmail(email: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('members').select('*').eq('email', email).single()

    if (error) {
      return null
    }
    return data
  }

  async findUserById(id: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('members').select('*').eq('id', id).single()

    if (error) {
      return null
    }
    return data
  }

  async getAllMembers() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }

  async getAllCustomers() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('customer').select('id, email, created_at, firstName, lastName, contact, payment ').order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }

  async findCustomerByEmail(email: string): Promise<any | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('customer').select('*').eq('email', email).single()

    if (error) return null
    return data
  }

  async createCustomer(email: string, password: string, firstName: string, lastName: string,) {
    const supabase = getSupabaseClient()
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()

    const { data, error } = await supabase.from('customer').insert([
      {
        id: userId,
        email,
        password: hashedPassword,
        created_at: new Date(),
        firstName,
        lastName,
      },
    ])

    const { error: addrInsertionError } = await supabase.from('address').insert([
      {
        id: userId, firstName, lastName, select: true, index: 1
      },
    ])

    if (addrInsertionError) {
      throw new Error(addrInsertionError.message)
    }

    const { error: BiillingAddrInsertionError } = await supabase.from('billing').insert([
      {
        id: userId, firstName, lastName, select: true, index: 1
      },
    ])

    if (BiillingAddrInsertionError) {
      throw new Error(BiillingAddrInsertionError.message)
    }

    if (error) {
      throw new Error(error.message)
    }
    return data
  }

  async findCustomerById(id: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('customer').select('*').eq('id', id).single()

    if (error) {
      return null
    }
    return data
  }

  async findCustomerInfoByUserId(id: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('customer').select('id, email, firstName, lastName, created_at, contact, payment').eq('id', id).single()
    if (error) {
      return null
    }
    return data
  }

  async findCustomerAddrByUserId(id: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('address').select('*').eq('id', id).eq('select', true).single()
    if (error) {
      return null
    }
    return data
  }

  async findCustomerBillingAddrByUserId(id: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('billing').select('*').eq('id', id).eq('select', true).single()
    if (error) {
      return null
    }
    return data
  }

  async findCustomerOrdersByUserId(id: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('orders').select('*').eq('userId', id)
    if (error) {
      return null
    }
    return data
  }

  async updateCustomerInfo(id: string, info: Record<string, any>) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('customer').update(info).eq('id', id).select()

    if (error) {
      console.error('Update failed:', error)
      return null
    }

    return data
  }

  async updateCustomerAddr(id: string, index: number, info: Record<string, any>) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('address').update(info)
      .eq('id', id)
      .eq('index', index)
      .select()

    if (error) {
      console.error('Update failed:', error)
      return null
    }

    return data
  }

  async updateCustomerBillingAddr(id: string, index: number, info: Record<string, any>) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('billing').update(info)
      .eq('id', id)
      .eq('index', index)
      .select()

    if (error) {
      console.error('Update failed:', error)
      return null
    }

    return data
  }

  async addCustomerAddr(info: Record<string, any>) {
    const supabase = getSupabaseClient()

    console.log('Inserting address:', info)

    const { data, error } = await supabase.from('address').insert([info])

    if (error) {
      console.error('Update failed:', error)
      return null
    }

    return data
  }

  async addCustomerBillingAddr(info: Record<string, any>) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('billing').insert([info])

    if (error) {
      console.error('Update failed:', error)
      return null
    }

    return data
  }

  async getAddr(id: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('address').select('*').eq('id', id).order('index', { ascending: true })

    if (error) {
      return null
    }
    return data
  }

  async getBiilingAddr(id: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('billing').select('*').eq('id', id).order('index', { ascending: true })

    if (error) {
      return null
    }
    return data
  }

  async deleteCustomerAddr(id: string, index: number, target: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from(target).delete().eq('id', id).eq('index', index)

    if (error) {
      return null
    }
    return data
  }

  async updateAddrSelection(id: string, index: number, target: string) {
    const supabase = getSupabaseClient()

    const { error: setTrueError } = await supabase
      .from(target)
      .update({ select: true })
      .eq('id', id)
      .eq('index', index)

    const { error: setFalseError } = await supabase
      .from(target)
      .update({ select: false })
      .eq('id', id)
      .neq('index', index)

    if (setTrueError || setFalseError) {
      console.error('Update failed:', setTrueError || setFalseError)
      return null
    }

    const { data } = await supabase
      .from(target)
      .select('*')
      .eq('id', id)

    return data
  }
}