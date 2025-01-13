'use client'
import { Card, CardHeader, CardBody, CardFooter, Button } from '@nextui-org/react'
import React, { useRef, useState } from 'react'
import DrawingCanvas from '../components/DrawingCanvas'

function Draw() {
    const [isDownloading, setIsDownloading] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
    const handleDownload = () => {
      if (!canvasRef.current) return
  
      setIsDownloading(true)
      const canvas = canvasRef.current
      const imageData = canvas.toDataURL('image/png')
      
      const link = document.createElement('a')
      link.href = imageData
      link.download = 'drawing.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
  
      setIsDownloading(false)
    }
  
    const handleClear = () => {
      if (!canvasRef.current) return
  
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      if (!context) return
  
      context.fillStyle = 'white'
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
  
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="flex justify-center">
            <h1 className="text-2xl font-bold">Draw and Download</h1>
          </CardHeader>
          <CardBody>
            <DrawingCanvas ref={canvasRef} />
          </CardBody>
          <CardFooter className="flex justify-between">
            <Button color="danger" variant="flat" onPress={handleClear}>
              Clear
            </Button>
            <Button color="primary" isLoading={isDownloading} onPress={handleDownload}>
              {isDownloading ? 'Preparing Download...' : 'Download Drawing'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  

export default Draw
