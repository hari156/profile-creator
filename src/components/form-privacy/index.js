import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { formStage, formPrivacy } from '../../store/rootSlice'
import './styles.scss';

function FormUserPrivacy({ pageTitle, submitButtonText, previousButton }) {
  // redux
  const dispatch = useDispatch();

  // get Redux store values for formUserSignup
  const currentStage = useSelector(state => state.FormStage) // for previous button
  const formstageLiveInUsa = useSelector(state => state.FormUserPrivacy.liveinusa)
  const formstageGitProfile = useSelector(state => state.FormUserPrivacy.git_profile)
  const formstageAbout = useSelector(state => state.FormUserPrivacy.about)

  const [isChecked, setisChecked] = useState(formstageLiveInUsa || false); // toggle
  const [cv, setCv] = useState();
  const [cover_letter, setCoverLetter] = useState();
  // const [cvfileName, setCvFileName] = useState();
  // const [coverfileName, setCoverFileName] = useState();

  // form values initial state
  const [formData, setFormData] = useState({
    git_profile: formstageGitProfile || "",
    about: formstageAbout || "",
    liveinusa: formstageLiveInUsa || false
  })

  // form values onchange
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleCheckBoxChange = (e) => {
    setisChecked(!isChecked);
  }

  // form validation check
  const [errors, setErrors] = useState({})
  const validate = (formData) => {
    let formErrors = {} // set form errors to none at start

    // Git Profile
    if (!formData.git_profile) {
      formErrors.git_profile = "Git Profile required";
    }

    // About you
    if (!formData.about) {
      formErrors.about = "About you required";
    }

    return formErrors
  }

  const [isSubmitted, setIsSubmitted] = useState(false)
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
        formStage(3)
      )
      dispatch(
        formPrivacy({ // update formPrivacy
          liveinusa: isChecked, // update form checkbox status
          about: formData.about,
          git_profile: formData.git_profile,
          cv: cv,
          cover_letter: cover_letter,
          // cvfileName: cvfileName,
          // coverfileName: coverfileName
        })
      );
    }

  }, [formData, isSubmitted, isChecked, cv, cover_letter, dispatch, errors])
  // console.log("Page Errors: ", errors)
  // console.log("Page FormData: ", formData)

  const saveCvFile = (e) => {
    setCv(e.target.files[0]);
    // setCvFileName(e.target.files[0].name);
  };

  const saveCoverFile = (e) => {
    setCoverLetter(e.target.files[0]);
    // setCoverFileName(e.target.files[0].name);
  };

  return (
    <>
      <form name="form-privacy" id="form-privacy" onSubmit={(e) => handleSubmit(e)} >
        <p className="form-boxes">
          <input type="checkbox" id="liveinusa" name="liveinusa" onChange={handleCheckBoxChange} checked={isChecked} />
          <label htmlFor="liveinusa">Do you live in United States of America?</label>
        </p>

        <p>
          <label htmlFor="git_profile">Git profile</label>
          <input
            type="text"
            id="git_profile"
            name="git_profile"
            autoComplete="git_profile"
            aria-label="git_profile"
            aria-required="false"
            placeholder="Git profile"
            value={formData.git_profile}
            onChange={handleChange} />
        </p>
        {errors.git_profile && <span className="error-message">{errors.git_profile}</span>}

        <p className="upload-cv">
          <label>Upload CV</label>
          <input type="file" onChange={saveCvFile} />
        </p>

        <p className="upload-cover">
          <label>Cover Letter</label>
          <input type="file" onChange={saveCoverFile} />
        </p>

        <p className="about-container">
          <label htmlFor="about">About</label>
          <textarea id="about" name="about" rows="4" cols="50" aria-label="about" aria-required="false"
            value={formData.about} onChange={handleChange}></textarea>
        </p>
        {errors.about && <span className="error-message">{errors.about}</span>}

        <p className="disclaimer-text"><span className="required-asterix">*</span> required fields</p>
        <div className="btn-array">
          {(previousButton) &&
            <p><input type="submit" value={`Back`} onClick={() => dispatch(formStage(currentStage - 1))} /></p>
          }
          <p><input type="submit" value={submitButtonText || 'Submit'} /></p>
        </div>
      </form>
    </>
  );
}

export default FormUserPrivacy;