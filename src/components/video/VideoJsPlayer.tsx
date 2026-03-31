'use client';

import React, { useEffect, useMemo, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "videojs-contrib-eme";
import "video.js/dist/video-js.css";
import "@/styles/videojs-lms.css";
import { ensureLmsVideoJsPlugins } from "@/lib/videojs/plugins";

// Extend Player type to include custom plugin methods
interface ExtendedPlayer extends Player {
  eme?: () => void;
  lmsAnalytics?: (config: any) => void;
  lmsAds?: (config: any) => void;
}

interface DrmKeySystem {
  [key: string]: any;
}

interface PlaybackDRM {
  enabled?: boolean;
  widevine?: {
    licenseUri?: string;
    headers?: Record<string, string>;
    audioContentType?: string;
    videoContentType?: string;
  };
  playready?: {
    licenseUri?: string;
    headers?: Record<string, string>;
    audioContentType?: string;
    videoContentType?: string;
  };
  fairplay?: {
    licenseUri?: string;
    certificateUri?: string;
    headers?: Record<string, string>;
    contentId?: string;
  };
}

interface PlaybackSource {
  src: string;
  type: string;
  keySystems?: DrmKeySystem;
}

interface PlaybackConfig {
  src: string;
  type: string;
  poster?: string;
  drm?: PlaybackDRM;
  plugins?: {
    analytics?: {
      provider?: string;
      [key: string]: any;
    };
    ads?: {
      enabled?: boolean;
      markers?: any[];
    };
  };
}

interface ProgressEvent {
  currentTime: number;
  duration: number;
  playbackRate: number;
}

interface PlayerInterface {
  currentTime: (value?: number) => number;
  play: () => Promise<void>;
}

interface VideoJsPlayerProps {
  playback: PlaybackConfig;
  onEnded?: () => void;
  onProgress?: (progress: ProgressEvent) => void;
  onAnalyticsEvent?: (event: any) => void;
  onPlayerReady?: (player: ExtendedPlayer | PlayerInterface) => void;
  restrictForwardSeek?: boolean;
  className?: string;
}

function buildKeySystems(drm?: PlaybackDRM): DrmKeySystem | undefined {
  if (!drm?.enabled) {
    return undefined;
  }

  const keySystems: DrmKeySystem = {};

  if (drm.widevine?.licenseUri) {
    keySystems["com.widevine.alpha"] = {
      url: drm.widevine.licenseUri,
      licenseHeaders: drm.widevine.headers || {},
      audioContentType: drm.widevine.audioContentType || undefined,
      videoContentType: drm.widevine.videoContentType || undefined,
    };
  }

  if (drm.playready?.licenseUri) {
    keySystems["com.microsoft.playready"] = {
      url: drm.playready.licenseUri,
      licenseHeaders: drm.playready.headers || {},
      audioContentType: drm.playready.audioContentType || undefined,
      videoContentType: drm.playready.videoContentType || undefined,
    };
  }

  if (drm.fairplay?.licenseUri && drm.fairplay?.certificateUri) {
    keySystems["com.apple.fps.1_0"] = {
      certificateUri: drm.fairplay.certificateUri,
      licenseUri: drm.fairplay.licenseUri,
      licenseHeaders: drm.fairplay.headers || {},
      contentId: drm.fairplay.contentId || undefined,
    };
  }

  return Object.keys(keySystems).length ? keySystems : undefined;
}

function buildSource(playback: PlaybackConfig): PlaybackSource {
  const source: PlaybackSource = {
    src: playback.src,
    type: playback.type,
  };

  const keySystems = buildKeySystems(playback.drm);
  if (keySystems) {
    source.keySystems = keySystems;
  }

  return source;
}

const VideoJsPlayerComponent: React.FC<VideoJsPlayerProps> = ({
  playback,
  onEnded,
  onProgress,
  onAnalyticsEvent,
  onPlayerReady,
  restrictForwardSeek = false,
  className = "",
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ExtendedPlayer | null>(null);
  const nativeRef = useRef<HTMLVideoElement>(null);
  const furthestTimeRef = useRef<number>(0);
  const seekGuardRef = useRef<boolean>(false);
  const nativePlayback = useMemo(() => {
    if (!playback?.src) return false;
    const hasDrm = Boolean(buildKeySystems(playback.drm));
    if (hasDrm) return false;
    return !["application/x-mpegURL", "application/dash+xml"].includes(playback.type);
  }, [playback]);

  useEffect(() => {
    if (nativePlayback) return undefined;
    ensureLmsVideoJsPlugins();

    if (!hostRef.current || playerRef.current) {
      return undefined;
    }

    const playerElement = document.createElement("video-js");
    playerElement.classList.add("vjs-big-play-centered", "vjs-fluid", "vjs-lms-player");
    hostRef.current.appendChild(playerElement);

    const player = (playerRef.current = videojs(playerElement, {
      autoplay: true,
      controls: true,
      preload: "auto",
      responsive: true,
      fluid: true,
      userActions: {
        hotkeys: true,
      },
      playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
      controlBar: {
        pictureInPictureToggle: true,
        remainingTimeDisplay: true,
        playbackRateMenuButton: true,
        volumePanel: {
          inline: false,
        },
      },
      html5: {
        vhs: {
          overrideNative: true,
          smoothQualityChange: true,
          enableLowInitialPlaylist: true,
        },
      },
    }));

    if (typeof onPlayerReady === "function") {
      player.ready(() => onPlayerReady(player));
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [nativePlayback, onPlayerReady]);

  useEffect(() => {
    if (nativePlayback) return undefined;
    const player = playerRef.current;
    if (!player || !playback?.src) {
      return undefined;
    }

    const source = buildSource(playback);
    if (source.keySystems && typeof player.eme === "function") {
      player.eme();
    }

    player.poster(playback.poster || "");
    player.src(source);
    furthestTimeRef.current = 0;
    if (typeof player.lmsAnalytics === "function") {
      player.lmsAnalytics({
        provider: playback.plugins?.analytics?.provider || "internal",
        meta: playback.plugins?.analytics || {},
        onEvent: onAnalyticsEvent,
      });
    }
    if (typeof player.lmsAds === "function") {
      player.lmsAds(playback.plugins?.ads || { enabled: false, markers: [] });
    }

    player.ready(() => {
      const playPromise = player!.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    });

    return undefined;
  }, [nativePlayback, playback, onAnalyticsEvent]);

  useEffect(() => {
    if (nativePlayback) return undefined;
    const player = playerRef.current;
    if (!player || typeof onEnded !== "function") {
      return undefined;
    }

    player.on("ended", onEnded);
    return () => player.off("ended", onEnded);
  }, [nativePlayback, onEnded]);

  useEffect(() => {
    if (nativePlayback) return undefined;
    const player = playerRef.current;
    if (!player || typeof onProgress !== "function") {
      return undefined;
    }

    const emitProgress = (): void => {
      const currentTime = player.currentTime() ?? 0;
      const duration = player.duration() ?? 0;
      const playbackRate = typeof player.playbackRate === "function" ? (player.playbackRate() ?? 1) : (player.playbackRate as unknown as number) ?? 1;
      onProgress?.({
        currentTime: Number.isFinite(currentTime) ? currentTime : 0,
        duration: Number.isFinite(duration) ? duration : 0,
        playbackRate: Number.isFinite(playbackRate) ? playbackRate : 1,
      });
    };

    player.on("loadedmetadata", emitProgress);
    player.on("timeupdate", emitProgress);
    player.on("ratechange", emitProgress);

    return () => {
      player.off("loadedmetadata", emitProgress);
      player.off("timeupdate", emitProgress);
      player.off("ratechange", emitProgress);
    };
  }, [nativePlayback, onProgress]);

  useEffect(() => {
    const videoElement = nativePlayback ? nativeRef.current : playerRef.current;
    if (!videoElement || !restrictForwardSeek) {
      return undefined;
    }

    const handleTimeUpdate = (): void => {
      if (seekGuardRef.current) return;
      const currentTime = typeof (videoElement as any).currentTime === "function"
        ? ((videoElement as any).currentTime() ?? 0)
        : (((videoElement as any).currentTime as unknown as number) ?? 0);
      furthestTimeRef.current = Math.max(furthestTimeRef.current, currentTime || 0);
    };

    const handleSeeking = (): void => {
      if (seekGuardRef.current) return;

      const currentTime = typeof (videoElement as any).currentTime === "function"
        ? ((videoElement as any).currentTime() ?? 0)
        : (((videoElement as any).currentTime as unknown as number) ?? 0);
      const allowedTime = furthestTimeRef.current + 1.5;

      const ended = typeof (videoElement as any).ended === "function"
        ? (videoElement as any).ended()
        : ((videoElement as any).ended as unknown as boolean);

      if (currentTime > allowedTime && !ended) {
        seekGuardRef.current = true;
        if (typeof (videoElement as any).currentTime === "function") {
          (videoElement as any).currentTime(Math.max(0, furthestTimeRef.current));
        } else {
          ((videoElement as any).currentTime as unknown) = Math.max(0, furthestTimeRef.current);
        }
        setTimeout(() => {
          seekGuardRef.current = false;
        }, 0);
      }
    };

    if (typeof (videoElement as any).on === "function") {
      (videoElement as any).on("timeupdate", handleTimeUpdate);
      (videoElement as any).on("seeking", handleSeeking);
    } else {
      (videoElement as unknown as HTMLVideoElement).addEventListener("timeupdate", handleTimeUpdate as EventListener);
      (videoElement as unknown as HTMLVideoElement).addEventListener("seeking", handleSeeking as EventListener);
    }

    return () => {
      if (typeof (videoElement as any).off === "function") {
        (videoElement as any).off("timeupdate", handleTimeUpdate);
        (videoElement as any).off("seeking", handleSeeking);
      } else {
        (videoElement as unknown as HTMLVideoElement).removeEventListener("timeupdate", handleTimeUpdate as EventListener);
        (videoElement as unknown as HTMLVideoElement).removeEventListener("seeking", handleSeeking as EventListener);
      }
    };
  }, [nativePlayback, restrictForwardSeek]);

  useEffect(() => {
    if (!nativePlayback) return undefined;
    const element = nativeRef.current;
    if (!element || !playback?.src) return undefined;

    furthestTimeRef.current = 0;
    element.src = playback.src;
    element.poster = playback.poster || "";
    element.load();

    const emitProgress = () => {
      onProgress?.({
        currentTime: Number.isFinite(element.currentTime) ? element.currentTime : 0,
        duration: Number.isFinite(element.duration) ? element.duration : 0,
        playbackRate: element.playbackRate || 1,
      });
    };

    const handleReady = (): void => {
      onPlayerReady?.({
        currentTime(value?: number): number {
          if (typeof value === "number") {
            element.currentTime = value;
          }
          return element.currentTime;
        },
        play(): Promise<void> {
          return element.play();
        },
      });
    };

    element.addEventListener("loadedmetadata", handleReady);
    element.addEventListener("loadedmetadata", emitProgress);
    element.addEventListener("timeupdate", emitProgress);
    element.addEventListener("ratechange", emitProgress);
    if (typeof onEnded === "function") {
      element.addEventListener("ended", onEnded);
    }

    return () => {
      element.removeEventListener("loadedmetadata", handleReady);
      element.removeEventListener("loadedmetadata", emitProgress);
      element.removeEventListener("timeupdate", emitProgress);
      element.removeEventListener("ratechange", emitProgress);
      if (typeof onEnded === "function") {
        element.removeEventListener("ended", onEnded);
      }
    };
  }, [nativePlayback, playback?.src, playback?.poster, playback?.type, onEnded, onPlayerReady, onProgress]);

  return (
    <div className={`videojs-shell ${className}`.trim()}>
      {nativePlayback ? (
        <video
          ref={nativeRef}
          className="w-full min-h-[28rem] rounded-2xl bg-slate-950 object-contain"
          controls
          playsInline
          preload="metadata"
        />
      ) : (
        <div data-vjs-player ref={hostRef} />
      )}
    </div>
  );
};

export default VideoJsPlayerComponent;
