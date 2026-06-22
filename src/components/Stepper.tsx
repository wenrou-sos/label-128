import { Check } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

export interface StepperStep {
  title: string
  icon: ComponentType<any>
}

export interface StepperProps {
  steps: StepperStep[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const progress = steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-200" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const Icon = step.icon

            return (
              <div key={index} className="relative flex flex-col items-center gap-2 z-10">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    isCompleted &&
                      'bg-primary-500 border-primary-500 text-white shadow-glow',
                    isCurrent &&
                      'bg-white border-primary-500 text-primary-600 shadow-md scale-110',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-white border-zinc-300 text-zinc-400'
                  )}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors duration-300',
                    isCompleted || isCurrent ? 'text-zinc-900' : 'text-zinc-400'
                  )}
                >
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-700">
            步骤 {currentStep} / {steps.length}
          </span>
          <span className="text-sm font-semibold text-primary-600">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <div className="relative w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const Icon = step.icon

            return (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    isCompleted &&
                      'bg-primary-500 border-primary-500 text-white',
                    isCurrent &&
                      'bg-white border-primary-500 text-primary-600',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-white border-zinc-300 text-zinc-400'
                  )}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <Icon size={14} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
