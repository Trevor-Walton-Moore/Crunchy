import { useHistory } from 'react-router-dom';

const LOAD_PET = "pet/LOAD_PET";
const CREATE_PET = "pet/CREATE_PET";
const UPDATE_PET = "pet/UPDATE_PET";
const DESTROY_PET = "pet/DESTROY_PET";

// --- ACTIONS --- //
const loadPet = (pet) => ({
    type: LOAD_PET,
    pet,
});

const createPet = (pet) => ({
    type: CREATE_PET,
    pet,
});

const updatePet = (pet) => ({
    type: UPDATE_PET,
    pet,
});

export const destroyPet = () => ({
    type: DESTROY_PET,
});

// --- THUNKS --- //
export const fetchOnePet = (ownerId) => async (dispatch) => {
    const response = await fetch(`/api/pet/${ownerId}`, {
        method: "GET",
    });

    if (response.ok) {
        const pet = await response.json();
        dispatch(loadPet(pet));
        return pet;
    }
};

export const fetchCreatePet = (pet) => async (dispatch) => {
    const response = await fetch(`/api/pet`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pet),
    });

    if (response.ok) {
        const newPet = await response.json();
        dispatch(createPet(newPet.pet));
        // const history = useHistory();
        // history.push(`/pet/${newPet.id}`)
        return newPet;
    }
};

export const fetchUpdatePet = (updatedPet) => async (dispatch) => {
    const response = await fetch(`/api/pet/${updatedPet.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPet),
    });

    if (response.ok) {
        const updatedPet = await response.json();
        dispatch(updatePet(updatedPet));
        return updatedPet;
    }
};

export const fetchDestroyPet = (petId) => async (dispatch) => {
    const response = await fetch(`/api/pet/${petId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(destroyPet());
        return;
    }
};

export const removePet = () => async (dispatch) => {
    dispatch(destroyPet());
    return;
};

// --- INITIAL STATE --- //
// const normalize = (arr) => {
//     let obj = {};
//     arr.forEach((ele) => {
//         obj[ele.id] = ele;
//     });
//     return obj;
// };

const initialState = {};

// --- REDUCER --- //

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_PET:
        case CREATE_PET:
        case UPDATE_PET:
            const newState = {
                ...action.pet,
            };
            return newState;

        case DESTROY_PET: {
            let deleteState = {}
            return deleteState;
        }
        default:
            return state;
    }
}
