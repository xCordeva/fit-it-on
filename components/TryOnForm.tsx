'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Sparkles, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTrials } from '@/hooks/useTrials'
import { SignInModal } from './SignInModal'
import { UpgradeModal } from './UpgradeModal'
import { toast } from 'sonner'

interface TryOnFormProps {
  onResult: (result: { inputUrl: string; garmentUrl: string; outputUrl: string }) => void
}

export function TryOnForm({ onResult }: TryOnFormProps) {
  const [personImage, setPersonImage] = useState<File | null>(null)
  const [garmentImage, setGarmentImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  const personInputRef = useRef<HTMLInputElement>(null)
  const garmentInputRef = useRef<HTMLInputElement>(null)
  
  const { user } = useAuth()
  const { canTryOn, decrementTrial, remainingTrials } = useTrials()

  const handleImageUpload = (file: File, type: 'person' | 'garment') => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }

    if (type === 'person') {
      setPersonImage(file)
    } else {
      setGarmentImage(file)
    }
  }

  const handleSubmit = async () => {
    if (!personImage || !garmentImage) {
      toast.error('Please upload both images')
      return
    }

    if (!canTryOn) {
      if (!user) {
        setShowSignInModal(true)
        return
      } else {
        setShowUpgradeModal(true)
        return
      }
    }

    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('personImage', personImage)
      formData.append('garmentImage', garmentImage)

      const response = await fetch('/api/tryon', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process try-on')
      }

      const result = await response.json()
      
      // Decrement trial for authenticated users
      if (user) {
        await decrementTrial()
      } else {
        // Mark anonymous trial as used
        localStorage.setItem('hasTriedFree', 'true')
      }

      onResult(result)
      toast.success('Try-on completed successfully!')
      
    } catch (error) {
      console.error('Try-on error:', error)
      toast.error('Failed to process try-on. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Upload Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Person Image Upload */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-4">
                  {personImage ? (
                    <img
                      src={URL.createObjectURL(personImage)}
                      alt="Person"
                      className="w-full h-48 object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Your Photo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Clear photo of yourself (front-facing works best)
                </p>
                <Button
                  variant="outline"
                  onClick={() => personInputRef.current?.click()}
                  className="w-full"
                >
                  {personImage ? 'Change Photo' : 'Choose Photo'}
                </Button>
                <input
                  ref={personInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'person')
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Garment Image Upload */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-4">
                  {garmentImage ? (
                    <img
                      src={URL.createObjectURL(garmentImage)}
                      alt="Garment"
                      className="w-full h-48 object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Garment</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Clothing item you want to try on
                </p>
                <Button
                  variant="outline"
                  onClick={() => garmentInputRef.current?.click()}
                  className="w-full"
                >
                  {garmentImage ? 'Change Garment' : 'Choose Garment'}
                </Button>
                <input
                  ref={garmentInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'garment')
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Try-On Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!personImage || !garmentImage || loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Try It On
              </>
            )}
          </Button>
          
          {!user && (
            <p className="text-sm text-gray-600 mt-2">
              First try is free! Sign up for 4 more tries.
            </p>
          )}
          
          {user && remainingTrials !== Infinity && (
            <p className="text-sm text-gray-600 mt-2">
              {remainingTrials} tries remaining
            </p>
          )}
        </div>
      </div>

      <SignInModal 
        open={showSignInModal} 
        onOpenChange={setShowSignInModal}
      />
      
      <UpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal}
      />
    </>
  )
}