'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Check, Crown, Loader2 } from 'lucide-react'
import { PLANS } from '@/lib/payments'
import { toast } from 'sonner'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    
    try {
      // TODO: Replace with your payment provider's checkout flow
      toast.info('Payment integration coming soon! We\'ll notify you when it\'s ready.')
      onOpenChange(false)
      
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
      
      // For other providers, implement accordingly
      
    } catch (error) {
      toast.error('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            You've used all your free tries! Upgrade to Pro for unlimited virtual try-ons.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pricing */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
              <div className="text-3xl font-bold">${PLANS.pro.price}</div>
              <div className="text-sm opacity-90">per month</div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-semibold">What you get:</h4>
            {PLANS.pro.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>

          <div className="text-center text-xs text-gray-600">
            <p>Payment integration coming soon!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}