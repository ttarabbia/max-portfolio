import React from 'react'
import { useState, useEffect} from 'react'
import "./Carousel.css"
import CarouselComp from './CarouselComp'


const Carousel = ({catName, images, setModal}) => {


  //https://stackoverflow.com/questions/70442770/infinite-scrolling-carousel-css-only
  //https://www.reddit.com/r/webdev/comments/v1rjlk/how_do_nike_and_apple_make_such_smooth_and_touch/

    const [offset, setOffset] = useState(0)
    const [seconds, setSeconds] = useState(0)

    const len = images.length-1

    useEffect(() => {
      let interval = null;
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
        setOffset(offset => offset+1);
      }, 6000);
      return () => clearInterval(interval);
    }, [seconds])
    

  return (
    <>
        <div className="carousel">
            <h1 className='carousel--title'>{catName}</h1>
            <p className="carousel--prev-arrow carousel--arrow" onClick={() => setOffset(offset => offset-1)}>&#10094;</p>

            <p className="carousel--next-arrow carousel--arrow" onClick={() => setOffset(offset => offset+1)}>&#10095;</p>
            <div className='carousel--images'>
                {images?.map((image, idx) => <CarouselComp key={idx} setModal={setModal} image={image["image"]} text={image["text"]} offset={offset} idx={idx} len={len}/>)}      
            </div>
        </div>
    </>
  )
}

export default Carousel