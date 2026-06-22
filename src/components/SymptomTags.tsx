import { Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export const DEFAULT_SYMPTOMS = [
  '食欲不振',
  '呕吐',
  '腹泻',
  '咳嗽',
  '发热',
  '皮肤瘙痒',
  '眼部异常',
  '跛行',
  '呼吸急促',
  '精神萎靡',
  '食欲亢进',
  '排尿异常',
] as const

export type Symptom = (typeof DEFAULT_SYMPTOMS)[number]

export interface SymptomTagsProps {
  symptoms?: Symptom[]
  onSelect?: (symptoms: Symptom[]) => void
  options?: readonly Symptom[]
}

export default function SymptomTags({
  symptoms: controlledSymptoms,
  onSelect,
  options = DEFAULT_SYMPTOMS,
}: SymptomTagsProps) {
  const [internalSymptoms, setInternalSymptoms] = useState<Symptom[]>([])
  const isControlled = controlledSymptoms !== undefined
  const selected = isControlled ? controlledSymptoms : internalSymptoms

  const toggleSymptom = (symptom: Symptom) => {
    const next = selected.includes(symptom)
      ? selected.filter((s) => s !== symptom)
      : [...selected, symptom]

    if (!isControlled) {
      setInternalSymptoms(next)
    }
    onSelect?.(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((symptom) => {
        const isSelected = selected.includes(symptom)
        return (
          <button
            key={symptom}
            type="button"
            onClick={() => toggleSymptom(symptom)}
            className={cn(
              'chip transition-all duration-200 cursor-pointer select-none',
              isSelected
                ? 'bg-primary-500 text-white shadow-sm pl-2.5 hover:bg-primary-600'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800'
            )}
          >
            {isSelected && <Check size={14} strokeWidth={3} />}
            {symptom}
          </button>
        )
      })}
    </div>
  )
}
