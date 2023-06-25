import React, { useState } from 'react';
import './App.css';
import Dropzone from 'react-dropzone';
import { Loader } from './loader/Loader';
import { DropContainer } from './DropContainer';
import { Done } from './loader/Checker';
import { Cross } from './loader/Error'
import axios from 'axios';

const Modal = ({ isOpen, onClose, children, clear }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

function App() {

  const [image, setImage] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const [disease, setDisease] = useState(null);

  const [isLeafCheckComplete, setIsLeafCheckComplete] = useState(false);

  const [isCottonLeaf, setIsCottonLeaf] = useState(false);

  const [isPredicting, setIsPredicting] = useState(false);

  const [isPredictionCompleted, setIsPredictionCompleted] = useState(false);

  const [showLeafDialog, setShowLeafDialog] = useState();

  const PORT = process.env.REACT_APP_API_URL;

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setImage('');
    setIsCottonLeaf(false);
    setIsLeafCheckComplete(false);
    setIsPredicting(false);
    setIsPredictionCompleted(false);
    setShowLeafDialog();
    setIsOpen(false);
  };

  const handleFileDrop = async (acceptedFiles, rejectedFiles) => {

    const formData = new FormData();
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));

    setImage(imageFiles[0]);
    if (imageFiles.length > 0) {
      formData.append('image', imageFiles[0]);
      openModal();
      try{
        const url_classify = `${PORT}/classify`;
        await axios.post(url_classify, formData, {
          headers:{
            'Content-Type' : 'multipart/form-data',
          },
        }).then(async (response) => {
          setIsLeafCheckComplete(true);

          if(response.data.classification === "Cotton Leaf"){
            setIsCottonLeaf(true);
            setIsPredicting(true);
            try {
              const url_predict = `${PORT}/predict`;
              await axios.post(url_predict, formData, {
                headers:{
                  'Content-Type' : 'multipart/form-data',
                },
              }).then((response) => {
                setIsPredictionCompleted(true);
                setDisease(response.data.prediction);
              })
            } catch (error) {
              console.log(error)
            }
          }
          else{
            setShowLeafDialog(true);
          }
        });
      }catch (error){
        console.log(error)
      }

    } else {
      alert('Only image files are allowed!');
    }
  };

  return (
    <div className="App">
      <div className="left">
        <div className="wrapper">
          <h1>COTTON</h1>
          <h1>LEAF</h1>
          <h1>DISEASE</h1>
          <h1>PREDICTION</h1>
        </div>
      </div>
      <div className='right'>
        <div className='upload-container'>
          <div class="container">
            <div class="box">
              <Dropzone onDrop={handleFileDrop} multiple={false}>
                  {
                    ({getRootProps, getInputProps}) => (
                      <div {...getRootProps()}>
                          <input {...getInputProps()} accept="image/*"></input>
                          <DropContainer/>
                      </div>
                    )
                  }
              </Dropzone>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
          <div className='aline'>
            <h4>Checking for Leaf Type</h4>
            {isLeafCheckComplete? (
              isCottonLeaf? (<Done/>) : (<Cross/>)
            ) : (<Loader/>)}
          </div>
          {isPredicting ? (
          <div className='aline'>
          <h4>Prediction</h4>
            {isPredictionCompleted? (
              <>
                <>{disease}</>
                <img src={URL.createObjectURL(image)} height={145} width={145} alt='Retina'/>
              </>
            ):(
              <Loader/>
            )}
          </div>) : (<></>)}
          {showLeafDialog?
          (<div className='aline'>
            <p>
              Please Upload a Picture Of a Cotton Leaf..
            </p>
          </div>) : (<></>)
          }
      </Modal>
    </div>
  );
}

export default App;
