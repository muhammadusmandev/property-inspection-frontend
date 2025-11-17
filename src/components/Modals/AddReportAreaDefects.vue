<template>
  <CModal 
    alignment="center"
    scrollable
    :visible="visibility"
    backdrop="static"
    :keyboard="false"
    size="lg"
  >
    <CModalBody>
      <CForm class="row g-2" @submit.prevent="handleAddDefect">
        
        <h2 class="mt-2 fw-bold mb-0 text-center">Add Area Defect</h2>
        <p class="text-body-secondary text-center mb-4 w-75 mx-auto">
          Add defect details for this inspection area
        </p>

        <CCol xs="10" class="mx-auto mt-3 pt-2">
            <CRow class="justify-content-between">
                <!-- Defect Item -->
                <CCol xs="6">
                    <CFormLabel>Defect Item</CFormLabel>
                    <CFormSelect
                        v-model="defect_item"
                        class="fs-8"
                        @blur="defectItemMeta.touched = true; defectItemValidate()"
                    >
                        <option value="">Choose Defect Item...</option>
                        <option v-for="(item, idx) in itemsList" :key="idx" :value="item.id">{{ item.name }}</option>
                    </CFormSelect>
                    <div class="form-field-error d-inline-block mt-2 mx-2 w-auto" v-if="defectItemMeta.touched && defectItemError">
                        <span>* {{ defectItemError }}</span>
                    </div>
                </CCol>

                <!-- Defect Type -->
                <CCol xs="6">
                    <CFormLabel class="form-label-required">Defect Type</CFormLabel>
                    <CFormSelect 
                        v-model="defect_type"
                        class="fs-8"
                        @blur="defectTypeMeta.touched = true; defectTypeValidate()"
                    >
                        <option value="">Choose Type...</option>
                        <option v-for="opt in defectTypeOptions" :key="opt" :value="opt">{{ ucfirst(opt) }}</option>
                    </CFormSelect>
                    <div class="form-field-error d-inline-block mt-2 mx-2 w-auto" v-if="defectTypeMeta.touched && defectTypeError">
                        <span>* {{ defectTypeError }}</span>
                    </div>
                </CCol>
            </CRow>
        </CCol>

        <CCol xs="10" class="mx-auto mt-3 pt-2">
            <CRow class="justify-content-between">
                <!-- Remediation -->
                <CCol xs="6">
                    <CFormLabel class="form-label-required">Remediation/Action Needed</CFormLabel>
                    <CFormSelect 
                        v-model="remediation"
                        class="fs-8"
                        @blur="remediationMeta.touched = true; remediationValidate()"
                    >
                        <option value="">Choose Action...</option>
                        <option v-for="opt in remediationOptions" :key="opt" :value="opt">
                        {{ ucfirst(opt) }}
                        </option>
                    </CFormSelect>
                    <div class="form-field-error d-inline-block mt-2 mx-2 w-auto" v-if="remediationMeta.touched && remediationError">
                        <span>* {{ remediationError }}</span>
                    </div>
                </CCol>

                <!-- Priority -->
                <CCol xs="6">
                    <CFormLabel class="form-label-required">Priority</CFormLabel>
                    <CFormSelect 
                        v-model="priority"
                        class="fs-8"
                        @blur="priorityMeta.touched = true; priorityValidate()"
                    >
                        <option value="">Choose Priority...</option>
                        <option v-for="opt in priorityOptions" :key="opt" :value="opt">{{ ucfirst(opt) }}</option>
                    </CFormSelect>
                    <div class="form-field-error d-inline-block mt-2 mx-2 w-auto" v-if="priorityMeta.touched && priorityError">
                        <span>* {{ priorityError }}</span>
                    </div>
                </CCol>
            </CRow>
        </CCol>

        <!-- Comments -->
        <CCol xs="10" class="mx-auto mt-3">
          <CFormLabel>Comments</CFormLabel>
          <CFormTextarea
            rows="3"
            class="fs-8"
            placeholder="Add additional comments..."
            v-model="comments"
            @blur="commentsMeta.touched = true; commentsValidate()"
          ></CFormTextarea>
          <div class="form-field-error d-inline-block mt-2 mx-2 w-auto" v-if="commentsMeta.touched && commentsError">
                    <span>* {{ priorityError }}</span>
                </div>
        </CCol>

        <!-- Photos -->
        <CCol xs="10" class="mx-auto mt-3">
          <CFormLabel>Photos</CFormLabel>
          <div class="d-flex flex-wrap gap-2 mt-3" v-if="previewImages.length">
            <div class="position-relative" v-for="(image, idx) in previewImages" :key="idx">
                <CImage :src="image" alt="Image" width="100" height="100" class="preview-img" />
            </div>
          </div>
          <br>
          <CBadge class="px-4 py-2" style="border-radius: 25px; cursor: pointer" color="info" @click="visibleShowImagesUpload(areaId)">
            <CIcon icon="cil-camera" /> {{ selectedImages.length > 0 ? 'Re-Select Photos' : 'Attach Photos' }}
          </CBadge>
        </CCol>

        <!-- Buttons -->
        <div class="d-grid mt-4 mb-3">
          <CButton color="primary" class="px-4 py-2 self-button w-75 mx-auto mt-1" type="submit" :disabled="btnLoading">
            {{ btnLoading ? 'Saving...' : 'Save Defect' }}
          </CButton>
          <CButton color="danger" class="px-4 py-2 text-white w-75 mx-auto mt-2" @click="closeModal">
            Cancel
          </CButton>
        </div>

      </CForm>
    </CModalBody>
  </CModal>

  <MultipleImagesSelector v-model:visibility="showImagesUpload" @images-selected="onImagesSelected" :refItemId="areaId" :resetImages="resetImages" />

