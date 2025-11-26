<template>
    <div class="py-5 px-4 row">
        <div class="col-4">
            <div class="clearfix">
                <CImage rounded :src="appLogo" alt="Inspexly Logo" width="200" height="150" fluid />
            </div>
            <h3 class="mt-3 text-capitalize">Signature Report - {{ role }}</h3>
        </div>
        <div class="col-8">
            <CForm class="row g-2 mt-0" @submit.prevent="handleReportSignature">
                <CRow>
                    <CCol md="6" class="pt-2">
                        <CFormLabel :for="name" class="text-start mb-0 form-label-required">Name</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                                <CIcon icon="cil-user" />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="John Doe.."
                                type="text"
                                v-model="name"
                                @blur="nameMeta.touched = true; nameValidate()"
                            />
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="nameMeta.touched && nameError">
                            <span>* {{ nameError }}</span>
                        </div>
                    </CCol>
                    <CCol md="6" class="pt-2">
                        <CFormLabel :for="email" class="text-start mb-0 form-label-required">Email</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                                @
                            </CInputGroupText>
                            <CFormInput
                                placeholder="johndoe@example.com"
                                type="email"
                                v-model="email"
                                @blur="emailMeta.touched = true; emailValidate()"
                            />
                        </CInputGroup>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="emailMeta.touched && emailError">
                            <span>* {{ emailError }}</span>
                        </div>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md="9" class="pt-2">
                        <CFormLabel class="text-start mb-0 form-label-required">Signature</CFormLabel>
                        <canvas ref="canvas" class="signature-canvas mb-3"></canvas>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="signatureTouched && signatureError">
                            <span>* {{ signatureError }}</span>
                        </div>
                    </CCol>
                    <CCol md="3" class="pt-4">
                        <CButton color="primary" class="px-4 py-2 self-button d-block mt-1 fs-8" type="submit" :disabled="btnLoading"><ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Submitting...' : 'Submit Now' }}</CButton>
                        <CButton color="danger" class="px-4 py-2 text-white d-block  mt-2 fs-8" @click="clearPad">Clear</CButton>
                    </CCol>
                </CRow>
            </CForm>
        </div>
    </div>
    <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="700px" style="border:none;"></iframe>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { toastNotifications } from '@/composables/toastNotifications'
    import { ButtonSpinner } from '@/components/General/Spinner.vue'
    import { useForm, useField } from 'vee-validate'
    import * as yup from 'yup'
    import { toTypedSchema } from '@vee-validate/yup'
    import appLogo from '@/assets/images/Inspexly_logo.jpg'
    import { getReport, saveReportSignature } from '@/services/api'
    import SignaturePad from "signature_pad"
    import { useApi } from '@/composables/useApi'

    const canvas = ref(null)
    let signaturePad = null
    const pdfUrl = ref(null)
    const route = useRoute()
    const router = useRouter()
    const reportId = route.params.uuid
    const role = route.params.role
    const { showToast } = toastNotifications()

    const { data: reportData, execute: execute1 } = useApi(getReport, false)
    const { loading: btnLoading, execute: executeSaveReportSignature } = useApi(saveReportSignature, false)

    const schema = toTypedSchema( yup.object({
        name: yup
            .string()
            .required('Name is required'),
        email: yup
            .string()
            .email('Invalid email')
            .required('Email is required'),
    }))

    const { handleSubmit, isSubmitting } = useForm({
        validationSchema: schema
    })

    const { 
        value: name, 
        errorMessage: nameError,
        validate: nameValidate,
        meta: nameMeta
    } = useField('name')

    const { 
        value: email, 
        errorMessage: emailError,
        validate: emailValidate,
        meta: emailMeta
    } = useField('email')

    const signatureTouched = ref(false)
    const signatureError = ref(null)

    onBeforeMount(async () => {
        await execute1({ pathParams: [reportId] })

        pdfUrl.value = 'http://127.0.0.1:8000/storage/' + reportData.value.download_link

        const canvasEl = canvas.value

        // Resize canvas for HD screens
        const ratio = Math.max(window.devicePixelRatio || 1, 1)
        canvasEl.width = canvasEl.offsetWidth * ratio
        canvasEl.height = canvasEl.offsetHeight * ratio
        canvasEl.getContext("2d").scale(ratio, ratio)

        signaturePad = new SignaturePad(canvasEl)
    })

    const clearPad = () => {
        signaturePad.clear()
        signatureTouched.value = false
        signatureError.value = ''
    }

    const handleReportSignature =  handleSubmit(async (formData) => {
        if(signaturePad.isEmpty()){
            signatureTouched.value = true
            signatureError.value = 'Signature is required'
            return
        }

        signatureTouched.value = false
        signatureError.value = ''
        const signature = signaturePad.toDataURL("image/png")

        formData.signature = signature
        formData.role = role

        const response = await executeSaveReportSignature({ pathParams: [reportId], payload: formData })
        if(response.success === true){
            showToast('success', 'Report signed successfully!')
            setTimeout(() => {
                router.push({ name: 'realtor.login' })
            }, 2000)
        } else{
            showToast('error', 'Oops! Something went wrong. Failed to sign.')
        }
    })
</script>

<style scoped>
    .signature-canvas {
        border: 1px solid #ccc;
        width: 100%;
        height: 100px;
    }
</style>