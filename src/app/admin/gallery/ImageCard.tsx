'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { AdminGalleryImage } from '@/lib/gallery'
import styles from './page.module.css'

type Props = {
  image: AdminGalleryImage
  isFirst: boolean
  isLast: boolean
  onSave: (id: number, alt: string, label: string) => Promise<boolean>
  onDelete: (id: number) => void
  onMove: (delta: -1 | 1) => void
}

export default function ImageCard({ image, isFirst, isLast, onSave, onDelete, onMove }: Props) {
  const [alt, setAlt] = useState(image.alt)
  const [label, setLabel] = useState(image.label)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const dirty = alt !== image.alt || label !== image.label

  const save = async () => {
    setStatus('saving')
    setStatus((await onSave(image.id, alt, label)) ? 'saved' : 'error')
  }

  return (
    <div className={styles.card}>
      <div className={styles.thumb}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={styles.thumbImg}
          unoptimized
        />
      </div>
      <label className={styles.field}>
        Label
        <input value={label} maxLength={200} onChange={e => { setLabel(e.target.value); setStatus('idle') }} />
      </label>
      <label className={styles.field}>
        Alt text
        <input value={alt} maxLength={200} onChange={e => { setAlt(e.target.value); setStatus('idle') }} />
      </label>
      <div className={styles.actions}>
        <button type="button" onClick={() => onMove(-1)} disabled={isFirst} aria-label="Move earlier">↑</button>
        <button type="button" onClick={() => onMove(1)} disabled={isLast} aria-label="Move later">↓</button>
        <button type="button" onClick={save} disabled={!dirty || status === 'saving'}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Save'}
        </button>
        <button type="button" className={styles.danger} onClick={() => onDelete(image.id)}>Delete</button>
      </div>
      {status === 'error' && <p className={styles.error}>Save failed.</p>}
    </div>
  )
}
