import React from 'react'

export default props => {
  return (
    <section className="Console" {...props}>
      <pre className="Code">
        {props.children}
      </pre>
    </section>
  )
}
