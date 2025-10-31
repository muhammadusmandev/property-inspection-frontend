<template>
    <CModal 
        alignment="center"
        scrollable
        :visible="visibility"
        backdrop="static"
        :keyboard="false"
    >
        <CModalBody>
            <CForm class="row g-2 mt-0" @submit.prevent="newInspectionArea">
                <CCol xs="12">
                    <h2 class="mt-2 fw-bold mb-0 text-center">Add New Area</h2>
                    <p class="text-body-secondary text-center my-1 mb-4 w-75 mx-auto">Add new inspection area with custom name</p>
                    <CCol xs="10" class="mx-auto mt-4 pt-2">
                        <CFormLabel :for="name" class="text-start mb-0 form-label-required">Name</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                            <CIcon icon="cil-user" />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Dining Room..."
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
                        <CFormLabel :for="items" class="text-start mb-0 form-label-required">Items</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>
                            <CIcon icon="cil-user" />
                            </CInputGroupText>
                            <Multiselect
                                v-model="items"
                                style="font-size: 15px"
                                class="form-control p-0"
                                :options="itemsList"
                                :label="'name'"
                                :valueProp="'id'" 
                                mode="multiple"
                                placeholder="Select Area Items"
                                @blur="itemsMeta.touched = true; itemsValidate()"
                            />
                        </CInputGroup>
                        <div v-if="selectedItemObjects.length > 0">
                            <span 
                                v-for="(item, idx) in selectedItemObjects" 
                                :key="item.id" 
                                class="selected-items-badge"
                            >
                                {{ item.name }}
                                <span class="selected-items-remove-btn" @click="removeSelectedItem(item.id)">x</span>
                            </span>
                        </div>
                        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="itemsMeta.touched && itemsError">
                            <span>* {{ itemsError }}</span>
                        </div>
                    </CCol>
                </CCol>
                <div class="d-grid mt-3 mb-3">
                    <CButton color="primary" class="px-4 py-2 self-button w-75 mx-auto mt-1" type="submit"> <CIcon icon="cilUserPlus" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Adding...' : 'Add Now' }}</CButton>
                    <CButton color="danger" class="px-4 py-2 text-white w-75 mx-auto mt-2" @click="closeModal">Cancel</CButton>
                </div>
            </CForm>
        </CModalBody>
    </CModal>
</template>

<script setup>
    import { ref, onBeforeMount, computed } from 'vue'
    import { useForm, useField } from 'vee-validate'
    import * as yup from 'yup'
    import { toTypedSchema } from '@vee-validate/yup'
    import { resetPassword, getInspectionAreaItemsList, addInspectionArea } from '@/services/api'
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
    const { loading, data: itemsList, execute } = useApi(getInspectionAreaItemsList, false)

    const { loading: btnLoading, execute: execute1 } = useApi(addInspectionArea, false)

    onBeforeMount(async () => {
        await execute()
    })

    const schema = toTypedSchema( yup.object({
        name: yup
            .string()
            .max(150, 'Max 150 characters long')
            .required('Name is required'),
        items: yup
            .array()
            .min(1)
            .required('Must add one item atleast'),
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
        value: items, 
        errorMessage: itemsError,
        validate: itemsValidate,
        meta: itemsMeta
    } = useField('items');

    const emit = defineEmits(['update:visibility'])

    const selectedItemObjects = computed(() =>
        itemsList.value?.filter((item) => items.value?.includes(item.id))
    );

    function removeSelectedItem(id) {
      items.value = items.value.filter((itemId) => itemId !== id);
    }

    const newInspectionArea = handleSubmit(async (formData) => {
        const response = await execute1({ payload: formData })

        if(response.success === true){
            showToast('success', 'Item added successfully! Wait redirecting...')
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } else{
            showToast('error', 'Oops! Something went wrong. Failed to add item.')
        }
    })

    function closeModal() {
        emit('update:visibility', false)
    }
</script>

<style scoped>
    .selected-items-badge {
        display: inline-flex;
        align-items: center;
        margin-right: 10px;
        margin-bottom: 7px;
        padding: 9px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
        background: #f5f5f5;
        color: #181818;
        border: 1px solid #e2e2e2;
    }

    .selected-items-remove-btn {
        background: #dedede;
        border: none;
        padding: 3px 7px;
        color: #333;
        margin-left: 12px;
        cursor: pointer;
        font-size: 0.87rem;
        line-height: 1;
        border-radius: 50%;
    }
</style>