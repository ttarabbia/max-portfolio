import React from 'react'
import "./Modal.css"

const Modal = ({img, setModal}) => {
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