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
    const { data, error } = await supabase.from('members').select('*').order('id', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }
}