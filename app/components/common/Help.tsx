import { ReactElement } from 'react';
import Button from 'react-bootstrap/Button'
import { Placement } from 'react-bootstrap/esm/types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { BiHelpCircle } from 'react-icons/bi'

type PropsType = {
  children: any,
  title?: string | null,
  placement?: Placement,
  className?: string
}

export default function Help({
  children,
  title = null,
  placement = 'auto',
  className = ''
}: PropsType) {
  const popover = (
    <Popover id="help-popover">
      {title && <Popover.Header as="h3">{title}</Popover.Header>}
      <Popover.Body>
        {children}
      </Popover.Body>
    </Popover>
  )

  return (
    <>
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement={placement}
        overlay={popover}>
        <Button
          variant="link"
          className={`p-0 d-inline-flex align-items-center ${className}`}>
          <BiHelpCircle size={20} />
        </Button>
      </OverlayTrigger>
    </>
  )
}