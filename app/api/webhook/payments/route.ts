import { NextRequest, NextResponse } from 'next/server'
import { handlePaymentWebhook } from '@/lib/payments'
import { getServiceRoleClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('payment-signature') || ''

    // TODO: Replace with your payment provider's webhook handling
    const { success, event } = await handlePaymentWebhook(body, signature)
    
    if (!success) {
      return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
    }

    const supabase = getServiceRoleClient()

    // TODO: Handle different payment events based on your provider
    // Example events: subscription_created, subscription_canceled, payment_succeeded, etc.
    
    if (event?.type === 'subscription_created') {
      // Handle successful subscription creation
      const userId = event.data?.userId
      const subscriptionId = event.data?.subscriptionId
      
      if (userId && subscriptionId) {
        // Update user to pro plan
        await supabase
          .from('users')
          .update({ plan: 'pro' })
          .eq('id', userId)

        // Save payment record
        await supabase
          .from('payments')
          .insert({
            user_id: userId,
            payment_provider_id: subscriptionId,
            plan: 'pro',
            status: 'active',
          })
      }
    }

    if (event?.type === 'subscription_canceled') {
      // Handle subscription cancellation
      const subscriptionId = event.data?.subscriptionId
      
      if (subscriptionId) {
        // Find user by subscription ID and downgrade to free
        const { data: payment } = await supabase
          .from('payments')
          .select('user_id')
          .eq('payment_provider_id', subscriptionId)
          .single()

        if (payment) {
          await supabase
            .from('users')
            .update({ plan: 'free', trial_count: 0 })
            .eq('id', payment.user_id)

          await supabase
            .from('payments')
            .update({ status: 'canceled' })
            .eq('payment_provider_id', subscriptionId)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Payment webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}