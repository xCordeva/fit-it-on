import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceRoleClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const personImage = formData.get('personImage') as File
    const garmentImage = formData.get('garmentImage') as File

    if (!personImage || !garmentImage) {
      return NextResponse.json({ error: 'Missing images' }, { status: 400 })
    }

    // Get current user (if authenticated)
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id || null
    }

    // Upload images to Supabase Storage
    const timestamp = Date.now()
    
    // Upload person image
    const personBuffer = await personImage.arrayBuffer()
    const personUpload = await supabase.storage
      .from('outputs')
      .upload(`inputs/person_${timestamp}.jpg`, personBuffer, {
        contentType: personImage.type,
      })

    if (personUpload.error) {
      throw new Error('Failed to upload person image')
    }

    // Upload garment image
    const garmentBuffer = await garmentImage.arrayBuffer()
    const garmentUpload = await supabase.storage
      .from('outputs')
      .upload(`inputs/garment_${timestamp}.jpg`, garmentBuffer, {
        contentType: garmentImage.type,
      })

    if (garmentUpload.error) {
      throw new Error('Failed to upload garment image')
    }

    // Get public URLs
    const { data: personUrl } = supabase.storage
      .from('outputs')
      .getPublicUrl(personUpload.data.path)
      
    const { data: garmentUrl } = supabase.storage
      .from('outputs')
      .getPublicUrl(garmentUpload.data.path)

    // Simulate AI processing (replace with actual Replicate API call)
    // For demo purposes, we'll use a placeholder result
    // In production, you would call the Replicate API here
    const mockProcessing = new Promise(resolve => setTimeout(resolve, 3000))
    await mockProcessing

    // For demo, we'll use the person image as the output
    // In production, this would be the AI-generated result
    const outputUrl = personUrl.publicUrl

    // Save result to database
    if (userId) {
      const serviceClient = getServiceRoleClient()
      await serviceClient
        .from('fit_results')
        .insert({
          user_id: userId,
          input_url: personUrl.publicUrl,
          garment_url: garmentUrl.publicUrl,
          output_url: outputUrl,
        })
    } else {
      // Save anonymous trial
      const deviceHash = request.headers.get('x-forwarded-for') || 'anonymous'
      const serviceClient = getServiceRoleClient()
      await serviceClient
        .from('anon_trials')
        .insert({
          device_hash: deviceHash,
          image_url: outputUrl,
        })
    }

    return NextResponse.json({
      inputUrl: personUrl.publicUrl,
      garmentUrl: garmentUrl.publicUrl,
      outputUrl: outputUrl,
    })

  } catch (error) {
    console.error('Try-on API error:', error)
    return NextResponse.json(
      { error: 'Failed to process try-on' },
      { status: 500 }
    )
  }
}