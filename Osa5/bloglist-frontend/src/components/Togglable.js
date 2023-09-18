import { useImperativeHandle, useState, forwardRef } from "react"
import PropTypes from "prop-types"

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const showAll = { display: visible ? "" : "none" }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      {visible && <div style={showAll}>{props.children}</div>}
      <button id="togglablebutton" onClick={toggleVisibility}>
        {(visible && "cancel") || props.buttonLabel}
      </button>
    </div>
  )
})

Togglable.displayName = "Togglable"

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable