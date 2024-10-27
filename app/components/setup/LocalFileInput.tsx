import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { useCallback, useEffect, useRef } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Help from '@/components/common/Help'
import Row from 'react-bootstrap/Row'
import { getTableReader } from '@/lib/io'
import { ContextActions } from '@/interfaces/contextActions'
import { GA_MEASUREMENT_ID } from '@/lib/gtag'
import { event } from 'nextjs-google-analytics'


export default function LocalFileInput() {
  const { tcState, tcDispatch } = useXTableConfig()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!!tcState.table.file && !!inputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(tcState.table.file)
      const fileList = dataTransfer.files
      inputRef.current.files = fileList
    }
  }, [tcState.table.file])

  const handleLocalFile = useCallback((e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]

      tcDispatch({
        type: ContextActions.USER_FILE_INPUT,
        payload: {
          state: 'loading'
        }
      })

      getTableReader(file)?.getTableSummary().then(summary => {
        console.log('summary', summary)
        if (summary !== undefined) {
          const isSameFile = (
            tcState.table.type === 'local' && (
              file.name === tcState.table.file?.name ||
              file.size === tcState.table.file?.size ||
              file.lastModified === tcState.table.file?.lastModified
            )
          )
          if (!isSameFile) {
            tcDispatch({
              type: ContextActions.GRID_UPDATE,
              payload: {
                data: [],
                colDefs: [],
              }
            })
          }
          const selCols = []
          if (summary.raIndex !== undefined && summary.raIndex >= 0) {
            selCols.push(summary.raIndex)
          }
          if (summary.decIndex !== undefined && summary.decIndex >= 0) {
            selCols.push(summary.decIndex)
          }
          tcDispatch({
            type: ContextActions.USER_FILE_INPUT,
            payload: {
              type: 'local',
              columns: summary.columns,
              selectedColumnsId: selCols,
              raIndex: summary.raIndex,
              decIndex: summary.decIndex,
              raCol: summary.raCol,
              decCol: summary.decCol,
              dataTypes: summary.dataTypes,
              state: summary.positionFound ? 'success' : 'positionNotFound',
              file,
              isSameFile,
            }
          })
          tcDispatch({
            type: ContextActions.PLOT_SETUP,
            payload: {
              filterIndex: [],
              filterView: undefined,
              inspectSelected: false,
            }
          })
          event(
            'load_file_local', {
            category: 'load',
            label: 'local',
            userId: GA_MEASUREMENT_ID
          })
        }
      }).catch(err => {
        console.log(err)
        tcDispatch({
          type: ContextActions.USER_FILE_INPUT,
          payload: {
            type: 'local',
            columns: [],
            selectedColumnsId: [],
            raIndex: -1,
            decIndex: -1,
            raCol: undefined,
            decCol: undefined,
            dataTypes: undefined,
            state: 'error',
            file: undefined,
          }
        })
      })
    }
  }, [tcState, tcDispatch])

  return (
    <>
      <Form.Group as={Row} className="mb-2" controlId="tableFile">
        <Form.Label column sm="1" className="text-end">
          Table
        </Form.Label>
        <Col sm={8}>
          <div className="d-flex align-items-center">
            <Form.Control
              type="file"
              onChange={handleLocalFile}
              ref={inputRef} />
            <Help title="Local Upload" className="ms-1">
              Load a table available in local computer. The only required
              columns are <code>RA</code> and <code>DEC</code> in degrees.<br />
              <u>Available formars</u>: <code>CSV</code>, <code>TSV</code>,
              &nbsp;<code>DAT</code>, <code>PARQUET</code>.
            </Help>
          </div>
        </Col>
      </Form.Group>
    </>
  )
}