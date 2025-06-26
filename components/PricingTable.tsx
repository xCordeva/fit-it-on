'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Crown, Sparkles } from 'lucide-react'
import { PLANS } from '@/lib/payments'
import { toast } from 'sonner'

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out the platform',
    features: [
      '1 anonymous try',
      '4 tries after signup',
      'Basic quality results',
      'Standard processing',
      'Community support'
    ],
    buttonText: 'Get Started Free',
    popular: false,
  },
  {
    name: PLANS.pro.name,
    price: PLANS.pro.price,
    description: 'For fashion enthusiasts and professionals',
    features: PLANS.pro.features,
    buttonText: 'Upgrade to Pro',
    popular: true,
  }
]

export function PricingTable() {
  const handleGetStarted = async (planName: string) => {
    if (planName === 'Free') {
      // Scroll to try-on section or redirect to signup
      window.location.href = '/signup'
    } else {
      // TODO: Replace with your payment provider's checkout flow
      toast.info('Payment integration coming soon! We\'ll notify you when it\'s ready.')
      
      // Placeholder for payment provider integration
      // Example implementations:
      
      // For Stripe:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId: PLANS.pro.priceId }),
      // })
      // const { url } = await response.json()
      // window.location.href = url
      
      // For PayPal:
      // window.paypal.Buttons({
      //   createOrder: (data, actions) => {
      //     return actions.order.create({
      //       purchase_units: [{ amount: { value: PLANS.pro.price } }]
      //     })
      //   }
      // }).render('#paypal-button-container')
      
      // For other providers, implement accordingly
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative ${
            plan.popular 
              ? 'border-purple-500 shadow-lg scale-105' 
              : 'border-gray-200'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>
          )}
          
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {plan.name === 'Free' ? (
                <Sparkles className="h-5 w-5 text-purple-600" />
              ) : (
                <Crown className="h-5 w-5 text-yellow-500" />
              )}
              {plan.name}
            </CardTitle>
            <div className="text-3xl font-bold">
              ${plan.price}
              {plan.price > 0 && <span className="text-lg font-normal text-gray-600">/month</span>}
            </div>
            <p className="text-gray-600">{plan.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              onClick={() => handleGetStarted(plan.name)}
              className={
                plan.popular
                  ? 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'w-full'
              }
              variant={plan.popular ? 'default' : 'outline'}
            >
              {plan.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}