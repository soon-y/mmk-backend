import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../supabase.client'
import { BannerDto } from './dto/banner.dto'

@Injectable()
export class BannerService {
  async getBanners() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('banner').select('*').order('id', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }

  async replaceAll(banners: BannerDto[], files: Express.Multer.File[]) {
    const supabase = getSupabaseClient()
    const imageUrls: { [key: number]: string } = {}

    for (const file of files) {
      const idFromField = parseInt(file.fieldname.split('-')[1])
      const ext = file.originalname.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage.from('banner-img').upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      })

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { data } = supabase.storage.from('banner-img').getPublicUrl(fileName)
      imageUrls[idFromField] = data.publicUrl
    }

    console.log(banners)

    const updatedBanners = banners.map((item) => ({
      ...item, image: imageUrls[item.id] ?? item.image,
    }))

    const { error: deleteError } = await supabase.from('banner').delete().neq('id', -1)

    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`)
    }

    const { error: insertError } = await supabase.from('banner').insert(updatedBanners)

    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`)
    }

    return { message: 'Banners replaced' }
  }

}
