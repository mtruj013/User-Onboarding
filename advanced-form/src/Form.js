import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as yup from "yup";

//step 2: create form schema?
const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required").matches(/(^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.{8,}))/, "Password must contain at least one uppercase character and one special character"),
    terms: yup.boolean().oneOf([true], "please agree to the terms of service"),
})




//step 1: create form name, email, pw, ToS, submit button
export default function Form(){

    const [buttonDisabled, setButtonDisabled] = useState(true);//state for whether or not the button is disabled


    const [formState, setFormState] = useState({ //set state for form inputs(how the page remembers?)
        name: "",
        email: "",
        password: "",
        terms: ""
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    })

   
    const [post, setPost] =  useState([]); //set state for post req

    useEffect(() =>{
        formSchema.isValid(formState)
        .then(valid =>{
              setButtonDisabled(!valid)
        })
        .catch(error => {
            console.log("didn't work :(", error)
        })
    }, [formState])

    //step 3: make a post request
    const formSubmit = event => {
        event.preventDefault();
        axios.post("https://reqres.in/api/users", formState)
        .then(response =>{
            setPost(response.data);
            console.log("response", post)
        })
        setFormState({
            name: "",
            email: "",
            password: "",
            terms: ""
        })
        .catch(error => {
            console.log("post failed", error)
        })
    }

    const validateChange = event =>{
        yup.reach(formSchema, event.target)
        .validate(event.target.value)
        .than(valid =>{
            setErrors({
                ...errors,
                [event.target.name]: ""
            });
        })
        .catch(error => {
            setErrors({
                ...errors,
                [event.target.name]: error.errors[0]
            });
        });
    };

    const inputChange = event =>{ //why?(we need a copy?)
        event.persist();
        const newFormData ={
            ...formState,
            [event.target.name]:
            event.target.type === "checkbox" ? event.target.checked : event.target.value
        };

        validateChange(event);
        setFormState(newFormData);
    }


    return (
        <form onSubmit={formSubmit}>
            <label htmlFor="name">
                Name:
                <input
                    type= "text"
                    name="name"
                    value={formState.name}
                    onChange={inputChange}
                />
                {errors.name.length > 0 ? <p>{errors.name}</p> : null}
            </label>

            <label htmlFor="email">
                Email:
                <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={inputChange}
                />
            </label>

            <label htmlFor="password">
                Password:
                <input
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={inputChange}
                />
            </label>

            <label htmlFor="terms">
                Terms of Service
                <input
                    type="checkbox"
                    name="terms"
                    value={formState.terms}
                    onChange={inputChange}
                />
            </label>

            <button>Submit</button>
        </form>
    )
}