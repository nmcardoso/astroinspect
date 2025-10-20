/* eslint-disable @next/next/no-img-element */
import { useXTableConfig } from '@/contexts/XTableConfigContext'
import { ContextActions } from '@/interfaces/contextActions'
import { semaphore } from '@/lib/Semaphore'
import { loadErrorState, loadingState, queuedState } from '@/lib/states'
import TableHelper from '@/lib/TableHelper'
import { CustomImageFromFolder, CustomImageFromUrl } from '@/services/custom'
import { LegacyStamp } from '@/services/legacy'
import { SdssCatalog, SdssSpectra } from '@/services/sdss'
import { SplusPhotoSpectra, SplusStamp } from '@/services/splus'
import {
  AllCommunityModule, ModuleRegistry, CellKeyDownEvent, GetRowIdParams,
  GridOptions, GridReadyEvent, IRowNode, themeQuartz, colorSchemeDark,
  colorSchemeLight,
  GridPreDestroyedEvent,
  CellContextMenuEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-quartz.css'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ListItemIcon, ListItemText, MenuList, Paper, Popover, Typography, useTheme } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import copy from 'copy-to-clipboard'
import { useNotifications } from '@/contexts/NotificationsContext'
import { defaults } from 'lodash'
import { HipsStamp } from '@/services/hips'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import LaunchIcon from '@mui/icons-material/Launch'

ModuleRegistry.registerModules([AllCommunityModule])
// provideGlobalGridOptions({ theme: "legacy" })

semaphore.create('img:legacy', 6)
semaphore.create('img:splus', 5)
semaphore.create('img:splus_photospec', 5)
semaphore.create('img:sdss_spec', 4)
semaphore.create('img:custom', 15)
semaphore.create('sdss_cat', 4)
semaphore.create('img:hips', 5)

const FETCH_BUFFER = process.env.NODE_ENV === 'development' ? 0 : 400

const PAGE_SIZES = [50, 100, 200, 400, 600, 800, 1000]

const tableWrapperStyle = {
  '--ag-cell-horizontal-padding': '8px',
  '--ag-borders': 'solid 1px',
  '--ag-wrapper-border-radius': '0px',
  '--ag-header-height': '38px',
} as React.CSSProperties


const downloadResource = async ({
  resourceFetch,
  colId,
  rowId,
  grid,
  isImage = true,
}: {
  resourceFetch: IResourceFetch,
  colId: string,
  rowId: string,
  grid: AgGridReact,
  isImage: boolean,
}) => {
  const rowNode = grid!.api.getRowNode(rowId)
  if (
    (rowNode?.data[colId] === queuedState || rowNode?.data[colId] === undefined)
    && rowNode?.data.hasOwnProperty(colId)
  ) {
    try {
      rowNode?.setDataValue(colId, loadingState)
      const resp = await resourceFetch.fetch({id: parseInt(rowId)})

      if (isImage) {
        rowNode?.setDataValue(colId, URL.createObjectURL(resp.data))
      } else {
        rowNode?.setDataValue(colId, resp.data)
      }
    } catch {
      rowNode?.setDataValue(colId, loadErrorState)
    }
  }
}


const copyCellValue = (value: any, notification: UseNotifications | null) => {
  copy(value, {
    format: 'text/plain',
    onCopy: () => {
      notification?.show(`Copied: ${value}`, { autoHideDuration: 2000, severity: 'success' })
    }
  })
}


const copyCoordinates = (rowData: any, notification: UseNotifications | null, tcState: IState) => {
  if (tcState.table.raCol && tcState.table.decCol) {
    const ra = rowData[`tab:${tcState.table.raCol}`]
    const dec = rowData[`tab:${tcState.table.decCol}`]
    copy(`${ra} ${dec}`, {
      format: 'text/plain',
      onCopy: () => {
        notification?.show(`Copied: ${ra} ${dec}`, { autoHideDuration: 2000, severity: 'success' })
      }
    })
  } else {
    notification?.show('Can not find RA and DEC columns', { autoHideDuration: 2000, severity: 'error' })
  }
}


const goToSimbad = (rowData: any, tcState: IState) => {
  const ra = String(rowData[`tab:${tcState.table.raCol}`])
  let dec = String(rowData[`tab:${tcState.table.decCol}`])
  if (!dec.startsWith('-')) {
    dec = '+' + dec
  }
  const url = (
    `https://simbad.u-strasbg.fr/simbad/sim-coo?Coord=${ra}${dec}` + 
    '&CooFrame=FK5&CooEpoch=2000&CooEqui=2000&CooDefinedFrames=none' +
    '&Radius=5&Radius.unit=arcsec&submit=submit+query&CoordList='
  )
  window.open(url, '_blank')?.focus()
}



const goToNED = (rowData: any, tcState: IState) => {
  const ra = String(rowData[`tab:${tcState.table.raCol}`])
  let dec = String(rowData[`tab:${tcState.table.decCol}`])
  if (!dec.startsWith('-')) {
    dec = '+' + dec
  }
  const url = (
    'https://ned.ipac.caltech.edu/conesearch?search_type=Near%20Position%20Search' +
    `&in_csys=Equatorial&in_equinox=J2000&ra=${ra}d&dec=${dec}d` +
    '&radius=0.083&Z_CONSTRAINT=Unconstrained'
  )
  window.open(url, '_blank')?.focus()
}



function TableContextMenu({
  context,
  onClose = () => {}
}: {context: CellContextMenuEvent | null, onClose: () => void}) {
  const { tcState, tcDispatch } = useXTableConfig()
  const notification = useNotifications()

  const handleCopy = () => {
    copyCellValue(context?.value, notification)
    onClose()
  }

  const handleCopyCoordinates = () => {
    copyCoordinates(context?.data, notification, tcState)
    onClose()
  }

  const handleGoToSimbad = () => {
    goToSimbad(context?.data, tcState)
    onClose()
  }

  const handleGoToNED = () => {
    goToNED(context?.data, tcState)
    onClose()
  }

  return (
    <Popover
      open={context !== null}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        context !== null ? { 
          top: (context?.event as MouseEvent).clientY - 6, 
          left: (context?.event as MouseEvent).clientX + 2 
        } : undefined
      }
    >
      <Paper sx={{ width: 260, maxWidth: '100%' }}>
        <MenuList>
        <MenuItem onClick={handleCopy}>
          <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ctrl + C
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleCopyCoordinates}>
          <ListItemIcon><MyLocationIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Copy position</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ctrl + X
          </Typography>
        </MenuItem>
        <Divider sx={{my: 0.5}} />
        <MenuItem onClick={handleGoToSimbad}>
          <ListItemIcon><LaunchIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Search Simbad</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleGoToNED}>
          <ListItemIcon><LaunchIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Search NED</ListItemText>
        </MenuItem>
        </MenuList>
      </Paper>
    </Popover>
  )
}


