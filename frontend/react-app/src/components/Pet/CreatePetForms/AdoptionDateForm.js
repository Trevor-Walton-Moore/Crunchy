import React, { useState, useEffect } from 'react';
import { NavLink, Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { usePet } from '../../../Context'
import { fetchCreatePet } from '../../../store/pet'

function AdoptionDateForm() {
    const history = useHistory()

    const dispatch = useDispatch()

    const { petAdoptionDate, setPetAdoptionDate,
        petType,
        petName,
        petBreed,
        petProfileIcon,
        petWeight,
        petGender,
        petCelebrationDay
    } = usePet()
    console.log(petAdoptionDate, "PET Adoption DATE before")

    const [type, setType] = useState(petType);
    const [name, setName] = useState(petName);
    const [breed, setBreed] = useState(petBreed);
    const [profileIcon, setProfileIcon] = useState(petProfileIcon);
    const [weight, setWeight] = useState(petWeight);
    const [gender, setGender] = useState(petGender);
    const [celebrationDay, setCelebrationDay] = useState(petCelebrationDay);
    const [adoptionDate, setAdoptionDate] = useState(petAdoptionDate);

    const updatePetAdoptionDate = (e) => {
        setAdoptionDate(e.target.value)
        setPetAdoptionDate(e.target.value)
    };

    const handleSubmit = async () => {

        const petDate = new Date(adoptionDate);
        const petMonth = (petDate.getMonth() + 1)
        const petDay = (petDate.getDate() + 1)
        const petYear = (petDate.getFullYear())
        const convertedPetDate = petMonth + "-" + petDay + "-" + petYear

        const payload = {
            type,
            name,
            breed,
            profileIcon,
            weight,
            gender,
            celebrationDay,
            adoptionDay: convertedPetDate
        }
        console.log('the REEAL payload', payload)
        dispatch(fetchCreatePet(payload))
        history.push('/pet/new/welcome')
    }

    const refreshCheck = (e) => {
        e.preventDefault();
        e.returnValue = "";
    };

    useEffect(() => {
        window.addEventListener("beforeunload", refreshCheck);
        return () => {
            window.removeEventListener("beforeunload", refreshCheck);
        };
    }, []);

    return (
        <>
            <div className='pet-form-container'>
                <div className='top-buttons'>
                    <span className='back-button'
                        onClick={() => history.push('/pet/new/celebration-type')}>
                        {'<'}
                    </span>
                </div><div className='chosen-icon-container'>
                    <img
                        className='icon-image'
                        src={petProfileIcon}
                        alt='pet-avatar' />
                </div>
                <div className='sub-text'>
                    Get ready for a gotcha day surprise! 🎉
                </div>
                <div className='pet-prompt'>
                    {`When is ${petName}'s Adoption date?`}
                </div>
                <div className='sub-text'>
                    It's OK to enter an approximate date.

                </div>
                <form className='create-pet-form'>
                    <input
                        required
                        placeholder='Adoption date (MM/DD/YYYY)'
                        className="input"
                        type='date'
                        value={petAdoptionDate}
                        onChange={updatePetAdoptionDate} />
                    <button
                        className='continue-button'
                        onClick={handleSubmit}>
                        Continue
                    </button>
                </form>
            </div>
        </>
    );
}

export default AdoptionDateForm;
