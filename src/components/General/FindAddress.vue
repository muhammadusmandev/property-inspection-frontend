<template>
    
    <div class="mb-1">
        <CCol xs="12">
            <CFormLabel :for="inputId">{{ inputLabel }}</CFormLabel>
            <CFormInput 
                type="text" 
                :id="inputId" 
                :placeholder="inputPlaceHolder"
                v-model="findClientProperty"
                @blur="findClientPropertyMeta.touched = true; findClientPropertyValidate()"
            />
            <div class="flex color-red form-input-error my-2">
                <span v-if="findClientPropertyMeta.touched && findClientPropertyError">* {{ findClientPropertyError }}</span>
            </div>
        </CCol>

        <CButton 
            class="btn bg-transparent border-0 p-0 mb-3 mt-2 text-info d-inline text-start"
            type="button"
            v-if="!manualAddressClicked"
            @click="handleShowManualAddress"
        >
            <strong>Don't find address? Add address manually. </strong>
        </CButton>

        <!-- Show Manual Address Fields -->
        <div class="row g-3" v-if="showManualAddressFields">
            <CCol xs="12">
                <CFormLabel for="inputAddress" class="form-label-required">Address</CFormLabel>
                <CFormInput 
                    id="inputAddress" 
                    placeholder="1234 Main St" 
                    v-model="inputAddress"
                    @blur="inputAddressMeta.touched = true; inputAddressValidate()"
                />
                <div class="flex color-red form-input-error my-2">
                    <span v-if="inputAddressMeta.touched && inputAddressError">* {{ inputAddressError }}</span>
                </div>
            </CCol>
            <CCol xs="12">
                <CFormLabel for="inputAddress2">Address 2</CFormLabel>
                <CFormInput 
                    id="inputAddress2" 
                    placeholder="Apartment, studio, or floor"
                    v-model="inputAddress2"
                    @blur="inputAddress2Meta.touched = true; inputAddress2Validate()"
                />
                <div class="flex color-red form-input-error my-2">
                    <span v-if="inputAddress2Meta.touched && inputAddress2Error">* {{ inputAddress2Error }}</span>
                </div>
            </CCol>
            <CCol md="4">
                <CFormLabel for="inputCity" class="form-label-required">City</CFormLabel>
                <CFormInput 
                    id="inputCity" 
                    placeholder="New York" 
                    v-model="inputCity"
                    @blur="inputCityMeta.touched = true; inputCityValidate()"
                />
                <div class="flex color-red form-input-error my-2">
                    <span v-if="inputCityMeta.touched && inputCityError">* {{ inputCityError }}</span>
                </div>
            </CCol>
            <CCol md="3">
                <CFormLabel for="inputState" class="form-label-required">State</CFormLabel>
                <CFormSelect 
                    id="inputState"
                    v-model="inputState"
                    @blur="inputStateMeta.touched = true; inputStateValidate()"
                >
                    <option value="">Choose...</option>
                    <option value="New York">New York</option>
                </CFormSelect>
                <div class="flex color-red form-input-error my-2">
                    <span v-if="inputStateMeta.touched && inputStateError">* {{ inputStateError }}</span>
                </div>
            </CCol>
            <CCol md="2">
                <CFormLabel for="inputZip" class="form-label-required">Zip</CFormLabel>
                <CFormInput 
                    id="inputZip" 
                    placeholder="10005" 
                    v-model="inputZip"
                    @blur="inputZipMeta.touched = true; inputZipValidate()"
                />
                <div class="flex color-red form-input-error my-2">
                    <span v-if="inputZipMeta.touched && inputZipError">* {{ inputZipError }}</span>
                </div>
            </CCol>
            <CCol md="3">
                <CFormLabel for="inputCountry" class="form-label-required">Country</CFormLabel>
                <CFormSelect 
                    id="inputCountry"
                    v-model="inputCountry"
                    @blur="inputCountryMeta.touched = true; inputCountryValidate()"
                >
                    <option value="">Choose...</option>
                    <option value="United States">United States</option>
                </CFormSelect>
                <div class="flex color-red form-input-error my-2">
                    <span v-if="inputCountryMeta.touched && inputCountryError">* {{ inputCountryError }}</span>
                </div>
            </CCol>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue'
    import { useField } from 'vee-validate'

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
        },
        modelValue: {
            type: String,
            default: '',
        }
    })

    // const inputValue = ref(props.modelValue)
    const showManualAddressFields = ref(false)
    const manualAddressClicked = ref(false)

    const { 
        value: findClientProperty, 
        errorMessage: findClientPropertyError,
        validate: findClientPropertyValidate,
        meta: findClientPropertyMeta
    } = useField('findClientProperty');

    const { 
        value: inputAddress, 
        errorMessage: inputAddressError,
        validate: inputAddressValidate,
        meta: inputAddressMeta
    } = useField('inputAddress');

    const { 
        value: inputAddress2, 
        errorMessage: inputAddress2Error,
        validate: inputAddress2Validate,
        meta: inputAddress2Meta
    } = useField('inputAddress2');

    const { 
        value: inputCity, 
        errorMessage: inputCityError,
        validate: inputCityValidate,
        meta: inputCityMeta
    } = useField('inputCity');

    const { 
        value: inputState, 
        errorMessage: inputStateError,
        validate: inputStateValidate,
        meta: inputStateMeta
    } = useField('inputState');

    const { 
        value: inputZip, 
        errorMessage: inputZipError,
        validate: inputZipValidate,
        meta: inputZipMeta
    } = useField('inputZip');

    const { 
        value: inputCountry, 
        errorMessage: inputCountryError,
        validate: inputCountryValidate,
        meta: inputCountryMeta
    } = useField('inputCountry');

    function handleShowManualAddress() {
        manualAddressClicked.value = true
        showManualAddressFields.value = true
    }

    watch(() => props.clearFormTrigger, () => {
        manualAddressClicked.value = false
        showManualAddressFields.value = false
    })

    // watch(
        // () => props.modelValue, 
        // (newVal) => {
            // inputValue.value = newVal
        // }
    // )
</script>
