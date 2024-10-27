import Button from "react-bootstrap/Button"
import { MdSwapHoriz } from "react-icons/md"

export default function SwapButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="outline-primary" className="p-1" onClick={onClick}>
      <MdSwapHoriz size={22} />
    </Button>
  )
}