import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../supabase.client'
import { ProductDto } from './dto/product.dto'

@Injectable()
export class ProductsService {
  async createProductWithImages(
    body: ProductDto,
    files: Express.Multer.File[],
  ) {
    const supabase = getSupabaseClient()
    const imageUrls: string[] = []

    for (const file of files) {
      const fileName = file.originalname

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

    const { data: productData, error: dbError } = await supabase
      .from('products')
      .insert([
        {
          name: body.name,
          category: body.category,
          price: Number(body.price),
          discount: Number(body.discount),
          size: body.size,
          color: body.color,
          colorHex: body.colorHex,
          stock: body.stock,
          description: body.description,
          material: body.material,
          measurement: body.measurement,
          imagesCount: body.imagesCount,
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
  ) {
    const supabase = getSupabaseClient()

    const existingImagesUrls: string[] = body.existingImages
    const originalOrderCount: string[] = body.originalOrderCount.split('/')
    const newOrderCount: string[] = body.newOrderCount.split('/')
    const newImageUrls: string[] = []
    let imageUrls: string[] = []

    if (files.length > 0) {
      for (const file of files) {
        const fileName = file.originalname

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

        newImageUrls.push(data.publicUrl)
      }
    }
    imageUrls = insertInOrder(existingImagesUrls, newImageUrls, originalOrderCount, newOrderCount)

    const updateData: {
      name: string
      category: string
      price: number
      discount: number,
      size: string
      color: string
      colorHex: string
      stock: string
      description: string
      material: string
      measurement: string,
      imagesCount: string
      images: string[]
    } = {
      name: body.name,
      category: body.category,
      price: Number(body.price),
      discount: Number(body.discount),
      size: body.size,
      color: body.color,
      colorHex: body.colorHex,
      stock: body.stock,
      description: body.description,
      material: body.material,
      measurement: body.measurement,
      imagesCount: body.imagesCount,
      images: imageUrls,
    }

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

function insertInOrder<T>(
  originalArray: T[],
  newArray: T[],
  originalCount: (string | number)[],
  newCount: (string | number)[]
): T[] {
  if (!Array.isArray(originalArray)) originalArray = [originalArray]
  const result: T[] = []
  let originalIndex = 0
  let newIndex = 0

  const arrayLenth = Math.max(originalCount.length, newCount.length)

  for (let i = 0; i < arrayLenth; i++) {
    const count = Number(originalCount[i] ?? 0)
    const insertCount = Number(newCount[i] ?? 0)

    result.push(...originalArray.slice(originalIndex, originalIndex + count))
    originalIndex += count

    result.push(...newArray.slice(newIndex, newIndex + insertCount))
    newIndex += insertCount
  }

  result.push(...originalArray.slice(originalIndex))
  result.push(...newArray.slice(newIndex))

  return result
}
