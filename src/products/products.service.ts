import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../supabase.client'
import { ProductDto } from './dto/product.dto'

@Injectable()
export class ProductsService {
  async createProductWithImages(
    body: ProductDto,
    files: Express.Multer.File[],
    mainImg: Express.Multer.File | null
  ) {
    const supabase = getSupabaseClient()
    const imageUrls: string[] = []

    for (const file of files) {
      const ext = file.originalname.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

      const { error } = await supabase.storage
        .from('product-img')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        })
      if (error) throw new Error(`Upload failed: ${error.message}`)

      const { data } = supabase.storage
        .from('product-img')
        .getPublicUrl(fileName)

      imageUrls.push(data.publicUrl)
    }

    let mainImageUrl: string | null = null
    if (mainImg) {
      const ext = mainImg.originalname.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

      const { error } = await supabase.storage
        .from('product-img')
        .upload(fileName, mainImg.buffer, {
          contentType: mainImg.mimetype,
          upsert: true,
        })

      if (error) throw new Error(`Main image upload failed: ${error.message}`)

      const { data } = supabase.storage
        .from('product-img')
        .getPublicUrl(fileName)

      mainImageUrl = data.publicUrl
    }

    const { data: productData, error: dbError } = await supabase
      .from('products')
      .insert([
        {
          name: body.name,
          price: Number(body.price),
          category: body.category,
          stock: Number(body.stock),
          description: body.description,
          size: body.size,
          color: body.color,
          mainImg: mainImageUrl,
          images: imageUrls,
        },
      ])
      .select()

    if (dbError) throw new Error(`DB insert failed: ${dbError.message}`)
    if (!productData || productData.length === 0) {
      throw new Error('Product creation succeeded but no data was returned.')
    }

    return { message: 'Product created', product: productData[0] }
  }

  async updateProduct(
    id: number,
    body: ProductDto,
    files: Express.Multer.File[],
    mainImg: Express.Multer.File | null
  ) {
    const supabase = getSupabaseClient()
    const imageUrls: string[] = []

    if (files.length > 0) {
      for (const file of files) {
        const ext = file.originalname.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

        const { error } = await supabase.storage
          .from('product-img')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
          })
        if (error) throw new Error(`Upload failed: ${error.message}`)

        const { data } = supabase.storage
          .from('product-img')
          .getPublicUrl(fileName)

        imageUrls.push(data.publicUrl)
      }
    }

    const existingImages = Array.isArray(body.existingImages) ? body.existingImages : body.existingImages ? [body.existingImages] : []

    imageUrls.push(...existingImages)

    let mainImageUrl: string | null = null
    if (mainImg) {
      const ext = mainImg.originalname.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

      const { error } = await supabase.storage
        .from('product-img')
        .upload(fileName, mainImg.buffer, {
          contentType: mainImg.mimetype,
          upsert: true,
        })

      if (error) throw new Error(`Main image upload failed: ${error.message}`)

      const { data } = supabase.storage
        .from('product-img')
        .getPublicUrl(fileName)

      mainImageUrl = data.publicUrl
    } else {
      mainImageUrl = body.existingMainImg
    }

    const updateData: {
      name: string
      price: number
      stock: number
      category: string
      description: string
      size: string
      color: string
      mainImg: string
      images: string[]
    } = {
      name: body.name,
      price: Number(body.price),
      stock: Number(body.stock),
      category: body.category,
      description: body.description,
      size: body.size,
      color: body.color,
      mainImg: mainImageUrl,
      images: imageUrls,
    }

    console.log(updateData)

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw new Error(`DB update failed: ${error.message}`)
    if (!data || data.length === 0) throw new Error('No product found or nothing updated.')

    return { message: 'Product updated', product: data[0] }
  }

  async getAllProducts() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }

  async getProductById(id: string) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('products').select('*').eq('id', id).single()

    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    return data
  }

  async deleteProduct(id: number) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('products').delete().eq('id', id).select()

    if (error) throw new Error(`Delete failed: ${error.message}`)
    if (!data || data.length === 0) throw new Error('Product not found.')

    return { message: 'Product deleted', product: data[0] }
  }

}
