import React from "react"
import Annotation from "./Annotation"
import EditableAnnotation from "./EditableAnnotation"
import ConnectorLine from "./Connector/ConnectorLine"
import ConnectorElbow from "./Connector/ConnectorElbow"
import ConnectorCurve from "./Connector/ConnectorCurve"
import ConnectorEndDot from "./Connector/ConnectorEndDot"
import ConnectorEndArrow from "./Connector/ConnectorEndArrow"
import DefaultSubject from "./Subject/Subject"
import SubjectCircle from "./Subject/SubjectCircle"
import SubjectBadge from "./Subject/SubjectBadge"
import SubjectBracket from "./Subject/SubjectBracket"
import BracketNote from "./Note/BracketNote"
import SubjectRect from "./Subject/SubjectRect"
import SubjectThreshold from "./Subject/SubjectThreshold"
import SubjectCustom from "./Subject/SubjectCustom"
import Note from "./Note/Note"
import classnames from "classnames"

const getAnnotationType = editMode =>
  editMode ? EditableAnnotation : Annotation

const annotationMapper = (
  props,
  Connector,
  NoteDefaultProps = {},
  Subject = DefaultSubject,
  SubjectDefaultProps = {},
  NoteType = Note
) => {
  const {
    disable = [],
    connector,
    note,
    subject,
    x,
    y,
    dx,
    dy,
    nx,
    ny,
    scale,
    color,
    className,
    onDrag,
    onDragStart,
    onDragEnd,
    editMode,
    events
  } = props
  const CONNECTORS = {
    type: {
      curve: ConnectorCurve,
      line: ConnectorLine,
      elbow: ConnectorElbow
    },
    end: {
      dot: ConnectorEndDot,
      arrow: ConnectorEndArrow
    }
  }

  let ConnectorType, ConnectorEndType
  if (disable.indexOf("connector") === -1) {
    ConnectorType = (connector && CONNECTORS.type[connector.type]) || Connector
    ConnectorEndType = connector && CONNECTORS.end[connector.end]
  }

  const AnnotationType = getAnnotationType(props.editMode)
  return (
    <AnnotationType
      x={x}
      y={y}
      dx={dx}
      dy={dy}
      nx={nx}
      ny={ny}
      scale={scale}
      color={color}
      className={className}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      editMode={editMode}
      {...SubjectDefaultProps}
      {...subject}
      events={events}
    >
      {ConnectorType && (
        <ConnectorType {...connector}>
          {ConnectorEndType && <ConnectorEndType />}
        </ConnectorType>
      )}
      {Subject && disable.indexOf("subject") === -1 && <Subject />}
      {note &&
        disable.indexOf("note") === -1 && (
          <NoteType {...NoteDefaultProps} {...note} />
        )}
    </AnnotationType>
  )
}

export function AnnotationLabel(props) {
  const className = classnames("label", props.className)
  return annotationMapper({ ...props, className }, ConnectorLine, {
    align: "middle"
  })
}

export function AnnotationCallout(props) {
  const className = classnames("callout", props.className)
  return annotationMapper({ ...props, className }, ConnectorLine, {
    lineType: "horizontal"
  })
}

export function AnnotationCalloutElbow(props) {
  const className = classnames("callout elbow", props.className)
  return annotationMapper({ ...props, className }, ConnectorElbow, {
    lineType: "horizontal"
  })
}

export function AnnotationCalloutCurve(props) {
  const className = classnames("callout curve", props.className)
  return annotationMapper({ ...props, className }, ConnectorCurve, {
    lineType: "horizontal"
  })
}

export function AnnotationCalloutCircle(props) {
  const className = classnames("callout circle", props.className)
  return annotationMapper(
    { ...props, className },
    ConnectorElbow,
    { lineType: "horizontal" },
    SubjectCircle,
    { radius: 20 }
  )
}

export function AnnotationCalloutRect(props) {
  const className = classnames("callout rect", props.className)
  return annotationMapper(
    { ...props, className },
    ConnectorElbow,
    { lineType: "horizontal" },
    SubjectRect,
    { width: 100, height: 100 }
  )
}

export function AnnotationXYThreshold(props) {
  const className = classnames("callout xythreshold", props.className)
  return annotationMapper(
    { ...props, className },
    ConnectorElbow,
    { lineType: "horizontal" },
    SubjectThreshold
  )
}

export function AnnotationBadge(props) {
  const className = classnames("badge", props.className)
  return annotationMapper(
    { disable: ["connector", "note"], ...props, className },
    null,
    null,
    SubjectBadge
  )
}

export function AnnotationBracket(props) {
  const className = classnames("bracket", props.className)
  return annotationMapper(
    { disable: ["connector"], ...props, className },
    null,
    null,
    SubjectBracket,
    { depth: 20 },
    BracketNote
  )
}

export function AnnotationCalloutCustom(props) {
  const className = classnames("callout custom", props.className)
  return annotationMapper(
    { ...props, className },
    ConnectorElbow,
    { lineType: "horizontal" },
    SubjectCustom
  )
}
