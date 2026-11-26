'use client'

import React, { useState } from 'react'

// Film de présentation : rien n'est chargé avant le clic (ni vidéo, ni lecteur YouTube, ni cookie).
// YouTube passe par youtube-nocookie.com ; un fichier .mp4 est lu par le lecteur du navigateur.
function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m?.[1] ?? null
}

export function VideoPlayer({ url, poster, title, playLabel }: { url: string; poster?: string | null; title: string; playLabel: string }) {
  const [playing, setPlaying] = useState(false)
  const yt = youtubeId(url)

  if (playing) {
    return yt ? (
      <iframe
        className="video__frame"
        src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&cc_load_policy=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    ) : (
      // eslint-disable-next-line jsx-a11y/media-has-caption -- sous-titres incrustés ou fournis avec le fichier
      <video className="video__frame" src={url} poster={poster ?? undefined} controls autoPlay playsInline />
    )
  }

  return (
    <button type="button" className="video__cover" onClick={() => setPlaying(true)} aria-label={`${playLabel} : ${title}`}>
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" loading="lazy" decoding="async" />
      )}
      <span className="video__play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="video__label">{playLabel}</span>
    </button>
  )
}
