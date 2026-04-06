'use client'

import * as React from 'react'
import { cn } from '@/shared/lib/utils'

interface CountdownContextType {
  isFinished: boolean
  isWarning: boolean
  timeLeft: number
}

const CountdownContext = React.createContext<CountdownContextType | undefined>(
  undefined
)

function useCountdownContext() {
  const context = React.useContext(CountdownContext)
  if (!context) {
    throw new Error(
      'Countdown component parts must be used within a <Countdown> component'
    )
  }
  return context
}

interface CountdownProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  /**
   * Initial time in milliseconds
   */
  initialTime: number
  /**
   * Callback when countdown finishes
   */
  onFinish?: () => void
  /**
   * Time in milliseconds before finishing to show warning state
   */
  warningThreshold?: number
  /**
   * Whether to auto-start the countdown
   */
  autoStart?: boolean
  /**
   * Ref to control countdown (play, pause, reset)
   */
  ref?: React.Ref<CountdownHandle>
}

export interface CountdownHandle {
  play: () => void
  pause: () => void
  reset: () => void
  isRunning: boolean
}

function Countdown(
  {
    initialTime,
    onFinish,
    warningThreshold = 5000,
    autoStart = true,
    className,
    ...props
  }: CountdownProps,
  ref: React.ForwardedRef<CountdownHandle>
) {
  const [timeLeft, setTimeLeft] = React.useState(initialTime)
  const [isRunning, setIsRunning] = React.useState(autoStart)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const isFinished = timeLeft <= 0
  const isWarning = timeLeft > 0 && timeLeft <= warningThreshold

  // Effect to handle the countdown logic
  React.useEffect(() => {
    if (!isRunning || isFinished) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 100)
        return next
      })
    }, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, isFinished])

  // Effect to trigger onFinish callback
  React.useEffect(() => {
    if (isFinished && onFinish) {
      onFinish()
    }
  }, [isFinished, onFinish])

  // Expose imperative handle for external control
  React.useImperativeHandle(
    ref,
    () => ({
      play: () => setIsRunning(true),
      pause: () => setIsRunning(false),
      reset: () => {
        setTimeLeft(initialTime)
        setIsRunning(false)
      },
      get isRunning() {
        return isRunning
      },
    }),
    [initialTime, isRunning]
  )

  return (
    <CountdownContext.Provider value={{ isFinished, isWarning, timeLeft }}>
      <div
        data-slot="countdown"
        className={cn('flex flex-col gap-4', className)}
        {...props}
      >
        {props.children}
      </div>
    </CountdownContext.Provider>
  )
}

interface CountdownDisplayProps extends React.ComponentProps<'div'> {
  /**
   * Whether to show milliseconds
   */
  showMilliseconds?: boolean
  /**
   * Custom classes when countdown is in warning state
   */
  warningClassName?: string
  /**
   * Custom classes when countdown is finished
   */
  finishedClassName?: string
}

function CountdownDisplay({
  showMilliseconds = false,
  warningClassName,
  finishedClassName,
  className,
  ...props
}: CountdownDisplayProps) {
  const { isFinished, isWarning, timeLeft } = useCountdownContext()

  // Format time to MM:SS or MM:SS:MS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const milliseconds = Math.floor((ms % 1000) / 10) // Centiseconds

    const pad = (num: number) => String(num).padStart(2, '0')

    if (showMilliseconds) {
      return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`
    }
    return `${pad(minutes)}:${pad(seconds)}`
  }

  const stateClassName = isFinished
    ? finishedClassName
    : isWarning
      ? warningClassName
      : ''

  return (
    <div
      data-slot="countdown-display"
      className={cn(
        'font-mono text-5xl font-bold tabular-nums tracking-tight transition-colors duration-200',
        stateClassName,
        className
      )}
      {...props}
    >
      {formatTime(timeLeft)}
    </div>
  )
}

interface CountdownDescriptionProps extends React.ComponentProps<'div'> {
  /**
   * Description text or React node
   */
  children?: React.ReactNode
}

function CountdownDescription({
  className,
  children,
  ...props
}: CountdownDescriptionProps) {
  return (
    <div
      data-slot="countdown-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface CountdownControlsProps extends React.ComponentProps<'div'> {
  /**
   * Ref to the Countdown component for controlling playback
   */
  countdownRef: React.RefObject<CountdownHandle>
}

function CountdownControls({
  countdownRef,
  className,
  ...props
}: CountdownControlsProps) {
  const [isRunning, setIsRunning] = React.useState(false)

  // Sync state with actual countdown status
  React.useEffect(() => {
    if (countdownRef.current) {
      setIsRunning(countdownRef.current.isRunning)
    }
  }, [countdownRef])

  const handlePlayPause = () => {
    if (!countdownRef.current) return

    if (isRunning) {
      countdownRef.current.pause()
    } else {
      countdownRef.current.play()
    }
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    if (!countdownRef.current) return
    countdownRef.current.reset()
    setIsRunning(false)
  }

  return (
    <div
      data-slot="countdown-controls"
      className={cn('flex gap-2', className)}
      {...props}
    >
      <button
        onClick={handlePlayPause}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90'
        )}
      >
        {isRunning ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={handleReset}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        Reset
      </button>
    </div>
  )
}

const Countdown_ = React.forwardRef<CountdownHandle, CountdownProps>(
  Countdown
)

export {
  Countdown_,
  CountdownDisplay,
  CountdownDescription,
  CountdownControls,
  useCountdownContext,
}
