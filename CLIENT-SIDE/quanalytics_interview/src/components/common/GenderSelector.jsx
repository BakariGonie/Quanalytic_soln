import React, { forwardRef, useImperativeHandle, useState } from 'react';

const GenderSelector = forwardRef(({ onGenderChange, isResetButtonVisible }, ref) => {
  const [selectedGender, setSelectedGender] = useState('');

  const handleGenderChange = (event) => {
    const gender = event.target.value;
    setSelectedGender(gender);
    onGenderChange(gender); // Propagate the selected gender to the parent component
  };

  const resetGender = () => {
    setSelectedGender('');
  };


  // Expose the resetGender function directly through the ref
    useImperativeHandle(ref, () => ({
      resetGender: () => resetGender(),
    }));

  return (
    <div className='mb-3 row'>
      <label htmlFor="gender" className='col-sm-1 col-form-label'>Gender:</label>
      <select id="gender" value={selectedGender} onChange={handleGenderChange} className='form-select'>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    { /* {selectedGender && <p>Selected Gender: {selectedGender}</p>}*/}
    {isResetButtonVisible && (
        <button type="button"  onClick={resetGender}>
          Reset Gender
        </button>
      )}
    </div>
  );
});

export default GenderSelector;
