import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
    return (
        <div className='center ma pt4'>
            <div className='relative'>
                <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
                {box && (
                    <div className='bounding-box' style={{
                        top: box.topRow, 
                        right: box.rightCol, 
                        bottom: box.bottomRow, 
                        left: box.leftCol
                    }}></div>
                )}
            </div>
        </div>
    )
};

export default FaceRecognition;