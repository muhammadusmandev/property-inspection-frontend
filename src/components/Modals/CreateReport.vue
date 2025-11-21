<template>
    <CModal alignment="center" scrollable :visible="visibility" backdrop="static" :keyboard="false" size="lg">
        <CModalBody>
            <CForm class="row g-2 mt-0" @submit.prevent="newReport">
                <CCol xs="12">
                    <h2 class="mt-3 fw-bold mb-0 text-center">New Report</h2>
                    <p class="text-body-secondary text-center my-1 mb-4 w-75 mx-auto">Create new report for any property
                    </p>
                    <CCol xs="10" class="mx-auto mt-2">
                        <CFormLabel :for="title" class="text-start mb-2 form-label-required">Title</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                                <CIcon icon="cil-text" />
                            </CInputGroupText>
                            <CFormInput placeholder="First Report For Western Side Property..." type="text"
                                v-model="title" @blur="titleMeta.touched = true; titleValidate()" />
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto"
                            v-if="titleMeta.touched && titleError">
                            <span>* {{ titleError }}</span>
                        </div>
                    </CCol>
                    <CCol xs="10" class="mx-auto mt-2">
                        <CFormLabel :for="property_id" class="text-start mb-2 form-label-required">Property</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                                <CIcon icon="cil-house" />
                            </CInputGroupText>
                            <CFormSelect v-model="property_id" @blur="propertyMeta.touched = true; propertyValidate()">
                                <option value="">Choose ...</option>
                                <option :value="property_item.id" v-for="(property_item, idx) in properties" :key="idx">
                                    {{property_item.name}}</option>
                            </CFormSelect>
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto"
                            v-if="propertyMeta.touched && propertyError">
                            <span>* {{ propertyError }}</span>
                        </div>
                    </CCol>
                    <CRow class="col-10 mx-auto justify-content-between">
                        <CCol xs="6" class="mx-auto mt-2 ps-0">
                            <CFormLabel :for="type" class="text-start mb-2 form-label-required">Report Type</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-tag" />
                                </CInputGroupText>
                                <CFormSelect v-model="type" @blur="typeMeta.touched = true; typeValidate()">
                                    <option value="">Choose ...</option>
                                    <option value="inspection">Inspection</option>
                                    <option value="inventory">Inventory</option>
                                    <option value="check-out">Check Out</option>
                                    <option value="check-in">Check In</option>
                                </CFormSelect>
                            </CInputGroup>
                            <div class="form-field-error d-inline-block mt-0 mx-2 w-auto"
                                v-if="typeMeta.touched && typeError">
                                <span>* {{ typeError }}</span>
                            </div>
                        </CCol>
                        <CCol xs="6" class="mx-auto mt-2 pe-0">
                            <CFormLabel :for="template_id" class="text-start mb-2 form-label-required">Report Template
                            </CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-layers" />
                                </CInputGroupText>
                                <CFormSelect v-model="template_id"
                                    @blur="templateMeta.touched = true; templateValidate()">
                                    <option value="">Choose ...</option>
                                    <option :value="item.id" v-for="(item, idx) in templates">{{ item.name }}</option>
                                </CFormSelect>
                            </CInputGroup>
                            <div class="form-field-error d-inline-block mt-0 mx-2 w-auto"
                                v-if="templateMeta.touched && templateError">
                                <span>* {{ templateError }}</span>
                            </div>
                        </CCol>
                    </CRow>
                    <CCol xs="10" class="mx-auto mt-2">
                        <CFormLabel :for="report_date" class="text-start mb-2 form-label-required">Report Date
                        </CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                                <CIcon icon="cil-calendar" />
                            </CInputGroupText>
                            <Datepicker class="form-control p-0 border-0" placeholder="Select your report date"
                                :enable-time-picker="false" :hide-input-icon="true" :min-date="new Date(2024, 1, 1)"
                                v-model="report_date" @blur="reportDateMeta.touched = true; reportDateValidate()" />
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto"
                            v-if="reportDateMeta.touched && reportDateError">
                            <span>* {{ reportDateError }}</span>
                        </div>
                    </CCol>
                </CCol>
                <div class="d-grid mt-3 mb-3">
                    <CButton color="primary" class="px-4 py-2 self-button w-75 mx-auto mt-1" type="submit"
                        :disabled="btnLoading">
                        <CIcon icon="cilUserPlus" v-if="!btnLoading" />
                        <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Creating...'
                        : 'Create Report' }}
                    </CButton>
                    <CButton color="danger" class="px-4 py-2 text-white w-75 mx-auto mt-2" @click="closeModal">
                        <CIcon icon="cilX" /> Cancel
                    </CButton>
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
    import { addReport, getProperties, getTemplates } from '@/services/api'
    import { useApi } from '@/composables/useApi'
    import { ButtonSpinner } from '@/components/General/Spinner.vue'
    import { toastNotifications } from '@/composables/toastNotifications'
    import Datepicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import dateTimeToDateISO from '@/utils/datetimeFormatter'
    import { useRouter, useRoute } from 'vue-router'

    const props = defineProps({
        visibility: Boolean
    })
    const router = useRouter()
    const route = useRoute()

    const { showToast } = toastNotifications()

    const { data: properties, execute } = useApi(getProperties, false)
    const { loading: btnLoading, execute: execute1 } = useApi(addReport, false)
    const { data: templates, execute: execute2 } = useApi(getTemplates, false)

    const schema = toTypedSchema(yup.object({
        title: yup
            .string()
            .max(150, 'Max 150 characters allowed')
            .required('Title is required'),
        property_id: yup
            .number()
            .typeError('Property must be a number')
            .integer('Property must be an integer')
            .required('Property is required'),
        type: yup
            .string()
            .required('Type is required'),
        report_date: yup
            .date()
            .typeError('Date must be valid')
            .required('Date is required'),
        template_id: yup
            .number()
            .typeError('Template must be a number')
            .integer('Template must be an integer')
            .required('Template is required'),
    }))

    onBeforeMount(async () => {
        await execute({ queryParameters: { paginate: false } })
        await execute2({ queryParameters: { paginate: false } })
        properties.value = properties.value.data
        templates.value = templates.value.data
    })

    const { handleSubmit, isSubmitting } = useForm({
        validationSchema: schema
    })

    const {
        value: title,
        errorMessage: titleError,
        validate: titleValidate,
        meta: titleMeta
    } = useField('title');

    const {
        value: property_id,
        errorMessage: propertyError,
        validate: propertyValidate,
        meta: propertyMeta
    } = useField('property_id');

    const {
        value: type,
        errorMessage: typeError,
        validate: typeValidate,
        meta: typeMeta
    } = useField('type');

    const {
        value: report_date,
        errorMessage: reportDateError,
        validate: reportDateValidate,
        meta: reportDateMeta
    } = useField('report_date');

    const {
        value: template_id,
        errorMessage: templateError,
        validate: templateValidate,
        meta: templateMeta
    } = useField('template_id');

    const emit = defineEmits(['update:visibility'])

    const newReport = handleSubmit(async (formData) => {
        formData.report_date = dateTimeToDateISO(formData.report_date)
        const response = await execute1({ payload: formData })

        if (response.success === true) {
            showToast('success', 'Report created successfully! Wait redirecting...')
            if (route.name === 'realtor.reports.list') {
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            } else {
                router.push({ name: 'realtor.reports' })
            }
        } else {
            showToast('error', 'Oops! Something went wrong. Failed to create report.')
        }
    })

    function closeModal() {
        emit('update:visibility', false)
    }
</script>