</template>

<script setup>
    import { ref, onBeforeMount } from 'vue'
    import { useForm, useField } from 'vee-validate'
    import * as yup from 'yup'
    import { toTypedSchema } from '@vee-validate/yup'
    import { useRoute } from 'vue-router'
    import { useApi } from '@/composables/useApi'
    import { toastNotifications } from '@/composables/toastNotifications'
    import MultipleImagesSelector from '@/components/Modals/MultipleImagesSelector.vue'
    import { addReportAreaDefect, getInspectionAreaItemsList } from '@/services/api'

    const props = defineProps({
        visibility: Boolean,
        areaId: Number
    })

    const emit = defineEmits(['update:visibility'])

    onBeforeMount(() => fetchItems())

    const route = useRoute()
    const { showToast } = toastNotifications()

    // Options
    const defectTypeOptions = ['cosmetic', 'structural', 'safety']
    const remediationOptions = ['cleaning', 'maintenance', 'none']
    const priorityOptions = ['low', 'medium', 'high']

    // Validation schema
    const schema = toTypedSchema(yup.object({
        defect_item: yup
            .number()
            .typeError('Item must be a number')
            .integer('Item must be an integer')
            .nullable(),
        defect_type: yup
            .string()
            .required('Defect type is required'),
        remediation: yup
            .string()
            .required('Action is required'),
        priority: yup
            .string()
            .required('Priority is required'),
        comments: yup
            .string()
            .nullable(),
    }))

    const { handleSubmit } = useForm({ validationSchema: schema })

    const { 
        value: defect_item, 
        errorMessage: defectItemError, 
        meta: defectItemMeta, 
        validate: defectItemValidate 
    } = useField('defect_item')

    const { 
        value: defect_type, 
        errorMessage: defectTypeError, 
        meta: defectTypeMeta, 
        validate: defectTypeValidate 
    } = useField('defect_type')

    const { 
        value: remediation, 
        errorMessage: remediationError, 
        meta: remediationMeta, 
        validate: remediationValidate 
    } = useField('remediation')

    const { 
        value: priority, 
        errorMessage: priorityError, 
        meta: priorityMeta, 
        validate: priorityValidate 
    } = useField('priority')

    const { 
        value: comments, 
        errorMessage: commentsError, 
        meta: commentsMeta, 
        validate: commentsValidate
    } = useField('comments')

    const resetImages = ref(0)
    const uploadBtnLoading = ref(false)
    const showImagesUpload = ref(false)
    const selectedImages = ref([])
    const previewImages = ref([])

    const { loading: btnLoading, execute: saveDefect } = useApi(addReportAreaDefect, false)
    const { data: itemsList, execute: fetchItems } = useApi(getInspectionAreaItemsList, false)

    const handleAddDefect = handleSubmit(async (formData) => {
        const payload = new FormData()
        payload.append('inspection_area_id', props.areaId)
        payload.append('defect_item_id', formData.defect_item ?? null)
        payload.append('defect_type', formData.defect_type)
        payload.append('remediation', formData.remediation)
        payload.append('priority', formData.priority)
        payload.append('comments', formData.comments ?? '')

        selectedImages.value.forEach(image => {
            payload.append('images[]', image)
        })

        const response = await saveDefect({ payload: payload, config: { isMultipart: true } })

        if (response.success) {
            showToast('success', 'Defect added successfully! Wait Redirecting...')
            emit('update:visibility', false)
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } else {
            showToast('error', 'Failed to add defect.')
        }
    })

    function visibleShowImagesUpload() {
        resetImages.value++
        selectedImages.value = []
        previewImages.value = []
        showImagesUpload.value = true
    }

    function onImagesSelected({ refId, images }){
        selectedImages.value = images

        const newPreviews = images.map(f => URL.createObjectURL(f))
        previewImages.value.push(...newPreviews)
    }

    function closeModal() {
        emit('update:visibility', false)
    }

    function ucfirst(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
    }

</script>

<style scoped>
    
</style>