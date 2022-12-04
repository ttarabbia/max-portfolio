import React from 'react'
import "./CarouselComp.css"

const CarouselComp = ({image, offset, len, idx}) => {
  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  return (
    <div className="carousel-comp" style={{
      transform: `translate(${mod(offset, len) *  -105}%)`,
      transition: "0.5s",
      }}>
      {/* <h1>{offset}</h1> */}
      <img src={image} className="carousel-comp--img"/>
    </div>
  )
}

export default CarouselComp