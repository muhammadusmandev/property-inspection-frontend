<template>
    
    <div class="mb-1">
        <CCol xs="12" v-if="isFindPropertyEnable">
            <CFormLabel :for="inputId">{{ inputLabel }}</CFormLabel>
            <div class="input-group">
                <span class="input-group-text">
                    <CIcon icon="cilLocationPin" class="text-info" />
                </span>
                <CFormInput 
                    type="text" 
                    :id="inputId" 
                    :placeholder="inputPlaceHolder"
                    v-model="findClientProperty"
                    @blur="findClientPropertyMeta.touched = true; findClientPropertyValidate()"
                />
            </div>
            <div class="flex form-field-error d-inline-block mt-2" v-if="findClientPropertyMeta.touched && findClientPropertyError">
                <span>* {{ findClientPropertyError }}</span>
            </div>
        </CCol>

        <CButton 
            class="btn bg-transparent border-0 p-0 mb-3 mt-2 text-info d-inline text-start"
            type="button"
            v-if="!manualAddressClicked && isFindPropertyEnable"
            @click="handleShowManualAddress"
        >
            <strong>Don't find address? Add address manually. </strong>
        </CButton>

        <!-- Show Manual Address Fields -->
        <div class="row g-3 mt-0" v-if="showManualAddressFields">
            <CCol xs="12">
                <CFormLabel for="address" class="form-label-required">Address</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cilLocationPin" class="text-info" />
                    </span>
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
            <CCol xs="12">
                <CFormLabel for="address_2">Address 2</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cilLocationPin" class="text-info" />
                    </span>
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
                <CFormLabel for="city" class="form-label-required">City</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cilChevronRight" class="text-info" />
                    </span>
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
                <CFormLabel for="state">State</CFormLabel>
                <div class="input-group">
                    <span class="input-group-text">
                        <CIcon icon="cilChevronRight" class="text-info" />
                    </span>
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
                    <span class="input-group-text">
                        <CIcon icon="cilChevronRight" class="text-info" />
                    </span>
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
                    <span class="input-group-text">
                        <CIcon icon="cilGlobeAlt" class="text-info" />
                    </span>
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
        </div>

    </div>
</template>

<script setup>
    import { ref, watch, onMounted } from 'vue'
    import { useField } from 'vee-validate'
    import { getCountriesList } from '@/services/api'
    import { useApi } from '@/composables/useApi'

    const {data: CountriesData, execute } = useApi(getCountriesList, false)

    onMounted(async () => {
    await execute()
    console.log(CountriesData);
  })

    const props = defineProps({
        inputLabel: String,
        inputId: {
            type: String,
            default: '',
        },
        inputPlaceHolder: {
            type: String,
            default: '',
        },
        clearFormTrigger: {
            type: Number,
            default: 0,
        },
        modelValue: {
            type: String,
            default: '',
        }
    })

    // const inputValue = ref(props.modelValue)
    const showManualAddressFields = ref(false)
    const manualAddressClicked = ref(false)
    const isFindPropertyEnable = ref(false)

    if(!isFindPropertyEnable.value){
        handleShowManualAddress();
    }

    const { 
        value: findClientProperty, 
        errorMessage: findClientPropertyError,
        validate: findClientPropertyValidate,
        meta: findClientPropertyMeta
    } = useField('findClientProperty');

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

    function handleShowManualAddress() {
        manualAddressClicked.value = true
        showManualAddressFields.value = true
        console.log('show manual')
    }

    watch(() => props.clearFormTrigger, () => {
        if(isFindPropertyEnable.value){
            manualAddressClicked.value = false
            showManualAddressFields.value = false
        } else{
            manualAddressClicked.value = true
        }
    })

    // watch(
        // () => props.modelValue, 
        // (newVal) => {
            // inputValue.value = newVal
        // }
    // )
</script>