export default function AIGrid() {
  const { tcState, tcDispatch } = useXTableConfig()
  const theme = useTheme()
  const gridRef = useRef<AgGridReact>(null)
  const notification = useNotifications()
  const [contextMenu, setContextMenu] = useState<CellContextMenuEvent | null>(null)

  const onGridReady = useCallback((event: GridReadyEvent) => {
    if (!tcState.grid.api || tcState.grid?.api?.isDestroyed) {
      tcDispatch({
        type: ContextActions.GRID_UPDATE,
        payload: {
          api: event.api,
        }
      })
    }

    tcDispatch({
      type: ContextActions.USER_FILE_INPUT,
      payload: {
        isSameFile: true,
        state: 'success',
      }
    })
  }, [tcState, tcDispatch])


  const onChange = useCallback((event: any) => {
    const pageSize = event.api.paginationGetPageSize()
    const currentPage = event.api.paginationGetCurrentPage()
    const filteredData: any[] = []
    event.api.forEachNodeAfterFilterAndSort((row: IRowNode<any>) => {
      filteredData.push(row.data)
    })
    const startIndex = currentPage * pageSize
    const endIndex = startIndex + pageSize + FETCH_BUFFER

    const pageData = filteredData.slice(startIndex, endIndex)

    const raCol = tcState.table.columns[tcState.table.raIndex as number]
    const decCol = tcState.table.columns[tcState.table.decIndex as number]

    semaphore.clear()

    // row-wise map
    pageData.forEach(e => {
      const ra = e[`tab:${raCol}`]
      const dec = e[`tab:${decCol}`]
      const rowId = e['ai:id']

      // Legacy stamps
      if (tcState.cols.legacyImaging.enabled) {
        semaphore.enqueue(
          'img:legacy',
          downloadResource,
          {
            resourceFetch: new LegacyStamp(ra, dec, 300, tcState.cols.legacyImaging.pixelScale, tcState.cols.legacyImaging.autoPixelScale),
            colId: 'img:legacy',
            rowId: rowId,
            grid: gridRef.current
          }
        )
      }

      // S-PLUS stamps
      if (tcState.cols.splusImaging.enabled) {
        const config = tcState.cols.splusImaging.type === 'trilogy' ?
          tcState.cols.splusImaging.trilogyConfig :
          tcState.cols.splusImaging.luptonConfig
        semaphore.enqueue(
          'img:splus',
          downloadResource,
          {
            resourceFetch: new SplusStamp(ra, dec, tcState.cols.splusImaging.pixelScale, tcState.cols.splusImaging.type, config),
            colId: 'img:splus',
            rowId: rowId,
            grid: gridRef.current,
          }
        )
      }

      // Hips2Fits stamps
      if (tcState.cols.hipsImaging.enabled) {
        for (const survey of tcState.cols.hipsImaging.selectedSurveys) {
          const conf = tcState.cols.hipsImaging.surveySettings?.[survey] ?? tcState.cols.hipsImaging.defaultSettings
          semaphore.enqueue(
            'img:hips',
            downloadResource,
            {
              resourceFetch: new HipsStamp(
                survey, ra, dec, 300, conf.fov, conf.minPixelCut, 
                conf.maxPixelCut, conf.stretch, conf.colormap, conf.invert
              ),
              colId: `img:hips_${survey}`,
              rowId: rowId,
              grid: gridRef.current,
              isImage: false,
            }
          )
        }
      }

      // S-PLUS photo spectra
      if (tcState.cols.splusPhotoSpectra.enabled) {
        semaphore.enqueue(
          'img:splus_photospec',
          downloadResource,
          {
            resourceFetch: new SplusPhotoSpectra(ra, dec, tcState.cols.splusPhotoSpectra.selectedLines),
            colId: 'img:splus_photospec',
            rowId: rowId,
            grid: gridRef.current,
          }
        )
      }

      // SDSS spectra
      if (tcState.cols.sdssSpectra.enabled) {
        semaphore.enqueue(
          'img:sdss_spec',
          downloadResource,
          {
            resourceFetch: new SdssSpectra(ra, dec),
            colId: 'img:sdss_spec',
            rowId: rowId,
            grid: gridRef.current,
            isImage: false,
          }
        )
      }

      // Custom Imaging
      if (tcState.cols.customImaging.enabled) {
        tcState.cols.customImaging.columns.forEach((col, idx, _) => {
          const riCol = `tab:${tcState.table.columns[col.columnIndex]}`
          if (col.type === 'url') {
            semaphore.enqueue(
              'img:custom',
              downloadResource,
              {
                resourceFetch: new CustomImageFromUrl(col.prepend, col.append, e[riCol]),
                colId: `img:custom_${idx}`,
                rowId: rowId,
                grid: gridRef.current,
                isImage: false,
              }
            )
          } else if (col.type === 'folder') {
            semaphore.enqueue(
              'img:custom',
              downloadResource,
              {
                resourceFetch: new CustomImageFromFolder(
                  col.prepend, col.append, e[riCol],
                  tcState.cols.customImaging.columns?.[idx]?.folderStructure,
                  tcState.cols.customImaging.columns?.[idx]?.folder
                ),
                colId: `img:custom_${idx}`,
                rowId: rowId,
                grid: gridRef.current,
                isImage: true,
              }
            )
          }
        })
      }

      // SDSS Catalog
      tcState.cols.sdssCatalog.selectedColumns.forEach((c) => {
        semaphore.enqueue(
          'sdss_cat',
          downloadResource,
          {
            resourceFetch: new SdssCatalog(ra, dec, c.table, c.column),
            colId: `sdss:${c.table}_${c.column}`,
            rowId: rowId,
            grid: gridRef.current,
            isImage: false,
          }
        )
      })

    })
  }, [tcState])



  const onCellKeyDown = useCallback((event: CellKeyDownEvent) => {
    const keyEvent = event.event as KeyboardEvent
    if (!keyEvent) return

    if (keyEvent.key.toLowerCase() === 'c' && (keyEvent.ctrlKey || keyEvent.metaKey) && !tcState.grid.editable) {
      copyCellValue(event?.value, notification)
    } else if (keyEvent.key.toLowerCase() === 'x' && (keyEvent.ctrlKey || keyEvent.metaKey) && !tcState.grid.editable) {
      copyCoordinates(event?.data, notification, tcState)
    } else if (tcState.cols.classification.enabled && !keyEvent.altKey && !keyEvent.ctrlKey && !keyEvent.shiftKey) {
      for (const [cls, hotkey] of Object.entries(tcState.cols.classification.keyMap)) {
        if (hotkey.toLowerCase() == keyEvent.key.toLowerCase()) {
          if (event.node.data?.['ai:class'] == cls) {
            event.node.setDataValue('ai:class', undefined)
          } else {
            event.node.setDataValue('ai:class', cls)
          }
        }
      }
    }
  }, [tcState.cols.classification.enabled, tcState.cols.classification.keyMap])


  const handleContextMenu = (event: CellContextMenuEvent) => {
    event.event?.preventDefault()

    setContextMenu(contextMenu === null ? event : null)

    const selection = document.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)

      setTimeout(() => {
        selection.addRange(range)
      })
    }
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }


  const getRowId = useCallback((params: GetRowIdParams): string => {
    return params.data['ai:id']
  }, [])


  let gridOptions: GridOptions = {
    suppressHorizontalScroll: false,
    multiSortKey: 'ctrl',
  }
  if (
    tcState.cols.splusImaging.enabled ||
    tcState.cols.legacyImaging.enabled ||
    tcState.cols.sdssSpectra.enabled ||
    tcState.cols.splusPhotoSpectra.enabled ||
    tcState.cols.hipsImaging.enabled || 
    (tcState.cols.customImaging.enabled && tcState.cols.customImaging.columns.length > 0)
  ) {
    gridOptions.rowHeight = parseInt(tcState.ui.figureSize as any as string)
  }


  const plotFilter = useCallback((node: IRowNode<any>): boolean => {
    if (node.data) {
      return tcState.plots.filterIndex?.includes(node.sourceRowIndex)
    }
    return true
  }, [tcState.plots.filterIndex])


  useEffect(() => {
    const { colDef, initVal } = TableHelper.getColDefs(tcState)
    tcDispatch({
      type: ContextActions.GRID_UPDATE,
      payload: {
        // data: tcState.grid.data?.map((d: any) => ({ ...d, ...initVal })),
        // currColConfigs: cloneDeep(tcState.cols),
        // currTable: { ...tcState.table },
        colDef: colDef,
      }
    })
  }, [
    tcState.cols.classification.enabled, tcState.cols.splusPhotoSpectra.enabled,
    tcState.cols.legacyImaging.enabled, tcState.cols.splusImaging.enabled,
    tcState.table.selectedColumnsId, tcState.grid.editable, tcState.ui.figureSize,
    tcState.cols.sdssSpectra.enabled, tcState.cols.hipsImaging.enabled,
  ])

  useEffect(() => {
    const { colDef, initVal } = TableHelper.getColDefs(tcState)

    if (tcState.grid?.data) {
      tcState.grid.data = tcState.grid.data?.map((d: any) => defaults(d, initVal))
    }

    tcDispatch({
      type: ContextActions.GRID_UPDATE,
      payload: {
        colDef: colDef,
      }
    })
  }, [
    tcState.cols.sdssCatalog.enabled, tcState.cols.sdssCatalog.selectedColumns,
    tcState.cols.customImaging.enabled, tcState.cols.customImaging.columns,
    tcState.cols.hipsImaging.enabled, tcState.cols.hipsImaging.selectedSurveys,
  ])

  const onGridPreDestroyed = useCallback((event: GridPreDestroyedEvent) => {
    console.log(tcState.grid.data)
  }, [tcState.grid.data])

  const gridTheme = useMemo(() => {
    if (theme.palette.mode == 'light') {
      return themeQuartz.withPart(colorSchemeLight)
    }
    return themeQuartz.withPart(colorSchemeDark)
  }, [theme.palette.mode])

  return (
    <div
      className="ag-theme-quartz"
      style={{ width: '100%', height: '100%', ...tableWrapperStyle }}
      onContextMenu={e => e.preventDefault()}>
      <AgGridReact
        gridOptions={gridOptions}
        ref={gridRef}
        rowData={tcState.grid.data || []}
        columnDefs={tcState.grid.colDef || []}
        getRowId={getRowId}
        loading={tcState.table.state === 'loading'}
        theme={gridTheme}
        pagination={true}
        paginationPageSize={100}
        paginationPageSizeSelector={PAGE_SIZES}
        onGridReady={onGridReady}
        onPaginationChanged={onChange}
        onSortChanged={onChange}
        onFilterChanged={onChange}
        onCellKeyDown={onCellKeyDown}
        onGridPreDestroyed={onGridPreDestroyed}
        singleClickEdit={true}
        isExternalFilterPresent={() => tcState.plots.inspectSelected}
        doesExternalFilterPass={plotFilter}
        onCellContextMenu={handleContextMenu}
      // colorSchemeVariable="data-toolpad-color-scheme"
      />
      <TableContextMenu context={contextMenu} onClose={handleCloseContextMenu} />
    </div>
  )
}