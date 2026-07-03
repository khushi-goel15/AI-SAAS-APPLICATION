"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Image,
  Sparkles,
  Heart,
  Download,
  RefreshCw,
  X,
  Maximize2,
  Clock,
  Wand2,
  Loader2,
  HeartOff,
  ChevronRight,
} from "lucide-react"
import { cn, formatDate, generateId } from "@/lib/utils"
import { IMAGE_STYLES, ASPECT_RATIOS } from "@/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

const QUALITY_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "hd", label: "HD" },
  { value: "4k", label: "4K" },
]

const SUGGESTED_PROMPTS = [
  "A serene mountain lake at sunset with vibrant colors",
  "Cyberpunk cityscape with neon lights and flying cars",
  "A majestic dragon perched on a medieval castle",
  "An astronaut riding a horse on the surface of Mars",
  "Underwater coral reef with bioluminescent creatures",
  "A mystical forest with glowing ancient trees",
]

const GRADIENT_PALETTES = [
  "from-purple-600 via-pink-500 to-orange-400",
  "from-cyan-500 via-blue-500 to-indigo-600",
  "from-emerald-500 via-teal-500 to-cyan-400",
  "from-rose-500 via-pink-500 to-purple-600",
  "from-amber-500 via-orange-500 to-red-500",
  "from-sky-500 via-indigo-500 to-violet-600",
  "from-fuchsia-500 via-purple-500 to-violet-600",
  "from-lime-500 via-emerald-500 to-teal-500",
  "from-red-500 via-rose-500 to-pink-500",
  "from-blue-500 via-cyan-500 to-teal-400",
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-green-500 via-emerald-500 to-teal-500",
]

interface GeneratedImage {
  id: string
  prompt: string
  style: string
  aspectRatio: string
  quality: string
  gradient: string
  favorite: boolean
  createdAt: Date
}

const ASPECT_RATIO_CLASSES: Record<string, string> = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "4:3": "aspect-[4/3]",
  "3:4": "aspect-[3/4]",
}

function ImageSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="animate-shimmer bg-gradient-to-r from-surface-secondary via-surface-tertiary to-surface-secondary bg-[length:200%_100%] aspect-square rounded-t-xl" />
      <div className="p-3 space-y-2">
        <div className="animate-shimmer bg-gradient-to-r from-surface-secondary via-surface-tertiary to-surface-secondary bg-[length:200%_100%] h-3 w-3/4 rounded" />
        <div className="animate-shimmer bg-gradient-to-r from-surface-secondary via-surface-tertiary to-surface-secondary bg-[length:200%_100%] h-3 w-1/2 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="animate-shimmer bg-gradient-to-r from-surface-secondary via-surface-tertiary to-surface-secondary bg-[length:200%_100%] h-8 w-8 rounded-lg" />
          <div className="animate-shimmer bg-gradient-to-r from-surface-secondary via-surface-tertiary to-surface-secondary bg-[length:200%_100%] h-8 w-8 rounded-lg" />
          <div className="animate-shimmer bg-gradient-to-r from-surface-secondary via-surface-tertiary to-surface-secondary bg-[length:200%_100%] h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20 mb-6"
      >
        <Wand2 className="h-10 w-10 text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl font-bold text-text-primary mb-2"
      >
        Bring your imagination to life
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-text-secondary text-center max-w-lg mb-8"
      >
        Describe what you want to see and AI will generate stunning visuals in seconds
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl"
      >
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <motion.button
            key={prompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPrompt(prompt)}
            className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-surface-secondary hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-rose-500/30 transition-colors">
              <Sparkles className="h-4 w-4 text-pink-500" />
            </div>
            <span className="text-sm font-medium text-text-primary leading-snug">{prompt}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}

