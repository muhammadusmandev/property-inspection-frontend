<template>
    <CModal 
        alignment="center"
        scrollable
        :visible="visibility"
        backdrop="static"
        :keyboard="false"
    >
        <CModalHeader :closeButton="false">
            <div class="clearfix w-100">
                <CImage align="center" rounded :src="deleteIcon" alt="Delete Image" width="130" fluid />
            </div>
        </CModalHeader>
        <CModalBody>
            <div class="row g-2 mt-0">
                <CCol xs="12">
                    <h2 class="mt-2 fw-bold mb-0 text-center">WARNING!</h2>
                    <p class="text-body-secondary text-center my-1 mb-4 w-75 mx-auto">Are You Sure? This data will be deleted permanently.</p>
                    <div class="row justify-content-between align-items-center mx-0 px-4">
                        <CFormInput 
                            placeholder="Type 'delete' here" 
                            v-model="deleteInput"
                            required
                        />
                    </div>
                </CCol>
                <div class="d-grid mt-4 mb-3">
                    <CButton color="danger" class="px-4 py-2 text-white w-75 mx-auto mt-1" @click="handleDelete"><CIcon icon="cilDelete" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" />{{ btnLoading ? 'Deleting...' : 'Delete' }}</CButton>
                    <CButton color="primary" class="px-4 py-2 self-button w-75 mx-auto mt-2" @click="closeModal">Cancel</CButton>
                </div>
            </div>
        </CModalBody>
    </CModal>
</template>

<script setup>
    import { ref } from 'vue'
    import deleteIcon from '@/assets/images/icons/delete.png'
    import { toastNotifications } from '@/composables/toastNotifications'
    import { ButtonSpinner } from '@/components/General/Spinner.vue'
    
    const props = defineProps({
        visibility: Boolean,
        btnLoading: { 
            type: Boolean, 
            default: false
        }
    })

    const deleteInput = ref('')
    const emit = defineEmits(['update:visibility', 'confirmedDelete'])
    const { showToast } = toastNotifications()

    function closeModal() {
        emit('update:visibility', false)
    }

    function handleDelete() {
        if (deleteInput.value === 'delete') {
            emit('confirmedDelete')
        } else {
            showToast('error', 'You are entering wrong text.')
        }
    }
</script>
