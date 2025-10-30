<template>
    <CModal 
        alignment="center"
        scrollable
        :visible="visibility"
        backdrop="static"
        :keyboard="false"
    >
        <CModalBody>
            <CForm class="row g-2 mt-0" @submit.prevent="newTemplate">
                <CCol xs="12">
                    <h2 class="mt-2 fw-bold mb-0 text-center">Add New Template</h2>
                    <p class="text-body-secondary text-center my-1 mb-4 w-75 mx-auto">Add new template with custom name</p>
                    <CCol xs="10" class="mx-auto mt-4 pt-2">
                        <CFormLabel :for="name" class="text-start mb-0 form-label-required">Name</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                            <CIcon icon="cil-user" />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="5 Bedroom House..."
                                type="text"
                                v-model="name"
                                @blur="nameMeta.touched = true; nameValidate()"
                            />
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="nameMeta.touched && nameError">
                            <span>* {{ nameError }}</span>
                        </div>
                    </CCol>
                    <CCol xs="10" class="mx-auto mt-3 pt-2">
                        <CFormLabel :for="areas" class="text-start mb-0 form-label-required">Areas</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                            <CIcon icon="cil-user" />
                            </CInputGroupText>
                            <Multiselect
                                v-model="areas"
                                style="font-size: 15px"
                                class="form-control p-0"
                                :options="areasList"
                                :label="'name'"
                                :valueProp="'id'" 
                                mode="multiple"
                                placeholder="Select Areas"
                                @blur="areasMeta.touched = true; areasValidate()"
                            />
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="areasMeta.touched && areasError">
                            <span>* {{ areasError }}</span>
                        </div>
                    </CCol>
                </CCol>
                <div class="d-grid mt-3 mb-3">
                    <CButton color="primary" class="px-4 py-2 self-button w-75 mx-auto mt-1" type="submit"> <CIcon icon="cilUserPlus" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Adding...' : 'Add Template' }}</CButton>
                    <CButton color="danger" class="px-4 py-2 text-white w-75 mx-auto mt-2" @click="closeModal">Cancel</CButton>
                </div>
            </CForm>
        </CModalBody>
    </CModal>
</template>

<script setup>
    import { ref, onBeforeMount } from 'vue'
    import { useForm, useField } from 'vee-validate'
    import * as yup from 'yup'
    import { toTypedSchema } from '@vee-validate/yup'
    import { getInspectionAreas, addTemplate } from '@/services/api'
    import { useApi } from '@/composables/useApi'
    import Multiselect from '@vueform/multiselect'
    import '@vueform/multiselect/themes/default.css' 
    import { ButtonSpinner } from '@/components/General/Spinner.vue'
    import { toastNotifications } from '@/composables/toastNotifications'
    import { useRouter } from 'vue-router'
    
    const props = defineProps({
        visibility: Boolean
    })
    const router = useRouter()

    const { showToast } = toastNotifications()
    const { loading, data: areasList, execute } = useApi(getInspectionAreas, false)

    const { loading: btnLoading, execute: execute1 } = useApi(addTemplate, false)

    onBeforeMount(async () => {
        await execute()
        areasList.value = areasList.value.data

    })

    const schema = toTypedSchema( yup.object({
        name: yup
            .string()
            .max(150, 'Max 150 characters long')
            .required('Name is required'),
        areas: yup
            .array()
            .min(1)
            .required('Must add one area atleast'),
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
        value: areas, 
        errorMessage: areasError,
        validate: areasValidate,
        meta: areasMeta
    } = useField('areas');

    const emit = defineEmits(['update:visibility'])

    const newTemplate = handleSubmit(async (formData) => {
        const response = await execute1({ payload: formData })

        if(response.success === true){
            showToast('success', 'Template added successfully! Wait redirecting...')
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } else{
            showToast('error', 'Oops! Something went wrong. Failed to add template.')
        }
    })

    function closeModal() {
        emit('update:visibility', false)
    }
</script>
