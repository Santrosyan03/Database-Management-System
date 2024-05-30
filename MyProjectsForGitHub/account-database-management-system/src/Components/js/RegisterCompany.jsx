import React, { useState } from 'react';
import '../css/Register.css';
import { getAllCountries } from '../information/countries.js';
import cities from "../information/cities.json";
import Select from "react-select";
import PhoneInput from 'react-phone-input-2';
import { getAllIndustries } from "../information/industries";

const RegisterCompany = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPersonFullName: '',
        country: '',
        city: '',
        phoneNumber: '',
        industry: '',
        email: '',
        password: '',
        reWritePassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const clearFormData = () => {
        setFormData({
            companyName: '',
            contactPersonFullName: '',
            country: '',
            city: '',
            phoneNumber: '',
            industry: '',
            email: '',
            password: '',
            reWritePassword: ''
        });
    };

    const passwordsMatch = () => {
        return formData.password === formData.reWritePassword;
    };

    const isPasswordInCorrectType = () => {
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(formData.password);
    };

    const isAllFieldsFilledExceptPassword = () => {
        return formData.companyName !== "" &&
            formData.contactPersonFullName !== "" &&
            formData.country !== "" &&
            formData.city !== "" &&
            formData.phoneNumber !== "" &&
            formData.industry !== "" &&
            formData.email !== "";
    };

    const sendPostRequest = async () => {
        try {
            const response = await fetch('/companies/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            return response.json();
        } catch (error) {
            throw new Error(`Network error: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordsMatch()) {
            alert("Passwords do not match");
            return;
        }

        if (!isPasswordInCorrectType()) {
            alert("Password should be at least 8 characters long and include at least one number, one letter (uppercase and lowercase), and one symbol");
            return;
        }

        if (!isAllFieldsFilledExceptPassword()) {
            alert("Make sure that all fields are filled!");
            return;
        }

        try {
            const result = await sendPostRequest();
            console.log(result);
            alert("Sign up successful!");
            clearFormData();
        } catch (error) {
            console.error('Error:', error);
            alert(`Sign up failed: ${error.message}`);
        }
    };

    const redirectToLogin = () => {
        window.location.href = '/companies/login';
    };

    const handleCountryChange = (selectedOption) => {
        const country = selectedOption ? selectedOption.value : '';
        const cityOptions = selectCityOptions(country);
        const randomCity = cityOptions.length > 0 ? cityOptions[Math.floor(Math.random() * cityOptions.length)].value : '';

        setFormData({
            ...formData,
            country: country,
            city: randomCity,
            phoneNumber: country ? formData.phoneNumber : ''
        });
    };

    const handleCityChange = (selectedOption) => {
        setFormData({
            ...formData,
            city: selectedOption ? selectedOption.value : ''
        });
    };

    const handleIndustryChange = (selectedOption) => {
        const industry = selectedOption ? selectedOption.value : '';
        setFormData({
            ...formData,
            industry: industry
        });
    };

    const handlePhoneChange = (value) => {
        setFormData({
            ...formData,
            phoneNumber: value
        });
    };

    const selectCountryOptions = () => {
        return getAllCountries().map((country) => ({
            value: country.text,
            label: country.text
        }));
    };

    const selectIndustryOptions = () => {
        return getAllIndustries().map((industry) => ({
            value: industry.label,
            label: industry.label
        }));
    };

    const getCountryCode = (countryName) => {
        const country = getAllCountries().find(
            (country) => country.text === countryName
        );
        return country ? country.value.toLowerCase() : '';
    };

    const selectCityOptions = (countryName) => {
        const country = getAllCountries().find((c) => c.text === countryName);
        const countryCode = country ? country.value : '';

        const filteredCities = [];
        for (const city of cities) {
            if (city.country === countryCode) {
                filteredCities.push({ value: city.name, label: city.name });
            }
        }

        filteredCities.sort((a, b) => a.label.localeCompare(b.label));

        return filteredCities;
    };

    return (
        <div className="SignUpContainer">
            <form className="SignUpForm" onSubmit={handleSubmit}>
                <h2 className="FormTitle">
                    Create Account For Company
                </h2>
                <div className="FormField">
                    <label className="Label">
                        Company Name
                    </label>
                    <input type="text"
                           name="companyName"
                           className="Input"
                           value={formData.companyName}
                           onChange={handleChange}
                           required
                    />
                </div>
                <div className="FormField">
                    <label className="Label">
                        Contact Person Full Name
                    </label>
                    <input type="text"
                           name="contactPersonFullName"
                           className="Input"
                           value={formData.contactPersonFullName}
                           onChange={handleChange}
                           required
                    />
                </div>

                <div className="FormField">
                    <label className="Label">Country</label>
                    <Select
                        name="country"
                        className="Select"
                        value={selectCountryOptions().find(option => option.value === formData.country) || null}
                        onChange={handleCountryChange}
                        options={selectCountryOptions()}
                        placeholder="Select your country"
                        isClearable
                        required
                    />
                </div>

                {formData.country &&
                    <div className="FormField">
                        <label className="Label">City</label>
                        <Select
                            name="city"
                            className="Select"
                            value={selectCityOptions(formData.country).find(option => option.value === formData.city) || null}
                            onChange={handleCityChange}
                            options={selectCityOptions(formData.country)}
                            placeholder="Select your city"
                            isClearable
                            required
                        />
                    </div>
                }

                {formData.country &&
                    <div className="FormField">
                        <PhoneInput
                            containerClass={"Label"}
                            inputClass={"Input"}
                            country={getCountryCode(formData.country)}
                            value={formData.phoneNumber}
                            onChange={handlePhoneChange}
                        />
                    </div>
                }

                <div className="FormField">
                    <label className="Label">Industry</label>
                    <Select
                        name="industry"
                        className="Select"
                        value={selectIndustryOptions().find(option => option.value === formData.industry) || null}
                        onChange={handleIndustryChange}
                        options={selectIndustryOptions()}
                        placeholder="Select your industry"
                        isClearable
                        required
                    />
                </div>

                <div className="FormField">
                    <label className="Label">Email</label>
                    <input type="email"
                           name="email"
                           className="Input"
                           value={formData.email}
                           onChange={handleChange}
                           required
                    />
                </div>

                <div className="FormField">
                    <label className="Label">Password</label>
                    <input type="password"
                           name="password"
                           className="Input"
                           value={formData.password}
                           onChange={handleChange}
                           required
                    />
                </div>

                <div className="FormField">
                    <label className="Label">Re-write Password</label>
                    <input type="password"
                           name="reWritePassword"
                           className="Input"
                           value={formData.reWritePassword}
                           onChange={handleChange}
                           required
                    />
                </div>
                <button type="submit" className="Button">
                    Register
                </button>
                <div className="already-have-account">
                    <p className="login-text">
                        Already have an account:
                    </p>
                    <button type="button" className="login-button" onClick={redirectToLogin}>
                        Log In
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterCompany;
