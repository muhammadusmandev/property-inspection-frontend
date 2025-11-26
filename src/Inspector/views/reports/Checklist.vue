<template>
  <!-- Step 2 -->
  <div v-if="!reportData?.locked_at">
    <div class="d-flex justify-content-between align-items-center mb-4 mt-4 p-4" style="border: 1px solid #e0e0e0">
      <div>
        <h3>Inspection Checklist</h3>
        <p class="text-secondary fs-7">Manage inspection checklist what item need to add</p>
      </div>
      <div class="my-3 text-end">
        
      </div>
    </div>

    <!-- Checklist Items -->
    <div class="mb-4 border py-3 px-4" v-for="(group, type) in groupedChecklist" :key="type">
      <h5>{{ type }}</h5>
      <div class="d-flex justify-content-between align-items-center py-1" v-for="item in group" :key="item.label">
        <span class="fs-8 text-secondary">{{ item.label }}</span>
        <CFormSwitch v-model="item.checked" @change="handleUpdateChecklistItem(item)" />
      </div>
    </div>
  </div>
  <div class="d-flex flex-column justify-content-center mt-5 mx-auto" style="width: fit-content" v-else>
    <h3 class="mb-4 self-color-primary">
      <CIcon icon="cil-lock-locked" size="xl" /> Report Locked
    </h3>
    <CButton class="px-4 self-bg-primary self-color-tertiary fs-8 w-auto ms-4" @click="handleGoToStep(4)">
      <CIcon icon="cil-cloud-download" /> Download Report
    </CButton>
  </div>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { CFormSwitch } from '@coreui/vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import {
    getReport,
    updateChecklistItem
  } from '@/services/api'
  import { useApi } from '@/composables/useApi'

  const checklist = ref('')
  const route = useRoute()
  const reportId = route.params.id
  const { showToast } = toastNotifications()
  const emit = defineEmits(['goToStep'])

  const { data: reportData, execute: execute1 } = useApi(getReport, false)
  const { execute: executeUpdateChecklist } = useApi(updateChecklistItem, false)

  onBeforeMount(async () => {
    await execute1({ pathParams: [reportId] })
    setupPageFieldsData();
  })

  function setupPageFieldsData() {
    checklist.value = reportData.value.checklist.map(item => ({
      id: item.id,
      label: item.label,
      checked: item.checked,
      type: item.type,
    }))
  }

  const groupedChecklist = computed(() => {
    const groups = {}
    if(checklist.value){
      checklist.value.forEach(item => {
        const type = item.type || 'General'
        if (!groups[type]) groups[type] = []
        groups[type].push(item)
      })
    }
    return groups
  })

  const handleGoToStep = (step) => {
    emit('goToStep', step)
  }

  async function handleUpdateChecklistItem(item) {
    const response = await executeUpdateChecklist({ payload: { report_id: reportId, checklist_id: item.id, checked: !item.checked } })

    if (response.success === true) {
      showToast('success', 'Item status changed successfully!')
    } else {
      showToast('error', 'Oops! Something went wrong while changing status!')
    }
  }
</script>

<style scoped>

</style>