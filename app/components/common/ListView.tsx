import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import ListGroup from 'react-bootstrap/ListGroup'
import Placeholder from 'react-bootstrap/Placeholder'
import React from 'react'


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
    <ListGroup className={`${className} overflow-auto`} style={{ height }}>
      {items.map((title, index) => (
        <ListGroup.Item
          action
          key={index}
          active={active == title}
          onClick={(event) => onClick({ title, index, event })}>
          {title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}



export const MultipleListView = ({ items, active, onClick, height, className }: ListViewProps) => {
  return (
    <ListGroup className={`${className} overflow-auto`} style={{ height }}>
      {items.map((title, index) => (
        <ListGroup.Item
          action
          key={index}
          variant={active && active.includes(title) ? 'primary' : ''}
          onClick={(event) => onClick({ title, index, event })}>
          {title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}



const PlaceholderListView = ({ className, height }: { className?: string, height?: number | string }) => {
  return (
    <ListGroup className={`${className} overflow-auto`} style={{ height }}>
      <Placeholder as={ListGroup.Item} animation="glow">
        <Placeholder xs={6} />
      </Placeholder>
      <Placeholder as={ListGroup.Item} animation="glow">
        <Placeholder xs={9} />
      </Placeholder>
      <Placeholder as={ListGroup.Item} animation="glow">
        <Placeholder xs={4} />
      </Placeholder>
      <Placeholder as={ListGroup.Item} animation="glow">
        <Placeholder xs={5} />
      </Placeholder>
      <Placeholder as={ListGroup.Item} animation="glow">
        <Placeholder xs={11} />
      </Placeholder>
      <Placeholder as={ListGroup.Item} animation="glow">
        <Placeholder xs={7} />
      </Placeholder>
      <Placeholder as={ListGroup.Item} animation="glow">
        <Placeholder xs={8} />
      </Placeholder>
      <Placeholder as={ListGroup.Item} animation="glow">
        <Placeholder xs={5} />
      </Placeholder>
    </ListGroup>
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