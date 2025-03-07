import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes = [] }) => {
    return (
        <div className='center ma pt4'>
            <div className='relative'>
                {imageUrl ? (
                    <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
                ) : null}
                {Array.isArray(boxes) && boxes.map((box, i) => (
                    <div 
                        key={i}
                        className='bounding-box' 
                        style={{
                            top: box.topRow, 
                            right: box.rightCol, 
                            bottom: box.bottomRow, 
                            left: box.leftCol
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
};

export default FaceRecognition;