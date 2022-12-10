import React, {useEffect} from 'react'
import "./Modal.css"

const Modal = ({img, setModal}) => {

  useEffect(() => {
    const handleEsc = (event) => {
       if (event.keyCode === 27) {
        setModal(null)
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);


  return (
    <div className='modal'>
        <div className='modal--container'>
            <div className='modal--inner-container'>
                <button className='modal--exit' onClick={()=> setModal(null)}> X </button>
                <img className='modal--img' src={img} />
            </div>
        </div>
    </div>
  )
}

export default Modal