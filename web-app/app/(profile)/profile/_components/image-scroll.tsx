"use client"

import { useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type ImageItem = {
  id: string
  file?: File
  url: string
}

export default function ProfileImageScroll() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [open, setOpen] = useState(false)

  return (
    <div>
      <ScrollArea className="w-140 rounded-md border whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4">

          {/* Add Image Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="h-80 w-60 rounded-md bg-muted border-gray-300 hover:bg-neutral-200 border-2 border-dashed flex items-center justify-center transition">
                <Plus />
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Images</DialogTitle>
              </DialogHeader>

              <ImageManager
                images={images}
                setImages={setImages}
                onClose={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>

		  {images.map((img) => (
			  <img
              key={img.id}
              src={img.url}
              alt="Profile"
              className="h-80 w-60 rounded-md object-cover"
            />
          ))}
        </div>
		<ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )

  type ImageManagerProps = {
  images: ImageItem[]
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>
  onClose: () => void
}

function ImageManager({ images, setImages, onClose }: ImageManagerProps) {
  const [localImages, setLocalImages] = useState<ImageItem[]>(images)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const newFiles = Array.from(e.target.files)

    const newImages = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }))

    setLocalImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (id: string) => {
    setLocalImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleSave = () => {
    setImages(localImages)
    onClose()
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="flex gap-2 flex-wrap">
        {localImages.map((img) => (
          <div key={img.id} className="relative">
            <img
              src={img.url}
              className="h-24 w-24 rounded-md object-cover"
            />
            <button
              onClick={() => removeImage(img.id)}
              className="absolute top-1 right-1 bg-black text-white text-xs px-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full">
        Save
      </Button>
    </div>
  )
}
}