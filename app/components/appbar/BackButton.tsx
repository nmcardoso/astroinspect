import { useXTableConfig } from "@/contexts/XTableConfigContext"
import { ContextActions } from "@/interfaces/contextActions"
import { useCallback } from "react"
import Button from "react-bootstrap/Button"
import { FaArrowLeft } from "react-icons/fa"



export default function BackButton() {
  const { tcDispatch } = useXTableConfig()
  
  const handleClick = useCallback(() => {
    tcDispatch({
      type: ContextActions.CURRENT_VIEW_CHANGE,
      payload: 'settings'
    })
  }, [])

  return (
    <Button
      className="d-inline-flex align-items-center me-2"
      onClick={handleClick}>
      <FaArrowLeft size={14} className="me-2" />
      <span>Back</span>
    </Button>
  )
}