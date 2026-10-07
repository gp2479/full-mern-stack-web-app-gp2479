import { useState, useEffect } from 'react'
import axios from 'axios'
import './AboutUs.css'

/**
 * A React component that represents the About Us page of the app.
 * The page content is loaded from the back-end /about route.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const AboutUs = props => {
  const [about, setAbout] = useState(null)
  const [error, setError] = useState('')

  // fetch the About Us content from the back-end once, when the page first loads
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_HOSTNAME}/about`)
      .then(response => {
        // axios bundles up all response data in response.data property
        setAbout(response.data)
      })
      .catch(err => {
        const errMsg = JSON.stringify(err, null, 2) // convert error object to a string so we can simply dump it to the screen
        setError(errMsg)
      })
  }, [])

  return (
    <div className="AboutUs">
      <h1>About Us</h1>
      {error && <p className="AboutUs-error">{error}</p>}
      {about && (
        <>
          <img src={about.imageUrl} alt={about.name} />
          <h2>{about.name}</h2>
          {about.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </>
      )}
    </div>
  )
}

// make this component available to be imported into any other file
export default AboutUs