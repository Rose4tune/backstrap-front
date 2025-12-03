import React from 'react'
import ReactOverlay from 'react-overlays/Overlay'
import { Placement } from 'react-overlays/usePopper'
import merge from 'lodash/merge'
import noop from 'lodash/noop'
import clsx from 'clsx'

export const OverlayPosition = {
  CENTER: 'center',
  TOP: 'top',
  TOP_LEFT: 'topLeft',
  TOP_RIGHT: 'topRight',
  RIGHT: 'right',
  RIGHT_TOP: 'rightTop',
  RIGHT_BOTTOM: 'rightBottom',
  BOTTOM: 'bottom',
  BOTTOM_LEFT :'bottomLeft',
  BOTTOM_RIGHT: 'bottomRight',
  LEFT: 'left',
  LEFT_TOP: 'leftTop',
  LEFT_BOTTOM: 'leftBottom',
} as const

interface OverlayProps {
  show?: boolean
  container?: any
  target: any
  style?: any
  placement?: typeof OverlayPosition[keyof typeof OverlayPosition]
  marginX?: number
  marginY?: number
  transition?: boolean
  children: React.ReactNode
  onHide?: () => void
  rootClose?: boolean
  backgroundBlur?: boolean
}

const Overlay = ({
  show = false,
  target,
  children,
  onHide = noop,
  rootClose = false,
  container,
  backgroundBlur,
  placement = OverlayPosition.CENTER,
  marginX = 0,
  marginY = 0,
}: OverlayProps) => {

  // useEffect(() => {
  //   if (container.current) {
  //     container.current.onclick = () => { onHide() }
  //   }
  // }, [])

  return (
    <ReactOverlay
      show={show}
      container={container}
      target={target}
      onHide={onHide}
      rootClose={rootClose}
    >
      {() => (
        <>
         { rootClose && 
          <div
              className={clsx(
                'absolute top-0 left-0 w-screen h-screen',
                backgroundBlur && 'bg-[#000000]/20'
              )}
              onClick={onHide}
            />
          }
          <div
            style={getStyle(target, { placement, marginX, marginY })}
          >
            {children}
          </div>
        </>
      )}
    </ReactOverlay>
  )
}

export default Overlay

export const getStyle = (targetNode: HTMLElement, options: any) => {
  const {
    style = {},
    placement = OverlayPosition.CENTER,
    marginX = 0,
    marginY = 0,
  } = options
  const combinedStyle = { ...style }

  if (targetNode) {
    // 타겟, 엘리먼트의 인접면에 대한 포지션
    const topTopY = `translateY(${marginY}px)`
    const topBottomY = `translateY(${-marginY}px) translateY(-100%)`
    const bottomTopY = `translateY(${targetNode.getBoundingClientRect().height + marginY}px)`
    const bottomBottomY = `translateY(${targetNode.getBoundingClientRect().height - marginY}px) translateY(-100%)`
    const leftLeftX = `translateX(${marginX}px)`
    const leftRightX = `translateX(${-marginX}px) translateX(-100%)`
    const rightLeftX = `translateX(${targetNode.getBoundingClientRect().width + marginX}px)`
    const rightRightX = `translateX(${targetNode.getBoundingClientRect().width - marginX}px) translateX(-100%)`
    let translateX = `translateX(${(targetNode.getBoundingClientRect().width / 2) + marginX}px) translateX(-50%)`
    let translateY = `translateY(${(targetNode.getBoundingClientRect().height / 2) + marginY}px) translateY(-50%)`

    if (placement) {
      // pre position
      switch (placement) {
        case OverlayPosition.TOP:
        case OverlayPosition.TOP_LEFT:
        case OverlayPosition.TOP_RIGHT:
          translateY = topBottomY
          break
        case OverlayPosition.RIGHT:
        case OverlayPosition.RIGHT_TOP:
        case OverlayPosition.RIGHT_BOTTOM:
          translateX = rightLeftX
          break
        case OverlayPosition.BOTTOM:
        case OverlayPosition.BOTTOM_LEFT:
        case OverlayPosition.BOTTOM_RIGHT:
          translateY = bottomTopY
          break
        case OverlayPosition.LEFT:
        case OverlayPosition.LEFT_TOP:
        case OverlayPosition.LEFT_BOTTOM:
          translateX = leftRightX
          break
      }
      // post position
      switch (placement) {
        case OverlayPosition.RIGHT_TOP:
        case OverlayPosition.LEFT_TOP:
          translateY = topTopY
          break
        case OverlayPosition.TOP_RIGHT:
        case OverlayPosition.BOTTOM_RIGHT:
          translateX = rightRightX
          break
        case OverlayPosition.RIGHT_BOTTOM:
        case OverlayPosition.LEFT_BOTTOM:
          translateY = bottomBottomY
          break
        case OverlayPosition.TOP_LEFT:
        case OverlayPosition.BOTTOM_LEFT:
          translateX = leftLeftX
          break
      }
    }

    merge(combinedStyle, {
      position: 'absolute',
      top: targetNode.getBoundingClientRect().top - targetNode.clientTop,
      left: targetNode.getBoundingClientRect().left - targetNode.clientLeft,
      transform: `${translateX} ${translateY}`,
      willChange: 'left, top',
    })
  }

  return combinedStyle
}
