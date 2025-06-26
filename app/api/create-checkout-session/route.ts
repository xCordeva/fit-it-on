import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/payments'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json()
    
    // Get current user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Replace with your payment provider's checkout session creation
    const { url, error } = await createCheckoutSession(priceId, user.id)
    
    if (error) {
      throw new Error(error)
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}