'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import type { AdminGalleryImage } from '@/lib/gallery'
import ImageCard from './ImageCard'
import loginStyles from '../../responses/page.module.css'
import styles from './page.module.css'

type UploadStatus = { name: string; state: 'resizing' | 'uploading' | 'done' | 'error'; message?: string }

// Shrink in the browser first so uploads stay under Vercel's 4.5 MB request body limit
async function resizeForUpload(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, 2560 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not encode image'))), 'image/jpeg', 0.9),
  )
}

export default function AdminGalleryPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [images, setImages] = useState<AdminGalleryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploads, setUploads] = useState<UploadStatus[]>([])

  const api = (path: string, init: RequestInit = {}) =>
    fetch(`/api/admin/gallery${path}`, {
      ...init,
      headers: { ...init.headers, 'x-admin-password': password },
    })

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api('')
      if (res.status === 401) return setError('Incorrect password.')
      if (!res.ok) return setError('Failed to load images. Try again.')
      setImages(await res.json())
      setAuthenticated(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const setUpload = (i: number, patch: Partial<UploadStatus>) =>
    setUploads(prev => prev.map((u, j) => (j === i ? { ...u, ...patch } : u)))

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return
    setUploads(files.map(f => ({ name: f.name, state: 'resizing' })))

    // Sequential so a batch of large photos doesn't saturate the connection
    for (const [i, file] of files.entries()) {
      try {
        const blob = await resizeForUpload(file)
        setUpload(i, { state: 'uploading' })
        const form = new FormData()
        form.append('file', blob, file.name.replace(/\.[^.]+$/, '') + '.jpg')
        form.append('alt', '')
        form.append('label', file.name.replace(/\.[^.]+$/, ''))
        const res = await api('', { method: 'POST', body: form })
        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: 'Upload failed' }))
          setUpload(i, { state: 'error', message: error })
          continue
        }
        const image: AdminGalleryImage = await res.json()
        setImages(prev => [...prev, image])
        setUpload(i, { state: 'done' })
      } catch {
        setUpload(i, { state: 'error', message: 'Could not read this file' })
      }
    }
  }

  const handleSave = async (id: number, alt: string, label: string) => {
    const res = await api(`/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alt, label }),
    })
    if (res.ok) setImages(prev => prev.map(img => (img.id === id ? { ...img, alt, label } : img)))
    return res.ok
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this photo from the gallery? This cannot be undone.')) return
    const res = await api(`/${id}`, { method: 'DELETE' })
    if (res.ok) setImages(prev => prev.filter(img => img.id !== id))
    else setError('Failed to delete image.')
  }

  const handleMove = async (index: number, delta: -1 | 1) => {
    const target = index + delta
    if (target < 0 || target >= images.length) return
    const previous = images
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    setImages(next)
    const res = await api('/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: next.map(img => img.id) }),
    })
    if (!res.ok) {
      setImages(previous)
      setError('Failed to save new order.')
    }
  }

  if (!authenticated) {
    return (
      <main className={loginStyles.loginWrap}>
        <form className={loginStyles.loginCard} onSubmit={handleLogin}>
          <h1 className={loginStyles.loginTitle}>Gallery</h1>
          <p className={loginStyles.loginSub}>Enter the admin password to manage gallery photos.</p>
          <input
            className={loginStyles.passwordInput}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
          />
          {error && <p className={loginStyles.errorMsg}>{error}</p>}
          <button className={loginStyles.loginBtn} type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Manage Gallery →'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gallery</h1>
        <span className={styles.count}>{images.length} photo{images.length !== 1 ? 's' : ''}</span>
        <label className={styles.uploadBtn}>
          Upload photos
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handleFiles} />
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {uploads.length > 0 && (
        <ul className={styles.uploads}>
          {uploads.map((u, i) => (
            <li key={i} data-state={u.state}>
              {u.name} — {u.state === 'error' ? u.message : u.state}
            </li>
          ))}
        </ul>
      )}

      {images.length === 0 ? (
        <p className={styles.empty}>No photos yet. Upload some to get started.</p>
      ) : (
        <div className={styles.grid}>
          {images.map((img, i) => (
            <ImageCard
              key={img.id}
              image={img}
              isFirst={i === 0}
              isLast={i === images.length - 1}
              onSave={handleSave}
              onDelete={handleDelete}
              onMove={delta => handleMove(i, delta)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
