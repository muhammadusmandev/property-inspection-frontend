<template>
    <!-- Step 3 -->
    <div v-if="!reportData?.locked_at">
      <div class="d-flex justify-content-between align-items-center mb-4 mt-4 p-4" style="border: 1px solid #e0e0e0">
        <div>
            <h3>Lock Report</h3>
            <p class="text-secondary fs-7">Sign your report and lock it for download ready</p>
        </div>
        <div class="my-3 text-end">
        </div>
      </div>
      <div class="mt-5 py-5 border">
        <CCol xs="12">
            <p class="mt-5 sign-important-note mb-0 text-center"><span class="fw-bold">Important Note:</span> I hereby acknowledge that submitting my signature will close this report, making it read-only and unchangeable.</p>
            <p class="text-body-secondary text-center my-1 mb-4 w-75 fs-7 mt-2 sign-certify-text mx-auto">I certify that the observations and remarks in this report are accurate to the best of my knowledge and reflect my honest evaluation of the property’s condition.</p>
            <div class="mx-0 px-4 w-75 mx-auto">
                <CFormInput 
                    :placeholder="`Type Signature '${authUserName}' here`" 
                    v-model="signatureName"
                    class="fs-8 py-2"
                    required
                />
                <div class="flex form-field-error d-inline-block mt-2" v-if="signErrorMessage">
                    <span>* {{ signErrorMessage }}</span>
                </div>
            </div>
        </CCol>
        <div class="d-grid mt-4 mb-3">
            <CButton color="info" class="px-4 py-2 text-white w-25 fs-8 mx-auto mt-1" @click="handleLockReport" :disabled="lockBtnLoading"><CIcon icon="cil-lock-locked" v-if="!lockBtnLoading" /> <ButtonSpinner v-if="lockBtnLoading" size="small" bgColor="#000000" />{{ lockBtnLoading ? 'Locking...' : 'Lock Report' }}</CButton>
            <CButton color="dark" class="px-4 py-2 w-25 fs-8 mx-auto mt-2" @click="handleGoToStep(2)"><CIcon icon="cil-arrow-left" /> Go Back</CButton>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column justify-content-center mt-5 mx-auto" style="width: fit-content" v-else>
      <h3 class="mb-4 self-color-primary"><CIcon icon="cil-lock-locked" size="xl" /> Report Locked</h3>
      <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto ms-4"  @click="handleGoToStep(4)">
        <CIcon icon="cil-cloud-download" /> Download Report
      </CButton>
    </div>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { 
    getReport,
    markReportLocked 
  } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const signatureName = ref('')
  const signErrorMessage = ref('')
  const lockBtnLoading = ref(false)
  const route = useRoute()
  const reportId = route.params.id
  const { showToast } = toastNotifications()
  const emit = defineEmits(['goToStep'])
  const authStore = useAuthStore()
  const authUserName = authStore.user.name

  const { data: reportData, execute: execute1 } = useApi(getReport, false)
  const { execute: executeLockReport } = useApi(markReportLocked, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [reportId] })
  })

  const handleGoToStep = (step) => {
    emit('goToStep', step)
  }

  async function handleLockReport(item){
    lockBtnLoading.value = true

    if (signatureName.value.trim() === authUserName) {
      signErrorMessage.value = ''
      const response = await executeLockReport({ pathParams: [reportId] })

      if(response.success === true){
        showToast('success', 'Report Locked successfully! Wait Redirecting...')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else{
        showToast('error', 'Oops! Something went wrong while locking report!')
        lockBtnLoading.value = false
      }
    } else{
      signErrorMessage.value = 'Must add valid signature of account holder name.'
      lockBtnLoading.value = false
    }
  }
</script>

<style scoped>
 
</style>