function ImageCard({
  image,
  index,
  onToggleFavorite,
  onDownload,
  onRegenerate,
  onPreview,
}: {
  image: GeneratedImage
  index: number
  onToggleFavorite: (id: string) => void
  onDownload: (image: GeneratedImage) => void
  onRegenerate: (id: string) => void
  onPreview: (image: GeneratedImage) => void
}) {
  const styleLabel = IMAGE_STYLES.find((s) => s.value === image.style)?.label || image.style
  const aspectLabel = ASPECT_RATIOS.find((a) => a.value === image.aspectRatio)?.label || image.aspectRatio
  const ratioClass = ASPECT_RATIO_CLASSES[image.aspectRatio] || "aspect-square"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group relative rounded-xl border border-border bg-surface overflow-hidden"
    >
      <div
        className={cn("relative overflow-hidden cursor-pointer", ratioClass)}
        onClick={() => onPreview(image)}
      >
        <div
          className={cn(
            "w-full h-full bg-gradient-to-br transition-transform duration-500 group-hover:scale-110",
            image.gradient
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <p className="text-white text-sm font-medium text-center leading-relaxed line-clamp-4 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg">
            {image.prompt}
          </p>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(image.id) }}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              image.favorite
                ? "bg-rose-500/90 text-white shadow-lg"
                : "bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
            )}
            aria-label={image.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {image.favorite ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
          </button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-3">
            <Maximize2 className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-1">{image.prompt}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" size="sm">
            {styleLabel}
          </Badge>
          <Badge variant="secondary" size="sm">
            {aspectLabel}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-tertiary flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(new Date(image.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDownload(image)}
              className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-all"
              aria-label="Download image"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onRegenerate(image.id)}
              className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-all"
              aria-label="Regenerate image"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PreviewModal({
  image,
  open,
  onOpenChange,
}: {
  image: GeneratedImage | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!image) return null

  const styleLabel = IMAGE_STYLES.find((s) => s.value === image.style)?.label || image.style
  const aspectLabel = ASPECT_RATIOS.find((a) => a.value === image.aspectRatio)?.label || image.aspectRatio
  const qualityLabel = QUALITY_OPTIONS.find((q) => q.value === image.quality)?.label || image.quality
  const ratioClass = ASPECT_RATIO_CLASSES[image.aspectRatio] || "aspect-square"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="fullscreen" className="p-0 gap-0 overflow-hidden max-w-[90vw] max-h-[85vh]">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="flex-1 flex items-center justify-center bg-black/40 p-4 lg:p-8 min-h-[300px]">
            <div
              className={cn(
                "w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl",
                ratioClass
              )}
            >
              <div className={cn("w-full h-full bg-gradient-to-br", image.gradient)} />
            </div>
          </div>

          <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border bg-surface p-6 flex flex-col gap-6 overflow-y-auto">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">Prompt</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{image.prompt}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-tertiary mb-1">Style</p>
                <Badge variant="secondary">{styleLabel}</Badge>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Aspect Ratio</p>
                <Badge variant="secondary">{aspectLabel}</Badge>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Quality</p>
                <Badge variant="secondary">{qualityLabel}</Badge>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Date</p>
                <Badge variant="secondary">{formatDate(new Date(image.createdAt))}</Badge>
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <Button variant="primary" className="flex-1 gap-2" onClick={() => {
                const a = document.createElement("a")
                a.download = `ai-image-${image.id}.png`
                a.click()
              }}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ControlPanel({
  prompt,
  onPromptChange,
  style,
  onStyleChange,
  aspectRatio,
  onAspectRatioChange,
  quality,
  onQualityChange,
  numImages,
  onNumImagesChange,
  onGenerate,
  isGenerating,
}: {
  prompt: string
  onPromptChange: (v: string) => void
  style: string
  onStyleChange: (v: string) => void
  aspectRatio: string
  onAspectRatioChange: (v: string) => void
  quality: string
  onQualityChange: (v: string) => void
  numImages: number
  onNumImagesChange: (v: number) => void
  onGenerate: () => void
  isGenerating: boolean
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Prompt</Label>
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the image you want to generate..."
          rows={3}
          className="mt-1.5"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Style</Label>
          <Select value={style} onValueChange={onStyleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_STYLES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Aspect Ratio</Label>
          <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select ratio" />
            </SelectTrigger>
            <SelectContent>
              {ASPECT_RATIOS.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Quality</Label>
          <Select value={quality} onValueChange={onQualityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              {QUALITY_OPTIONS.map((q) => (
                <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Number of Images</Label>
          <Select value={String(numImages)} onValueChange={(v) => onNumImagesChange(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "Image" : "Images"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full gap-2"
        disabled={!prompt.trim() || isGenerating}
        loading={isGenerating}
        onClick={onGenerate}
      >
        {!isGenerating && <Sparkles className="h-5 w-5" />}
        {isGenerating ? "Generating..." : "Generate"}
      </Button>
    </div>
  )
}

export default function ImageGeneratorPage() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [quality, setQuality] = useState("standard")
  const [numImages, setNumImages] = useState(1)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const filteredImages = useMemo(() => {
    if (!favoritesOnly) return images
    return images.filter((img) => img.favorite)
  }, [images, favoritesOnly])

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)

    setTimeout(() => {
      const newImages: GeneratedImage[] = Array.from({ length: numImages }).map(() => ({
        id: generateId(),
        prompt: prompt.trim(),
        style,
        aspectRatio,
        quality,
        gradient: GRADIENT_PALETTES[Math.floor(Math.random() * GRADIENT_PALETTES.length)],
        favorite: false,
        createdAt: new Date(),
      }))

      setImages((prev) => [...newImages, ...prev])
      setIsGenerating(false)
    }, 2000 + Math.random() * 1000)
  }, [prompt, style, aspectRatio, quality, numImages, isGenerating])

  const handleToggleFavorite = useCallback((id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, favorite: !img.favorite } : img
      )
    )
  }, [])

  const handleDownload = useCallback((image: GeneratedImage) => {
    const a = document.createElement("a")
    a.download = `ai-image-${image.id}.png`
    a.click()
  }, [])

  const handleRegenerate = useCallback((id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? {
              ...img,
              gradient: GRADIENT_PALETTES[Math.floor(Math.random() * GRADIENT_PALETTES.length)],
              createdAt: new Date(),
            }
          : img
      )
    )
  }, [])

  const handlePreview = useCallback((image: GeneratedImage) => {
    setPreviewImage(image)
    setPreviewOpen(true)
  }, [])

  const handleSelectPrompt = useCallback((p: string) => {
    setPrompt(p)
  }, [])

  const hasFavorites = images.some((img) => img.favorite)

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Image className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              AI Image Generator
            </h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-text-secondary ml-[52px]"
          >
            Transform your ideas into stunning visuals with the power of AI
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full lg:w-80 xl:w-96 shrink-0"
          >
            <div className="sticky top-24 rounded-xl border border-border bg-surface p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Wand2 className="h-5 w-5 text-pink-500" />
                <h2 className="text-base font-semibold text-text-primary">Generation Settings</h2>
              </div>

              <ControlPanel
                prompt={prompt}
                onPromptChange={setPrompt}
                style={style}
                onStyleChange={setStyle}
                aspectRatio={aspectRatio}
                onAspectRatioChange={setAspectRatio}
                quality={quality}
                onQualityChange={setQuality}
                numImages={numImages}
                onNumImagesChange={setNumImages}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  {favoritesOnly ? "Favorites" : "Gallery"}
                </h2>
                <p className="text-sm text-text-secondary">
                  {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
                </p>
              </div>

              {images.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFavoritesOnly(false)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      !favoritesOnly
                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                        : "bg-surface-secondary text-text-secondary hover:text-text-primary"
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFavoritesOnly(true)}
                    disabled={!hasFavorites}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                      favoritesOnly
                        ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
                        : "bg-surface-secondary text-text-secondary hover:text-text-primary",
                      !hasFavorites && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    Favorites
                  </button>
                </div>
              )}
            </motion.div>

            {images.length === 0 && !isGenerating ? (
              <EmptyState onSelectPrompt={handleSelectPrompt} />
            ) : (
              <>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-3"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">Generating your images...</p>
                      <p className="text-xs text-text-secondary">This may take a few seconds</p>
                    </div>
                  </motion.div>
                )}

                <AnimatePresence mode="popLayout">
                  {isGenerating && images.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div
                          key={`skeleton-${i}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                        >
                          <ImageSkeleton />
                        </motion.div>
                      ))}
                    </div>
                  ) : filteredImages.length === 0 && favoritesOnly ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-20"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
                        <HeartOff className="h-8 w-8 text-rose-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">No favorites yet</h3>
                      <p className="text-sm text-text-secondary text-center max-w-sm">
                        Click the heart icon on any image to add it to your favorites
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 gap-1.5"
                        onClick={() => setFavoritesOnly(false)}
                      >
                        <ChevronRight className="h-4 w-4" />
                        Show all images
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredImages.map((image, index) => (
                        <ImageCard
                          key={image.id}
                          image={image}
                          index={index}
                          onToggleFavorite={handleToggleFavorite}
                          onDownload={handleDownload}
                          onRegenerate={handleRegenerate}
                          onPreview={handlePreview}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>

      <PreviewModal
        image={previewImage}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  )
}
