<template>
  <div class="wrapper">
    <CContainer>
      <div class="row justify-content-center billing-header">
        <CCol :md="6">
            <CImage :src="appLogo" alt="Inspexly Logo" width="180" fluid />
        </CCol>
        <CCol :md="6">
            <button class="float-end rounded px-4 py-1 self-bg-light-dark self-color-tertiary fs-6"><CIcon icon="cil-lock-locked" /> Logout</button>
        </CCol>
      </div>
      <CRow class="justify-content-between billing-body">
        <CCol :md="6" class="py-5">
            <div class="billing-top-headings">
                <h2 class="text-capitalize">Checkout to start your free 7-days trial</h2>
                <p class="text-body-secondary fs-6 my-1">
                    You're currently logged in as Muhammad Usman (musmanpk444@gmail.com)
                </p>
            </div>
            <CForm class="row g-2 mt-0" @submit.prevent="">
                <h5 class="mt-4 fw-bold border-top pt-3 mb-1">Billing Details</h5>
                <CFormLabel :for="name" class="text-start mb-0 form-label-required">Full Name</CFormLabel>
                <CInputGroup>
                    <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                        type="text"
                        placeholder="John Doe"
                        v-model="name"
                        @blur="nameMeta.touched = true; nameValidate()"
                    />
                </CInputGroup>
                <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="nameMeta.touched && nameError">
                    <span>* {{ nameError }}</span>
                </div>
                <CFormLabel :for="email" class="text-start mb-0 form-label-required">Email</CFormLabel>
                <CInputGroup>
                    <CInputGroupText>
                        <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                        placeholder="johndoe@example.com"
                        autocomplete="email"
                        v-model="email"
                        @blur="emailMeta.touched = true; emailValidate()"
                    />
                </CInputGroup>
                <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="emailMeta.touched && emailError">
                    <span>* {{ emailError }}</span>
                </div>
                <CCol xs="6">
                    <CFormLabel for="address">Address (optional)</CFormLabel>
                    <div class="input-group">
                        <CInputGroupText>
                            <CIcon icon="cilLocationPin" />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="8787 Main Street etc.." 
                            v-model="address"
                            @blur="addressMeta.touched = true; addressValidate()"
                        />
                    </div>
                    <div class="flex form-field-error d-inline-block mt-2" v-if="addressMeta.touched && addressError">
                        <span>* {{ addressError }}</span>
                    </div>
                </CCol>
                <CCol xs="6">
                    <CFormLabel for="address_2">Address 2 (optional)</CFormLabel>
                    <div class="input-group">
                        <CInputGroupText>
                            <CIcon icon="cilLocationPin" />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="Apartment, Floor etc."
                            v-model="address_2"
                            @blur="address2Meta.touched = true; address2Validate()"
                        />
                    </div>
                    <div class="flex form-field-error d-inline-block mt-2" v-if="address2Meta.touched && address2Error">
                        <span>* {{ address2Error }}</span>
                    </div>
                </CCol>
                <CCol md="6">
                    <CFormLabel for="city">City (optional)</CFormLabel>
                    <div class="input-group">
                        <CInputGroupText>
                            <CIcon icon="cilChevronRight" />
                        </CInputGroupText>
                        <CFormInput
                            placeholder="New York" 
                            v-model="city"
                            @blur="cityMeta.touched = true; cityValidate()"
                        />
                    </div>
                    <div class="flex form-field-error d-inline-block mt-2" v-if="cityMeta.touched && cityError">
                        <span>* {{ cityError }}</span>
                    </div>
                </CCol>
                <CCol md="6">
                    <CFormLabel for="state">State (optional)</CFormLabel>
                    <div class="input-group">
                        <CInputGroupText>
                            <CIcon icon="cilChevronRight" />
                        </CInputGroupText>
                        <CFormInput
                            placeholder="New York" 
                            v-model="state"
                            @blur="stateMeta.touched = true; stateValidate()"
                        />
                    </div>
                    <div class="flex form-field-error d-inline-block mt-2" v-if="stateMeta.touched && stateError">
                        <span>* {{ stateError }}</span>
                    </div>
                </CCol>
                <CCol md="6">
                    <CFormLabel for="postal_code" class="form-label-required">Zip Code</CFormLabel>
                    <div class="input-group">
                        <CInputGroupText>
                            <CIcon icon="cilChevronRight" />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="10005" 
                            v-model="postal_code"
                            @blur="postalCodeMeta.touched = true; postalCodeValidate()"
                        />
                    </div>
                    <div class="flex form-field-error d-inline-block mt-2" v-if="postalCodeMeta.touched && postalCodeError">
                        <span>* {{ postalCodeError }}</span>
                    </div>
                </CCol>
                <CCol md="6">
                    <CFormLabel for="country" class="form-label-required">Country</CFormLabel>
                    <div class="input-group">
                        <CInputGroupText>
                            <CIcon icon="cilGlobeAlt" />
                        </CInputGroupText>
                        <CFormSelect
                            v-model="country"
                            @blur="countryMeta.touched = true; countryValidate()"
                        >
                            <option value="">Choose...</option>
                            <option :value="country.name" v-for="(country, idx) in CountriesData" :key="idx">{{country.name}}</option>

                        </CFormSelect>
                    </div>
                    <div class="flex form-field-error d-inline-block mt-2" v-if="countryMeta.touched && countryError">
                        <span>* {{ countryError }}</span>
                    </div>
                </CCol>
                <h5 class="mt-4 fw-bold border-top pt-3 mb-1">Pay With</h5>
                <CFormLabel :for="email" class="text-start mb-0 form-label-required">Debit or Credit Card</CFormLabel>
                <div id="card-element" class="card-element"></div>
                <div class="d-flex gap-2">
                    <CImage :src="pm1" alt="Payment Method" width="35" height="25" />
                    <CImage :src="pm2" alt="Payment Method" width="35" height="25" />
                    <CImage :src="pm3" alt="Payment Method" width="35" height="25" />
                    <CImage :src="pm4" alt="Payment Method" width="35" height="25" />
                    <CImage :src="pm5" alt="Payment Method" width="35" height="25" />
                    <CImage :src="pm6" alt="Payment Method" width="35" height="25" />
                </div>
                <p class="text-body-secondary mt-3" style="font-size: 0.9rem"><CIcon icon="cil-lock-locked" /> Payments are handled by secure platform <span class="text-decoration-underline fw-bold">Stripe</span></p>
                <div class="pt-2 border-top">
                    <p class="text-body-secondary" style="font-size: 0.8rem">By providing your billing and card information, You allow Inspexly to charge your card for future payment in accordance with their terms</p>
                </div>
                <div class="mt-4">
                    <CButton color="primary" class="px-4 self-button" type="submit"><CIcon icon="cil-send" /> Start Free Trial Now </CButton>
                </div>
            </CForm>
        </CCol>
        <CCol :md="5" class="py-5 px-4 mt-5 plans-area">
            <div class="plans-top-headings">
                <h2 class="text-capitalize">Choose your plan</h2>
                <p class="text-body-secondary fs-6 my-1">
                    Select the best plan that suit your need
                </p>
            </div>
            <CButtonGroup class="mt-4 border-top pt-3 plans-btns-group">
                <CButton href="#" class="py-4">
                    <div class="plan-title text-body-secondary fs-6">Solo</div>
                    <div class="plan-description fw-bold fs-6">$100/month</div>
                </CButton>
                <CButton href="#" class="plan-btn-active py-4" active>
                    <div class="plan-title fs-6">Pro</div>
                    <div class="plan-description fw-bold fs-6">$200/month</div>
                    <span class="selected-plan-indicator"><CIcon icon="cil-check-circle" /> Selected</span>
                </CButton>
                <CButton href="#" class="py-4">
                    <div class="plan-title text-body-secondary fs-6">Enterprise</div>
                    <div class="plan-description fw-bold fs-6">$400/month</div>
                </CButton>
            </CButtonGroup>
            <h5 class="mt-4 fw-bold border-top pt-4">Plan Details</h5>
            <div class="plans-tab-content">
                <table class="my-4">
                    <tbody>
                        <tr class="d-flex gap-2">
                            <td><CIcon icon="cil-check-alt" class="feature-check-icon" /></td>
                            <td class="text-body-secondary"> here is the feature 1</td>
                        </tr>
                        <tr class="d-flex gap-2">
                            <td><CIcon icon="cil-check-alt" class="feature-check-icon" /></td>
                            <td class="text-body-secondary"> here is the feature 2</td>
                        </tr>
                        <tr class="d-flex gap-2">
                            <td><CIcon icon="cil-check-alt" class="feature-check-icon" /></td>
                            <td class="text-body-secondary"> here is the feature 3</td>
                        </tr>
                        <tr class="d-flex gap-2">
                            <td><CIcon icon="cil-check-alt" class="feature-check-icon" /></td>
                            <td class="text-body-secondary"> here is the feature 4</td>
                        </tr>
                        <tr class="d-flex gap-2">
                            <td><CIcon icon="cil-check-alt" class="feature-check-icon" /></td>
                            <td class="text-body-secondary"> here is the feature 5</td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between border-top pt-3">
                    <div class="fw-bold">
                        Product
                    </div>
                    <div class="fw-bold self-color-primary">
                        <CIcon icon="cil-dollar" class="total-dollar-icon" /> Total
                    </div>
                </div>
                <div class="d-flex justify-content-between py-3">
                    <div class="text-body-secondary">
                        Pro (Monthly)
                    </div>
                    <div class="text-body-secondary">
                        $200
                    </div>
                </div>
                <p class="text-body-secondary next-billed-text">
                    Billed on <b>May 25, 2025</b> after free trial ($200/month)
                </p>
                <div class="d-flex justify-content-between border-top py-3 px-3 mt-4 due-today-row">
                    <div class="fw-bold">
                        <CIcon icon="cil-calendar-check" /> Due Today
                    </div>
                    <div class="fw-bold">
                        $0
                    </div>
                </div>
            </div>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import appLogo from '@/assets/images/Inspexly_logo.jpg'
  import pm1 from '@/assets/icons/payment_methods/1.png'
  import pm2 from '@/assets/icons/payment_methods/2.png'
  import pm3 from '@/assets/icons/payment_methods/3.png'
  import pm4 from '@/assets/icons/payment_methods/4.png'
  import pm5 from '@/assets/icons/payment_methods/5.png'
  import pm6 from '@/assets/icons/payment_methods/6.png'
  import { getCountriesList } from '@/services/api'
  import { useApi } from '@/composables/useApi'
  import { loadStripe } from "@stripe/stripe-js"

  const postalCodePatterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    AU: /^\d{4}$/,
    NL: /^\d{4}\s?[A-Za-z]{2}$/,
  }

  const schema = toTypedSchema( yup.object({
    email: yup
          .string()
          .email('Invalid email')
          .required('Email required'),
    name: yup
          .string()
          .min(5, 'Min 5 characters required')
          .max(100, 'Maximum 100 characters long')
          .required('Name is required'),
    address: yup
          .string()
          .min(5, 'Must be atleast 5 characters long')
          .max(100, 'Must be 100 characters long'),
    address_2: yup
          .string()
          .max(100, 'Must be 100 characters long'),
    city: yup
          .string()
          .min(2, 'Must be atleast 2 characters long')
          .max(50, 'Must be 50 characters long'),
    state: yup
          .string()
          .max(50, 'Must be 50 characters long'),
    postal_code: yup
          .string()
          .required('Must add zip code.')
          .when('country', (country, schema) => { // temp 'US' else dynamic
            const regex = postalCodePatterns[country]    
            return regex
              ? schema.matches(regex, `ZIP code must be valid for ${country}`)
              : schema
          }),
    country: yup
          .string()
          .required('Must select country.'),
  }))

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema
  })

  const { 
    value: name, 
    errorMessage: nameError,
    validate: nameValidate,
    meta: nameMeta
  } = useField('name');

  const { 
    value: email, 
    errorMessage: emailError,
    validate: emailValidate,
    meta: emailMeta
  } = useField('email');

  const { 
        value: address, 
        errorMessage: addressError,
        validate: addressValidate,
        meta: addressMeta
    } = useField('address');

    const { 
        value: address_2, 
        errorMessage: address2Error,
        validate: address2Validate,
        meta: address2Meta
    } = useField('address_2');

    const { 
        value: city, 
        errorMessage: cityError,
        validate: cityValidate,
        meta: cityMeta
    } = useField('city');

    const { 
        value: state, 
        errorMessage: stateError,
        validate: stateValidate,
        meta: stateMeta
    } = useField('state');

    const { 
        value: postal_code, 
        errorMessage: postalCodeError,
        validate: postalCodeValidate,
        meta: postalCodeMeta
    } = useField('postal_code');

    const { 
        value: country, 
        errorMessage: countryError,
        validate: countryValidate,
        meta: countryMeta
    } = useField('country');

    const {data: CountriesData, execute } = useApi(getCountriesList, false)

    let cardElement = null
    let stripe = null

    onMounted(async () => {
        stripe = await loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY)
        const elements = stripe.elements()
        cardElement = elements.create("card")
        cardElement.mount("#card-element")
        await execute()
    })
