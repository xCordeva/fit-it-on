'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Share2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

interface TryOnResultProps {
  result: {
    inputUrl: string
    garmentUrl: string
    outputUrl: string
  }
  onReset: () => void
}

export function TryOnResult({ result, onReset }: TryOnResultProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)
      const response = await fetch(result.outputUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fititon-result-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Image downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download image')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my virtual try-on!',
          text: 'I tried on this outfit using FitItOn.io',
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled the share
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy link')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Result Display */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 gap-0">
            {/* Original Photo */}
            <div className="relative">
              <img
                src={result.inputUrl}
                alt="Original"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                Original
              </div>
            </div>

            {/* Garment */}
            <div className="relative">
              <img
                src={result.garmentUrl}
                alt="Garment"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                Garment
              </div>
            </div>

            {/* Result */}
            <div className="relative">
              <img
                src={result.outputUrl}
                alt="Try-on Result"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded text-sm">
                AI Result
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleDownload}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        
        <Button
          onClick={handleShare}
          variant="outline"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Another
        </Button>
      </div>

      {/* Quality Notice */}
      <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p>
          🎯 For best results, use clear, well-lit photos with good contrast. 
          Pro subscribers get enhanced processing and higher quality outputs.
        </p>
      </div>
    </div>
  )
}