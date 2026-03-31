import videojs from "video.js";

const ANALYTICS_PLUGIN = "lmsAnalytics";
const ADS_PLUGIN = "lmsAds";

function dispatchBrowserEvent(name: string, detail: any): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function buildPayload(player: any, options: any, eventType: string, extra: Record<string, any> = {}): Record<string, any> {
  const duration = Number.isFinite(player.duration()) ? player.duration() : 0;
  const currentTime = Number.isFinite(player.currentTime()) ? player.currentTime() : 0;
  const progressPercent = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;

  return {
    type: eventType,
    currentTime,
    duration,
    progressPercent,
    ...options?.meta,
    ...extra,
  };
}

function emitPluginEvent(player: any, channel: string, options: any, eventType: string, extra: Record<string, any> = {}): void {
  const detail = buildPayload(player, options, eventType, extra);
  player.trigger({ type: channel, detail });
  if (typeof options?.onEvent === "function") {
    options.onEvent(detail);
  }
  dispatchBrowserEvent(`videojs:${channel}`, detail);
}

function ensureAnalyticsPlugin(): void {
  if (typeof videojs.getPlugin === "function" && videojs.getPlugin(ANALYTICS_PLUGIN)) {
    return;
  }

  videojs.registerPlugin(ANALYTICS_PLUGIN, function registerAnalytics(this: any, options: any = {}): any {
    const player: any = this;

    if (player.__lmsAnalytics) {
      player.__lmsAnalytics.update(options);
      return player.__lmsAnalytics;
    }

    const state = {
      options,
      milestones: new Set<number>(),
      update(nextOptions: any = {}): void {
        state.options = nextOptions;
        state.milestones.clear();
      },
    };

    const milestoneTargets: number[] = [25, 50, 75, 90];

    const maybeEmitMilestone = (): void => {
      const duration = player.duration();
      if (!Number.isFinite(duration) || duration <= 0) return;

      const percent = (player.currentTime() / duration) * 100;

      for (const target of milestoneTargets) {
        if (percent >= target && !state.milestones.has(target)) {
          state.milestones.add(target);
          emitPluginEvent(player, "lmsanalytics", state.options, "milestone", {
            milestone: target,
          });
        }
      }
    };

    player.on("loadstart", (): void => {
      state.milestones.clear();
      emitPluginEvent(player, "lmsanalytics", state.options, "loadstart");
    });

    player.on("play", (): void => emitPluginEvent(player, "lmsanalytics", state.options, "play"));
    player.on("pause", (): void => {
      if (!player.ended()) {
        emitPluginEvent(player, "lmsanalytics", state.options, "pause");
      }
    });
    player.on("seeking", (): void => emitPluginEvent(player, "lmsanalytics", state.options, "seeking"));
    player.on("waiting", (): void => emitPluginEvent(player, "lmsanalytics", state.options, "buffering"));
    player.on("ended", (): void => emitPluginEvent(player, "lmsanalytics", state.options, "complete"));
    player.on("error", (): void => {
      const error = player.error();
      emitPluginEvent(player, "lmsanalytics", state.options, "error", {
        code: error?.code || null,
        message: error?.message || "Unknown playback error",
      });
    });
    player.on("timeupdate", maybeEmitMilestone);

    player.__lmsAnalytics = state;
    return state;
  });
}

function clearAdMarkers(player: any): void {
  const root = player.el();
  if (!root) return;
  root.querySelectorAll(".vjs-lms-ad-marker").forEach((node: Element) => node.remove());
}

function renderAdMarkers(player: any, markers: number[] = []): void {
  const holder = player.el()?.querySelector(".vjs-progress-holder");
  const duration = player.duration();

  clearAdMarkers(player);

  if (!holder || !Number.isFinite(duration) || duration <= 0) {
    return;
  }

  markers.forEach((markerTime: number): void => {
    const percent = Math.max(0, Math.min(100, (markerTime / duration) * 100));
    const marker = document.createElement("span");
    marker.className = "vjs-lms-ad-marker";
    marker.style.left = `${percent}%`;
    marker.title = `Ad break at ${Math.round(markerTime)}s`;
    holder.appendChild(marker);
  });
}

function ensureAdsPlugin(): void {
  if (typeof videojs.getPlugin === "function" && videojs.getPlugin(ADS_PLUGIN)) {
    return;
  }

  videojs.registerPlugin(ADS_PLUGIN, function registerAds(this: any, options: any = {}): any {
    const player: any = this;

    if (player.__lmsAds) {
      player.__lmsAds.update(options);
      return player.__lmsAds;
    }

    const state = {
      options,
      triggeredBreaks: new Set<number>(),
      update(nextOptions: any = {}): void {
        state.options = nextOptions;
        state.triggeredBreaks.clear();
        render();
      },
    };

    const getMarkers = (): number[] => {
      if (Array.isArray(state.options.markers) && state.options.markers.length) {
        return [...state.options.markers].sort((a: number, b: number): number => a - b);
      }
      return state.options.tagUrl ? [0] : [];
    };

    const render = (): void => {
      renderAdMarkers(player, getMarkers());
      player.el()?.setAttribute("data-ad-enabled", state.options.enabled ? "true" : "false");
    };

    const maybeTriggerAdBreak = (): void => {
      if (!state.options.enabled) return;

      const currentTime = player.currentTime();
      const markerTimes: number[] = getMarkers();
      for (const markerTime of markerTimes) {
        if (currentTime >= markerTime && !state.triggeredBreaks.has(markerTime)) {
          state.triggeredBreaks.add(markerTime);
          emitPluginEvent(player, "lmsadbreak", state.options, "ad-break", {
            markerTime,
            tagUrl: state.options.tagUrl || "",
            skipOffset: state.options.skipOffset || 0,
          });
        }
      }
    };

    player.on("loadstart", (): void => {
      state.triggeredBreaks.clear();
      render();
    });
    player.on("loadedmetadata", (): void => render());
    player.on("durationchange", (): void => render());
    player.on("timeupdate", (): void => maybeTriggerAdBreak());

    player.__lmsAds = state;
    return state;
  });
}

export function ensureLmsVideoJsPlugins() {
  ensureAnalyticsPlugin();
  ensureAdsPlugin();
}
