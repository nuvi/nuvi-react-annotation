import React from "react"
import Annotation from "./Annotation"
import classnames from "classnames"

export default class EditableAnnotation extends React.Component {
  constructor () {
    super();
    this.state = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0
    }
  }

  componentWillMount() {
    this.setState({
      x: this.props.x,
      y: this.props.y,
      dx: this.props.dx,
      dy: this.props.dy
    })
  }

  getData() {
    return Object.assign({}, this.props, this.state)
  }

  dragEnd() {
    if (this.props.onDragEnd) {
      this.props.onDragEnd(this.getData())
    }
  }

  dragStart() {
    if (this.props.onDragStart) {
      this.props.onDragStart(this.getData())
    }
  }

  dragSubject(event, data) {
    this.setState(
      {
        x: this.state.x + (data.deltaX * this.props.scale),
        y: this.state.y + (data.deltaY * this.props.scale)
      },
      () => {
        if (this.props.onDrag) this.props.onDrag(this.getData())
      }
    )
  }

  dragSubjectSettings(event, data) {
    this.setState(data, () => {
      if (this.props.onDrag) this.props.onDrag(this.getData())
    })
  }

  dragNote(event, data) {
    this.setState(
      {
        dx: this.state.dx + (data.deltaX * this.props.scale),
        dy: this.state.dy + (data.deltaY * this.props.scale)
      },
      () => {
        if (this.props.onDrag) this.props.onDrag(this.getData())
      }
    )
  }

  render() {
    const cleanedProps = Object.assign({}, this.props, {
      ...this.state,
      dragSubject: this.dragSubject.bind(this),
      dragNote: this.dragNote.bind(this),
      dragSubjectSettings: this.dragSubjectSettings.bind(this),
      dragEnd: this.dragEnd.bind(this),
      dragStart: this.dragStart.bind(this),
      editMode: true,
      className: classnames(this.props.className, "editable")
    })

    return <Annotation {...cleanedProps} />
  }
}

EditableAnnotation.defaultProps = {
  scale: 1
}

