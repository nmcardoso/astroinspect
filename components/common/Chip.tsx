import { MouseEvent, MouseEventHandler, ReactElement } from 'react'
import styles from '../../styles/common/Chip.module.css'

type PropsType = {
  children?: any,
  value?: any,
  className?: string,
  onClose?: (event: MouseEvent<HTMLSpanElement>, value: any) => void,
  closeable?: boolean
}

export default function Chip({
  children,
  value = null,
  className = "",
  onClose = () => { },
  closeable = true }: PropsType) {
  return (
    <div className={`${styles.chip} ${className}`}>
      {children}
      {closeable && <span
        className={styles.closebtn}
        onClick={(event) => { onClose(event, value) }}>
        &times;
      </span>}
    </div>
  )
}