</script>

<style scoped>
  .billing-header{
    background: #fff;
    border: 2px solid #e9e9e9;
    border-top: none;
    margin-bottom: 25px;
    padding: 14px 35px;
  }

  .billing-body{
    background: #fff;
    border: 2px solid #e9e9e9;
    padding: 14px 35px;
  }

  .plans-btns-group {
    display: flex;
    gap: 10px;
  }

  .plans-btns-group .btn {
    border: 2px solid #5fbaf8;
    border-radius: 10px !important;
  }

  .plan-btn-active{
    background: #02aad3;
    color: #fff;
  }

  .plan-btn-active .plan-title{
    color: #ededed;
  }

  .plan-btn-active .selected-plan-indicator{
    position: absolute;
    top: -12px;
    right: 25px;
    border: 1px solid #02aad3;
    background: #03c2f4;
    padding: 1px 10px;
    color: #ffffff;
    font-size: 0.8rem;
    border-radius: 25px;
  }

  .plans-area{
    border: 1px solid #e7e7e7;
    background: #f9f9f9;
    box-shadow: -4px 5px 13px 1px rgba(0, 0, 0, 7%);
    -webkit-box-shadow: -4px 5px 13px 1px rgb(0 0 0 / 7%);
    -moz-box-shadow: -4px 5px 13px 1px rgba(0,0,0,7%);
  }

 .feature-check-icon,
 .total-dollar-icon {
    background: #02aad3;
    color: #ffffff !important;
    border-radius: 50%;
    padding: 2px;
  }

  .next-billed-text{
    font-size: 0.89rem;
  }

  .due-today-row{
    background: #02aad3;
    color: azure;
    border-radius: 5px;
    margin-left: -5px;
    margin-right: -5px;
    box-shadow: -4px 5px 21px 1px rgba(0,0,0,0.11);
    -webkit-box-shadow: -4px 5px 21px 1px rgba(0,0,0,0.11);
    -moz-box-shadow: -4px 5px 21px 1px rgba(0,0,0,0.11);
  }

  .card-element {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .card-element:focus-within {
    border-color: #6366f1;
    background: #fff;
  }
</style>