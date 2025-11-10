import { useEffect, useState } from 'react'

import { Root, Track, Thumb, Range } from '@radix-ui/react-slider'

import styles from './styles.module.css'

export type SliderProps = {
  percent: number
  onChange: (newValue: string) => void
}

export function SliderCustom({ percent, onChange }: SliderProps) {
  const [value, setValue] = useState([percent])

  useEffect(() => {
    onChange(value[0].toString())
  }, [value])

  return (
    <div className={styles.wrapper}>
      <Root
        value={value}
        className={styles.sliderRoot}
        onValueChange={setValue}
        max={100}
        min={0}
        step={5}
      >
        <Track className={styles.sliderTrack}>
          <Range className={styles.sliderRange} />
        </Track>
        <div className={styles.bottomLabel}>Low</div>
        <div className={styles.bottomLabel} style={{ right: 0 }}>
          High
        </div>
        <Thumb className={styles.sliderThumb}>
          <span
            className={styles.label}
            style={{ left: `-${value[0] === 100 ? 4 : 0}px` }}
          >
            {value}%
          </span>
        </Thumb>
      </Root>
    </div>
  )
}
