<template>
  <CModal 
      alignment="center"
      scrollable
      :visible="visibility"
      backdrop="static"
      :keyboard="false"
  >
      <CModalBody>
          <CForm class="row g-2 mt-0" @submit.prevent="handleAddReportInspectionArea">
              <CCol xs="12">
                  <h2 class="mt-2 fw-bold mb-0 text-center">Add Report Inspection Area</h2>
                  <p class="text-body-secondary text-center my-1 mb-4 w-75 mx-auto">
                    Add inspection details for this report
                  </p>

                  <!-- Name -->
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
                    <CRow class="justify-content-between">
                        <CCol xs="6">
                            <CFormLabel :for="condition" class="text-start mb-0 form-label-required">Condition</CFormLabel>
                            <CFormSelect
                                v-model="condition"
                                @blur="conditionMeta.touched = true; conditionValidate()"
                            >
                                <option value="">Choose Condition...</option>
                                <option 
                                    v-for="(opt, idx) in conditionOptions" 
                                    :key="idx" 
                                    :value="opt"
                                >
                                    {{ opt }}
                                </option>
                            </CFormSelect>
                            <div class="form-field-error d-inline-block mt-2 mx-2 w-auto" v-if="conditionMeta.touched && conditionError">
                                <span>* {{ conditionError }}</span>
                            </div>
                        </CCol>

                        <CCol xs="6">
                            <CFormLabel :for="cleanliness" class="text-start mb-0 form-label-required">Cleanliness</CFormLabel>
                            <CFormSelect
                                v-model="cleanliness"
                                @blur="cleanlinessMeta.touched = true; cleanlinessValidate()"
                            >
                                <option value="">Choose Cleanliness...</option>
                                <option 
                                    v-for="(opt, idx) in conditionOptions" 
                                    :key="idx" 
                                    :value="opt"
                                >
                                    {{ opt }}
                                </option>
                            </CFormSelect>
                            <div class="form-field-error d-inline-block mt-2 mx-2 w-auto" v-if="cleanlinessMeta.touched && cleanlinessError">
                                <span>* {{ cleanlinessError }}</span>
                            </div>
                        </CCol>
                    </CRow>
                </CCol>

                  <!-- Description -->
                  <CCol xs="10" class="mx-auto mt-3 pt-2">
                      <CFormLabel :for="description" class="text-start mb-0">Description</CFormLabel>
                      <CFormTextarea 
                          placeholder="Add additional information..."  
                          rows="4" 
                          v-model="description" 
                          @blur="descriptionMeta.touched = true; descriptionValidate()"
                      ></CFormTextarea>
                  </CCol>

                  <!-- Items -->
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
                              :valueProp="'name'" 
                              mode="multiple"
                              placeholder="Select Area Items"
                              @blur="itemsMeta.touched = true; itemsValidate()"
                          />
                      </CInputGroup>
                      <div v-if="selectedItemObjects.length > 0">
                          <span 
                              v-for="(item, idx) in selectedItemObjects" 
                              :key="item.name" 
                              class="selected-items-badge"
                          >
                              {{ item.name }}
                              <span class="selected-items-remove-btn" @click="removeSelectedItem(item.name)">x</span>
                          </span>
                      </div>
                      <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="itemsMeta.touched && itemsError">
                          <span>* {{ itemsError }}</span>
                      </div>
                  </CCol>
              </CCol>

              <div class="d-grid mt-3 mb-3">
                  <CButton color="primary" class="px-4 py-2 self-button w-75 mx-auto mt-1" type="submit">
                      <CIcon icon="cilHouse" v-if="!btnLoading" /> 
                      <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> 
                      {{ btnLoading ? 'Adding...' : 'Add Now' }}
                  </CButton>
                  <CButton color="danger" class="px-4 py-2 text-white w-75 mx-auto mt-2" @click="closeModal">Cancel</CButton>
              </div>
          </CForm>
      </CModalBody>
  </CModal>
</template>

<script setup>
    import { ref, onBeforeMount, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useForm, useField } from 'vee-validate'
    import * as yup from 'yup'
    import { toTypedSchema } from '@vee-validate/yup'
    import Multiselect from '@vueform/multiselect'
    import '@vueform/multiselect/themes/default.css' 
    import { ButtonSpinner } from '@/components/General/Spinner.vue'
    import { useApi } from '@/composables/useApi'
    import { toastNotifications } from '@/composables/toastNotifications'
    import { getInspectionAreaItemsList, addReportInspectionArea } from '@/services/api'

    const props = defineProps({ 
        visibility: Boolean 
    })
    const emit = defineEmits(['update:visibility'])
    const router = useRouter()
    const route = useRoute()

    const { showToast } = toastNotifications()

    const { data: itemsList, execute: fetchItems } = useApi(getInspectionAreaItemsList, false)

    onBeforeMount(() => fetchItems())

    const conditionOptions = ['excellent', 'good', 'fair', 'poor', 'Unacceptable']

    const schema = toTypedSchema(yup.object({
        name: yup
                .string()
                .max(150, 'Max 150 characters')
                .required('Name is required'),
        condition: yup
                .string()
                .required('Condition is required'),
        cleanliness: yup
                .string()
                .required('Cleanliness is required'),
        items: yup
                .array()
                .min(1, 'Select at least one item')
                .required(),
        description: yup
                .string()
                .max(500, 'Max 500 characters')
    }))

    const { handleSubmit } = useForm({ validationSchema: schema })

    const { 
        value: name, 
        errorMessage: nameError, 
        validate: nameValidate, 
        meta: nameMeta 
    } = useField('name')

    const { 
        value: condition, 
        errorMessage: conditionError, 
        validate: conditionValidate, 
        meta: conditionMeta 
    } = useField('condition')

    const { 
        value: cleanliness, 
        errorMessage: cleanlinessError, 
        validate: cleanlinessValidate, 
        meta: cleanlinessMeta 
    } = useField('cleanliness')

    const { 
        value: description, 
        errorMessage: descriptionError, 
        validate: descriptionValidate, 
        meta: descriptionMeta 
    } = useField('description')

    const { 
        value: items, 
        errorMessage: itemsError, 
        validate: itemsValidate, 
        meta: itemsMeta 
    } = useField('items')

    const { loading: btnLoading, execute: addArea } = useApi(addReportInspectionArea, false)

    const selectedItemObjects = computed(() =>
        itemsList.value?.filter(item => items.value?.includes(item.name))
    )

    function removeSelectedItem(name) {
        items.value = items.value.filter((itemName) => itemName !== name)
    }

    const handleAddReportInspectionArea = handleSubmit(async (formData) => {
        const payload = { ...formData, report_id: route.params.id }
        const response = await addArea({ payload })
        
        if(response.success){
            showToast('success', 'Report inspection area added!')
            setTimeout(() => window.location.reload(), 2000)
        } else {
            showToast('error', 'Failed to add inspection area.')
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
