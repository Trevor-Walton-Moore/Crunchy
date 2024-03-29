import React, { useState, useEffect } from 'react';
import { NavLink, Redirect, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePet } from '../../../Context'


function CelebrationDayForm() {
    const history = useHistory()

    const { petCelebrationDay, setPetCelebrationDay,
        petName,
        petProfileIcon,
        petType
    } = usePet()

    if(!petType) {
        history.push('/pet/new')
    }

    const celebrateBirthday = () => setPetCelebrationDay('Birthday');
    const celebrateAdoptionDate = () => setPetCelebrationDay('Adoption Day');

    const handleSubmit = async (celebrationType) => {
        if (celebrationType === 'Birthday') {
            history.push('/pet/new/birthday-date')
        }
        else history.push('/pet/new/adoption-date')
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
        <div className='create-pet-main'>
            <div className='pet-form-container'>
                <div className='top-buttons'>

                    <span className='back-button'
                        onClick={() => history.push('/pet/new/pet-gender')}>
                        <i class="fa-solid fa-chevron-left"/>
                    </span>
                    <span className='back-button close-button'
                        onClick={() => history.push('/')}>
                        <i class="fa-solid fa-xmark"/>
                    </span>
                </div>
                <div className='chosen-icon-container'>
                    <img
                        className='icon-image'
                        src={petProfileIcon}
                        alt='pet-avatar' />
                </div>
                <div className='sub-text'>
                    Got it 👍
                </div>
                <div className='pet-prompt'>
                    {`When do you celebrate ${petName}?`}
                </div>
                <div className='sub-text'>
                    We want to celebrate with you!
                </div>
                <form className='create-pet-form'>
                    <button className='options-buttons' onClick={() => {
                        celebrateBirthday();
                        handleSubmit('Birthday');
                    }}>
                        Birthday
                    </button>
                    <button className='options-buttons' onClick={() => {
                        celebrateAdoptionDate();
                        handleSubmit('Adoption Day');
                    }}>
                        Adoption Day
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CelebrationDayForm;
