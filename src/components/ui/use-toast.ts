'use client';

import { useState, useEffect } from "react"

const TOAST_LIMIT = 1

interface ToastBase {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  action?: React.ReactNode;
  [key: string]: any;
}

interface Toast extends ToastBase {
  dismiss: () => void;
}

interface ToastState {
  toasts: Toast[];
}

interface ToastStore {
  state: ToastState;
  listeners: Array<(state: ToastState) => void>;
  getState: () => ToastState;
  setState: (nextState: ToastState | ((prevState: ToastState) => ToastState)) => void;
  subscribe: (listener: (state: ToastState) => void) => () => void;
}

let count = 0
function generateId(): string {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastStore: ToastStore = {
  state: {
    toasts: [],
  },
  listeners: [],

  getState: () => toastStore.state,

  setState: (nextState) => {
    if (typeof nextState === 'function') {
      toastStore.state = nextState(toastStore.state)
    } else {
      toastStore.state = { ...toastStore.state, ...nextState }
    }

    toastStore.listeners.forEach(listener => listener(toastStore.state))
  },

  subscribe: (listener) => {
    toastStore.listeners.push(listener)
    return () => {
      toastStore.listeners = toastStore.listeners.filter(l => l !== listener)
    }
  }
}

interface ToastReturn {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToastBase>) => void;
}

export const toast = (props: Partial<ToastBase>): ToastReturn => {
  const id = generateId()

  const update = (updateProps: Partial<ToastBase>): void =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...updateProps } : t
      ),
    }))

  const dismiss = (): void => toastStore.setState((state) => ({
    ...state,
    toasts: state.toasts.filter((t) => t.id !== id),
  }))

  toastStore.setState((state) => ({
    ...state,
    toasts: [
      { ...props, id, dismiss } as Toast,
      ...state.toasts,
    ].slice(0, TOAST_LIMIT),
  }))

  return {
    id,
    dismiss,
    update,
  }
}

interface UseToastReturn {
  toast: typeof toast;
  toasts: Toast[];
}

export function useToast(): UseToastReturn {
  const [state, setState] = useState<ToastState>(toastStore.getState())

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((state) => {
      setState(state)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    state.toasts.forEach((toastItem) => {
      if (toastItem.duration === Infinity) {
        return
      }

      const timeout = setTimeout(() => {
        toastItem.dismiss()
      }, toastItem.duration || 5000)

      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [state.toasts])

  return {
    toast,
    toasts: state.toasts,
  }
}
