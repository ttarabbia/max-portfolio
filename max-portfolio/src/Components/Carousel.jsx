import React from 'react'
import { useState, useEffect} from 'react'
import "./Carousel.css"
import CarouselComp from './CarouselComp'


const Carousel = ({catName, images}) => {

    const [offset, setOffset] = useState(0)
    const [seconds, setSeconds] = useState(0)

    const len = images.length-1
    console.log(offset)

    useEffect(() => {
      let interval = null;
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
        setOffset(offset => offset+1);
      }, 4000);
      return () => clearInterval(interval);
    }, [seconds])
    

  return (
    <>
        <div className="carousel">
            <h1 className='carousel--title'>{catName}</h1>
            <p className="carousel--prev-arrow carousel--arrow" onClick={() => setOffset(offset => offset-1)}>&#10094;</p>

            <p className="carousel--next-arrow carousel--arrow" onClick={() => setOffset(offset => offset+1)}>&#10095;</p>
            <div className='carousel--images'>
                {images?.map((image, idx) => <CarouselComp key={idx} image={image} offset={offset} idx={idx} len={len}/>)}      
            </div>
        </div>
    </>
  )
}

export default Carousel