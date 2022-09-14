import { MouseEventHandler, ReactElement } from 'react'
import styles from '../../styles/common/ButtonChip.module.css'

type PropsType = {
  children?: any,
  className?: string,
  onClick?: MouseEventHandler<HTMLDivElement>
}

export default function ButtonChip({
  children,
  className = "btn-light",
  onClick = () => { }
}: PropsType) {
  return (
    <div
      className={`${styles.chip} ${className}`}
      onClick={onClick}>
      {children}
    </div>
  )
}