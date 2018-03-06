/* eslint-disable no-unused-vars */
import React from "react"
/* eslint-enable no-unused-vars */
import Circle from "viz-annotation/lib/Subject/circle"
import Subject from "./Subject"
import PropTypes from "prop-types"

export default class SubjectCircle extends Subject {
  getComponents({
    radius = 20,
    innerRadius,
    outerRadius,
    radiusPadding,
    editMode,
    scale = 1
  }) {
    const components = Circle({
      radius,
      radiusPadding,
      innerRadius,
      outerRadius,
      editMode
    })

    components.handleKeys = { radius, innerRadius, outerRadius }
    components.handleFunction = (h, data) => {
      return {
        [h.key]: components.handleKeys[h.key] + (data.deltaX * this.props.scale) * Math.sqrt(2)
      }
    }
    return components
  }
}

SubjectCircle.propTypes = {
  radius: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  radiusPadding: PropTypes.number,
  editMode: PropTypes.bool,
  scale: PropTypes.number
}
