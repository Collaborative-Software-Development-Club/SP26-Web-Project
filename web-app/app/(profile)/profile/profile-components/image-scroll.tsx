"use client"

import { useState } from "react"
import Image from "next/image"
import profiles from "mock/profiles.json"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import ImageManager from "./modals/image-manager";

type ImageItem = {
  id: string
  url: string
}

export default function ProfileImageScroll({ userId }: { userId: string }) {
  const user = profiles[0]

  const [images, setImages] = useState<ImageItem[]>(() =>
    user.lifestyle_images?.map((url: string, index: number) => ({
      id: `${user.user_id}-${index}`,
      url,
    })) ?? []
  )

  const [open, setOpen] = useState(false)

  return (
    <div>
      <ScrollArea className="max-w-300 rounded-md border whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4">

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="h-80 w-60 rounded-md bg-muted border-gray-300 hover:bg-neutral-200 border-2 border-dashed flex items-center justify-center transition">
                <Plus size={32} />
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Lifestyle Images</DialogTitle>
              </DialogHeader>

              <ImageManager
                images={images}
                setImages={setImages}
                onClose={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {images.map((img) => (
            <div key={img.id} className="h-80 w-60 relative">
              <Image
                src={img.url}
                alt="Lifestyle image"
                fill
                className="rounded-md object-cover"
              />
            </div>
          ))}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

