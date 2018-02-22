import React from "react"
import classnames from "classnames"
import { DraggableCore } from "react-draggable"
import PropTypes from "prop-types"

export default class Annotation extends React.Component {
  constructor () {
    super();
    this.state = {
      dx: 0,
      dy: 0,
    }
    this.dragged = false;
    this.bbox = {};
  }

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
      if (this.props.bounds) {
        this.setState({
          dx: this.getXOffset(this.state.dx),
          dy: this.getYOffset(this.state.dy)
        }, () => {
          this.props.onDragEnd(this.getData())
        })
      } else {
        this.props.onDragEnd(this.getData())
      }
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

  getXOffset (deltaX) {
    const { bounds, x } = this.props;
    const bbox = this.bbox;
    const xPos = x + deltaX;
    if (xPos <= bbox.width) {
      return (bbox.width - this.props.x) + 1;
    } else if (xPos >= bounds.width) {
      return bounds.width - x;
    }
    return deltaX;
  }

  getYOffset (deltaY) {
    const { bounds } = this.props;
    const bbox = this.bbox;
    if (deltaY >= 0) {
      return -1;
    } else if (Math.abs(deltaY) >= (bounds.height - bbox.height)) {
      return -(bounds.height - bbox.height);
    }
    return deltaY;
  }

  onNoteSize(bbox) {
    this.bbox = bbox;
  }

  render() {
    const { x, y, nx, ny, events, bounds } = this.props

    const cleanedProps = Object.assign({}, this.props)
    delete cleanedProps.children

    cleanedProps.dx = this.state.dx;
    cleanedProps.dy = this.state.dy;
    cleanedProps.onNoteSize = this.onNoteSize.bind(this);

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
        bounds={ bounds }
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
  events: {},
  bounds: undefined
}

Annotation.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  dx: PropTypes.number,
  dy: PropTypes.number,
  color: PropTypes.string,
  editMode: PropTypes.bool,
  events: PropTypes.object,
  bounds: PropTypes.oneOfType([
     PropTypes.shape({
      height: PropTypes.number,
      left: PropTypes.number,
      top: PropTypes.number,
      width: PropTypes.number,
     })
  ])
}
