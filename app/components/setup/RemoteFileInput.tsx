import Help from '@/components/common/Help'
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import Emitter from '@/lib/Emitter'
import { GA_MEASUREMENT_ID } from '@/lib/gtag'
import { getTableReader } from '@/lib/io'
import { isUrlValid } from '@/lib/utils'
import { event } from 'nextjs-google-analytics'
import { useCallback, useEffect } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'



export default function RemoteFileInput() {
  const { tcState, tcDispatch } = useXTableConfig()

  const handleRemoteFile = useCallback((url: string, autoLoad: boolean = false) => {
    if (url.length > 0 && isUrlValid(url)) {
      tcDispatch({
        type: ContextActions.USER_FILE_INPUT,
        payload: {
          state: 'loading'
        }
      })

      getTableReader(url)?.getTableSummary().then(summary => {
        if (summary != undefined) {
          const isSameFile = (
            tcState.table.type === 'remote' &&
            url == tcState.table.url
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
              type: 'remote',
              columns: summary.columns,
              selectedColumnsId: selCols,
              raIndex: summary.raIndex,
              decIndex: summary.decIndex,
              raCol: summary.raCol,
              decCol: summary.decCol,
              dataTypes: summary.dataTypes,
              state: summary.positionFound ? 'success' : 'positionNotFound',
              url,
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
          if (autoLoad) {
            tcDispatch({
              type: ContextActions.CURRENT_VIEW_CHANGE,
              payload: 'grid'
            })
          }
          event(
            'load_file_remote', {
            category: 'load',
            label: 'remote',
            userId: GA_MEASUREMENT_ID
          })
        }
      }).catch(err => {
        console.log(err)
        tcDispatch({
          type: ContextActions.USER_FILE_INPUT,
          payload: {
            type: 'remote',
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
  }, [tcDispatch, tcState])

  useEffect(() => {
    Emitter.on('INSERT_URL', (e: any) => handleRemoteFile(e.url, true))
    event(
      'load_file_example', {
      category: 'load',
      label: 'example',
      userId: GA_MEASUREMENT_ID
    })
  }, [handleRemoteFile])

  return (
    <Form.Group as={Row} className="mb-2" controlId="tableFile">
      <Form.Label column sm="1" className="text-end">
        URL
      </Form.Label>
      <Col sm={10}>
        <div className="d-flex align-items-center">
          <Form.Control
            placeholder="File URL"
            onChange={(e) => handleRemoteFile(e.target.value)}
            value={tcState.table.url || ''} />
          <Help title="Remote Upload" className="ms-1">
            Loads a table available remotely in the internet.<br />
            <u>Available formars</u>: <code>CSV</code>, <code>TSV</code>,
            &nbsp;<code>DAT</code>, <code>PARQUET</code>.
          </Help>
        </div>
      </Col>
    </Form.Group>
  )
}