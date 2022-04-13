import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useSelector } from 'react-redux'
import IMGgreentick from '../../assets/imgs/green-tick.svg';
import './styles.scss';

function FormUserResult({ pageTitle, successMessage }) {
  // Get Redux Form State and output to JSON format
  const state = useSelector(state => state)
  const stateOutput = (`Form Data: ${JSON.stringify(state, null, 2)}`)
  const URI = 'https://jsonplaceholder.typicode.com/posts';

  const [responsedata, setResponseData] = useState();
  const [responseStatus, setResponseStatus] = useState();

  useEffect(() => {
    sendFormDetails();
  },[]);


  const sendFormDetails = async (e) => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(URI, stateOutput, { responseType: 'arraybuffer' }).then(response => {
        setResponseData(response); // response.data
        setResponseStatus(true);
      });
    } catch (error) {
      console.warn(error);
      setResponseStatus(false);
    }
  };

  return (
    <>
      {(responseStatus) ? (
        <div className="form-complete">
          <h2>{pageTitle || 'Confirmation'}</h2>
          <img className="fade-in-image" src={IMGgreentick} alt={successMessage || 'Success!'} />
          <p>{successMessage || 'Thank you, Please check your Email!'}</p>
        </div>) : (
          <div className="form-complete">
            <p className="error-message">Issue in Uploading the data. Please retry after sometime!</p>
          </div>
        )}

      {/* Debug Response */}
      {/* <div className="code-output">
        <pre>{stateOutput}</pre>
      </div> */}
    </>
  );
}

export default FormUserResult;
