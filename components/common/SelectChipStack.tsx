import Chip from './Chip'

type PropsType = {
  values: any[],
  onClick: (v: any) => void
}

export default function SelectChipStack({ values, onClick = () => { } }: PropsType) {
  return (
    <>
      {values.map(v => (
        <Chip
          key={v}
          className="me-1"
          onClose={() => onClick(v)}>
          {v}
        </Chip>
      ))}
    </>
  )
}