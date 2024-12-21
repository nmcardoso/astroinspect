import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'


type ListViewClickEvent = ({ title, index, event }: {
  title: string,
  index: number,
  event: React.MouseEvent<Element, MouseEvent>
}) => void

type ListViewProps = {
  items: string[],
  active: string[] | string | null,
  placeholder?: boolean,
  onClick: ListViewClickEvent,
  height?: number,
  multiple?: boolean,
  className?: string,
}


export const SingleListView = ({ items, active, onClick, height, className }: ListViewProps) => {
  return (
    <Paper>
      <List sx={{ height, overflow: 'auto' }}>
        {items.map((title, index) => (
          <ListItem
            key={`${title}-${index}`}
            disablePadding>
            <ListItemButton onClick={(event) => onClick({ title, index, event })}>
              <ListItemText id={`${title}-${index}`} primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}



export const MultipleListView = ({ items, active, onClick, height, className }: ListViewProps) => {
  return (
    <Paper>
      <List sx={{ height, overflow: 'auto' }}>
        {items.map((title, index) => (
          <ListItem
            key={`${title}-${index}`}
            disablePadding>
            <ListItemButton onClick={(event) => onClick({ title, index, event })}>
              <ListItemText id={`${title}-${index}`} primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}



const PlaceholderListView = ({ className, height }: { className?: string, height?: number | string }) => {
  return (
    <Paper>
      <List sx={{ height, overflow: 'auto' }}>
        {[6, 9, 4, 5, 11, 7, 8, 5].map(i => (
          <ListItem
            key={`skeleton-${i}`}
            disablePadding>
            <ListItemButton>
              <Skeleton variant="rectangular" width={45*i} height={18} sx={{my: 1}} />
              {/* <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> */}
              {/* <ListItemText id={`${title}-${index}`} primary={title} /> */}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}



export default function ListView({
  items = [],
  active = [],
  multiple = false,
  placeholder = false,
  onClick = () => { },
  height = 260,
  className = "",
}: ListViewProps) {
  return (
    <>
      {
        placeholder ?
          <PlaceholderListView
            className={className}
            height={height} /> : (
            multiple ?
              <MultipleListView
                items={items}
                active={active}
                onClick={onClick}
                height={height}
                className={className} /> :
              <SingleListView
                items={items}
                active={active}
                onClick={onClick}
                height={height}
                className={className} />
          )
      }
    </>
  )
}