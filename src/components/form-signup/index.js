import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { formStage, formSignup } from '../../store/rootSlice'
import './styles.scss';

function FormUserSignup({ pageTitle, submitButtonText, previousButton }) {
  // redux
  const dispatch = useDispatch();

  // get Redux store values for formUserSignup
  const currentStage = useSelector(state => state.FormStage) // for previous button
  const formstageFirstName = useSelector(state => state.FormUserSignup.first_name)
  const formstageLastName = useSelector(state => state.FormUserSignup.last_name)  
  const formstagePhoneNumber = useSelector(state => state.FormUserPrivacy.phone_number)
  const formstageEmail = useSelector(state => state.FormUserSignup.email)
  
  // form values initial state
  const [formData, setFormData] = useState({
    first_name: formstageFirstName || "",
    last_name: formstageLastName || "",
    phone_number: formstagePhoneNumber || "",
    email: formstageEmail || ""
  })

  // form values onchange
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
        ...formData, 
        [name]: value
    })
  }

  // form validation check
  const [errors, setErrors] = useState({})
  const validate = (formData) => {
    let formErrors = {} // set form errors to none at start

    // Firstname
    if(!formData.first_name){
      formErrors.first_name = "First Name required";
    }

    // Phoneno
    const phonenoRegex = new RegExp(/^([+]\d{2})?\d{10}$/)
    if(formData.phone_number !=='' && !phonenoRegex.test(formData.phone_number)) {
      formErrors.phone_number = 'Minimum Phone Number length is 10';
    }
    
    // Email
    const emailRegex = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if(!formData.email || !emailRegex.test(formData.email)) {
      formErrors.email = 'Valid Email required';
    }
    return formErrors
  }
  
  const [isSubmitted, setIsSubmitted] = useState(false) // state for sent status
  // onsubmit
  const handleSubmit = (e) => {
    e.preventDefault(); // stop form submission
    setErrors(validate(formData)) // check errors
    setIsSubmitted(true) // update submit status
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitted) { // check if any form errors
        // update Redux Slice
        dispatch(
          formStage(2) // update formStage
        )
        dispatch(
          formSignup({ // update formSignup
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            email: formData.email
          })
        );
    }

  }, [formData, isSubmitted, dispatch, errors])
  // console.log("Errors: ", errors)
  // console.log("FormData: ", formData)

  return (
    <>
        <h2>{pageTitle || 'Signup'}</h2>
        <form name="form-signup" id="form-signup" onSubmit={(e) => handleSubmit(e)} >
        <p>
          <label htmlFor="first_name">First Name<span className="required-asterix">*</span></label>
          <input 
              type="text"
              id="first_name" 
              name="first_name" 
              autoComplete="name" 
              aria-label="first_name"
              aria-required="true"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange} />
        </p>
        {errors.first_name && <span className="error-message">{errors.first_name}</span>}

        
        <p>
          <label htmlFor="last_name">Last Name</label>
          <input 
              type="text"
              id="last_name" 
              name="last_name" 
              autoComplete="last_name" 
              aria-label="last_name"
              aria-required="false"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange} />
        </p>
        {errors.last_name && <span className="error-message">{errors.last_name}</span>}

        <p>
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="number"
            id="phone_number"
            name="phone_number"
            autoComplete="phone_number"
            aria-label="phone_number"
            aria-required="false"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange} />
        </p>
        {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}

        <p>
          <label htmlFor="email">Email Id<span className="required-asterix">*</span></label>
          <input 
              type="email" 
              id="email" 
              name="email"
              autoComplete="email" 
              aria-label="email"
              aria-required="true"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
          />
        </p>
        {errors.email && <span className="error-message">{errors.email}</span>}

        <p className="disclaimer-text"><span className="required-asterix">*</span> required fields</p>
        <div className="btn-array">
          {(previousButton) && 
            <p>
              <input type="submit" value={`Back`} onClick={() => dispatch(formStage(currentStage-1))} />
            </p>
          }
          <p>
            <input type="submit" value={ submitButtonText || 'Submit' } />
          </p>
        </div>
      </form>
    </>
  );
}

export default FormUserSignup;
