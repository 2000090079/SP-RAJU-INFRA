import { useEffect, useRef, useState, useCallback } from "react"

/* ── Singleton script loader ──────────────────────────────────────────────
   The YT IFrame API script is loaded at most once per page, regardless of
   how many players are on the page.  Multiple callers each register a
   callback; once the API fires onYouTubeIframeAPIReady all callbacks run.
──────────────────────────────────────────────────────────────────────────── */
let ytScriptState = "idle" // "idle" | "loading" | "ready"
const pendingCallbacks = []

function onYTReady(cb) {
  if (ytScriptState === "ready" && window.YT?.Player) {
    cb()
    return
  }
  pendingCallbacks.push(cb)
  if (ytScriptState === "idle") {
    ytScriptState = "loading"
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      ytScriptState = "ready"
      if (prev) prev()
      pendingCallbacks.splice(0).forEach((fn) => fn())
    }
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    tag.async = true
    document.head.appendChild(tag)
  }
}

/* ── Hook ─────────────────────────────────────────────────────────────────
   Usage:
     const divRef = useRef(null)
     const { ready, muted, autoplayFailed, play, pause, toggleMute, forcePlay } =
       useYouTubePlayer(divRef, "KlqlMpw1BHo")

   The hook replaces the <div> that divRef points to with an <iframe>.
──────────────────────────────────────────────────────────────────────────── */
export function useYouTubePlayer(containerRef, videoId) {
  const playerRef = useRef(null)
  const autoplayTimerRef = useRef(null)

  const [ready, setReady] = useState(false)
  const [muted, setMuted] = useState(true)
  const [autoplayFailed, setAutoplayFailed] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !videoId) return

    let destroyed = false

    onYTReady(() => {
      if (destroyed || !containerRef.current) return

      const player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady() {
            if (destroyed) return
            playerRef.current = player
            setReady(true)
          },
          onStateChange(e) {
            const { PLAYING, BUFFERING } = window.YT.PlayerState
            if (e.data === PLAYING || e.data === BUFFERING) {
              clearTimeout(autoplayTimerRef.current)
              setAutoplayFailed(false)
            }
          },
        },
      })
    })

    return () => {
      destroyed = true
      clearTimeout(autoplayTimerRef.current)
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch (_) {}
        playerRef.current = null
      }
      setReady(false)
      setMuted(true)
      setAutoplayFailed(false)
    }
  }, [videoId]) // eslint-disable-line react-hooks/exhaustive-deps

  const play = useCallback(() => {
    if (!playerRef.current) return
    playerRef.current.playVideo()
    // If the video isn't PLAYING within 1.5 s, autoplay was blocked
    clearTimeout(autoplayTimerRef.current)
    autoplayTimerRef.current = setTimeout(() => {
      const state = playerRef.current?.getPlayerState?.()
      const { PLAYING, BUFFERING } = window.YT?.PlayerState ?? {}
      if (state !== PLAYING && state !== BUFFERING) {
        setAutoplayFailed(true)
      }
    }, 1500)
  }, [])

  const pause = useCallback(() => {
    clearTimeout(autoplayTimerRef.current)
    if (!playerRef.current) return
    playerRef.current.pauseVideo()
  }, [])

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return
    if (muted) {
      playerRef.current.unMute()
      setMuted(false)
    } else {
      playerRef.current.mute()
      setMuted(true)
    }
  }, [muted])

  const forcePlay = useCallback(() => {
    setAutoplayFailed(false)
    if (!playerRef.current) return
    playerRef.current.playVideo()
  }, [])

  return { ready, muted, autoplayFailed, play, pause, toggleMute, forcePlay }
}
