'use client'

import React, { useRef, useEffect, forwardRef, ForwardedRef } from 'react'

interface DrawingCanvasProps {}

const DrawingCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasProps>(
  (props, ref: ForwardedRef<HTMLCanvasElement>) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const isDrawing = useRef(false)

    const clearCanvas = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      context.fillStyle = 'white'
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d')
      if (!context) return

      // Set canvas size
      const setCanvasSize = () => {
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
        context.scale(window.devicePixelRatio, window.devicePixelRatio)
        clearCanvas(context, canvas)
      }

      setCanvasSize()
      window.addEventListener('resize', setCanvasSize)

      // Clear canvas initially
      clearCanvas(context, canvas)

      // Set drawing styles
      context.strokeStyle = 'black'
      context.lineWidth = 2
      context.lineCap = 'round'
      context.lineJoin = 'round'

      const getCoordinates = (event: MouseEvent | TouchEvent): [number, number] | null => {
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        if (event instanceof MouseEvent) {
          return [
            (event.clientX - rect.left) * scaleX,
            (event.clientY - rect.top) * scaleY
          ]
        } else if (event instanceof TouchEvent) {
          return [
            (event.touches[0].clientX - rect.left) * scaleX,
            (event.touches[0].clientY - rect.top) * scaleY
          ]
        }
        return null
      }

      const startDrawing = (e: MouseEvent | TouchEvent) => {
        isDrawing.current = true
        const coords = getCoordinates(e)
        if (coords) {
          context.beginPath()
          context.moveTo(coords[0], coords[1])
        }
      }

      const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing.current) return

        const coords = getCoordinates(e)
        if (coords) {
          context.lineTo(coords[0], coords[1])
          context.stroke()
        }
      }

      const stopDrawing = () => {
        isDrawing.current = false
      }

      canvas.addEventListener('mousedown', startDrawing)
      canvas.addEventListener('mousemove', draw)
      canvas.addEventListener('mouseup', stopDrawing)
      canvas.addEventListener('mouseout', stopDrawing)
      canvas.addEventListener('touchstart', startDrawing)
      canvas.addEventListener('touchmove', draw)
      canvas.addEventListener('touchend', stopDrawing)

      return () => {
        window.removeEventListener('resize', setCanvasSize)
        canvas.removeEventListener('mousedown', startDrawing)
        canvas.removeEventListener('mousemove', draw)
        canvas.removeEventListener('mouseup', stopDrawing)
        canvas.removeEventListener('mouseout', stopDrawing)
        canvas.removeEventListener('touchstart', startDrawing)
        canvas.removeEventListener('touchmove', draw)
        canvas.removeEventListener('touchend', stopDrawing)
      }
    }, [])

    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(canvasRef.current)
        } else {
          ref.current = canvasRef.current
        }
      }
    }, [ref])

    return (
      <canvas 
        ref={canvasRef} 
        className="w-full h-64 border border-gray-300 rounded-lg touch-none"
        aria-label="Drawing canvas"
      />
    )
  }
)

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas

