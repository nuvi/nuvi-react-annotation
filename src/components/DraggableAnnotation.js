import React from "react"
import classnames from "classnames"
import { DraggableCore } from "react-draggable"
import PropTypes from "prop-types"

export default class Annotation extends React.Component {
  state = {
    dx: 0,
    dy: 0
  }

  dragged = false;

  componentWillMount() {
    this.setState({
      dx: this.props.dx,
      dy: this.props.dy
    })
  }

  getData() {
    return Object.assign({}, this.props, this.state)
  }

  dragEnd() {
    if (this.dragged && this.props.onDragEnd) {
      this.dragged = false;
      this.props.onDragEnd(this.getData())
    } else if (!this.dragged && this.props.onClick) {
      this.props.onClick(this.getData())
    }
  }

  dragStart() {
    if (this.props.onDragStart) {
      this.props.onDragStart(this.getData())
    }
  }

  dragNote(event, data) {
    this.dragged = true;
    this.setState(
      {
        dx: this.state.dx + data.deltaX,
        dy: this.state.dy + data.deltaY
      },
      () => {
        if (this.props.onDrag) this.props.onDrag(this.getData())
      }
    )
  }

  render() {
    const { x, y, nx, ny, events } = this.props

    const cleanedProps = Object.assign({}, this.props)
    delete cleanedProps.children

    cleanedProps.dx = this.state.dx;
    cleanedProps.dy = this.state.dy;

    if (nx !== undefined) cleanedProps.dx = nx - x
    if (ny !== undefined) cleanedProps.dy = ny - y

    const childrenWithProps = React.Children
      .toArray(this.props.children)
      .map(child =>
        React.cloneElement(child, {
          ...cleanedProps,
          ...child.props
        })
      )

    Object.keys(events).forEach(k => {
      events[k] = events[k].bind(this, this.props, this.state)
    })

    return (
      <DraggableCore
        handle=".annotation"
        defaultPosition={{ x: 0, y: 0 }}
        position={null}
        onStart={this.dragStart.bind(this)}
        onDrag={this.dragNote.bind(this)}
        onStop={this.dragEnd.bind(this)}
        defaultClassNameDragging="dragging"
      >
        <g
          className={classnames("annotation", this.props.className)}
          transform={`translate(${x}, ${y})`}
          {...events}
        >
          {childrenWithProps}
        </g>
      </DraggableCore>
    )
  }
}

Annotation.defaultProps = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  color: "grey",
  events: {}
}

Annotation.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  dx: PropTypes.number,
  dy: PropTypes.number,
  color: PropTypes.string,
  editMode: PropTypes.bool,
  events: PropTypes.object
}