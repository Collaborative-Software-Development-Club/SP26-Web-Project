"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type ImageItem = {
  id: string
  url: string
}

type ImageManagerProps = {
  images: ImageItem[]
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>
  onClose: () => void
}

export default function ImageManager({ images, setImages, onClose }: ImageManagerProps) {
  const [localImages, setLocalImages] = useState<ImageItem[]>(images)

  const handleAddField = () => {
    setLocalImages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), url: "" }, 
    ])
  }

  const handleChange = (id: string, value: string) => {
    setLocalImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, url: value } : img
      )
    )
  }

  const handleRemove = (id: string) => {
    setLocalImages((prev) =>
      prev.filter((img) => img.id !== id)
    )
  }

  const handleSave = () => {
    setImages(localImages.filter((img) => img.url.trim() !== ""))
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {localImages.map((img) => (
          <div key={img.id} className="flex gap-2">
            <input
              type="text"
              value={img.url}
              onChange={(e) =>
                handleChange(img.id, e.target.value)
              }
              placeholder="Enter image URL (e.g. /demo/image1.jpg)"
              className="flex-1 border rounded px-2 py-1"
            />
            <button
              onClick={() => handleRemove(img.id)}
              className="text-red-500 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddField} className="w-full">
        Add Another Image
      </Button>

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          Save
        </Button>
        <Button variant="secondary" onClick={handleCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}