import React from 'react'
import "./Intro.css"

const Intro = ({image}) => {
  return (
    <div className='intro'>
        <p className='intro--name intro--text'>Max Tarabbia</p>
        <p className='intro--desc intro--text'>Description of me goes here with some stuff like contact info</p>
        <a className="intro--email intro--text" href="mailto:maxtarabbia@gmail.com">My EEM-ale</a>
        <img className='intro--img' src={image}/>
        
    </div>
  )
}

export default Intro