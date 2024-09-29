import { useXTableConfig } from "@/contexts/XTableConfigContext"
import { MdEdit } from "react-icons/md"
import { ImEye } from "react-icons/im";
import Button from 'react-bootstrap/Button'
import { ContextActions } from "@/interfaces/contextActions";
import TableHelper from "@/lib/TableHelper";
import { useState } from "react";



export default function ModeButton() {
  const { tcState } = useXTableConfig()
  const [isEditable, setEditable] = useState(false)
  const handleToggle = () => {
    const state = {...tcState}
    state.grid.editable = !isEditable
    const { colDef } = TableHelper.getColDefs(state)
    tcState.grid.api.setGridOption('columnDefs', colDef)
    setEditable(!isEditable)
  }

  return (
    <>
      {isEditable ? (
        <Button
          size="sm"
          variant="success"
          className="ms-2 d-inline-flex align-items-center"
          onClick={handleToggle}>
          <MdEdit size={18} className="me-1" />
          <span>Edit Mode</span>
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline-primary"
          className="ms-2 d-inline-flex align-items-center"
          onClick={handleToggle}>
          <ImEye size={18} className="me-1" />
          <span>View Mode</span>
        </Button>
      )}
    </>
  )
}