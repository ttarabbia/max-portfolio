import React from 'react'
import "./CarouselComp.css"

const CarouselComp = ({image, offset, len, idx, text, setModal}) => {
  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  return (
    <div className="carousel-comp" 
      style={{
      transform: `translate(${mod(offset, len) *  -105}%)`,
      transition: "0.5s",}}
      >
      {/* <h1>{offset}</h1> */}
      <img src={image} className="carousel-comp--img"/>
      <div className='carousel-comp--text' onClick={() => setModal(image)}>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default CarouselComp