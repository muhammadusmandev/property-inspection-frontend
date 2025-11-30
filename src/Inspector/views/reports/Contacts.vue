<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4 mt-4 p-4" style="border: 1px solid #e0e0e0">
            <div>
                <h3>Contacts</h3>
                <p class="text-secondary fs-7">List of contacts who concern with report</p>
            </div>
            <div class="my-3 text-end">
            </div>
        </div>
        <div class="mt-5 py-5 border">
            <CTable hover responsive class="mb-3">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell style="width: 15%;">Name</CTableHeaderCell>
                        <CTableHeaderCell style="width: 20%;">Email</CTableHeaderCell>
                        <CTableHeaderCell style="width: 20%;">Contact Type</CTableHeaderCell>
                        <CTableHeaderCell style="width: 15%;">Phone</CTableHeaderCell>
                        <CTableHeaderCell style="width: 10%;" class="text-center">Signee</CTableHeaderCell>
                        <CTableHeaderCell style="width: 10%;" class="text-center">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>

                <CTableBody>
                    <!-- CONTACT ROWS -->
                    <CTableRow v-for="(contact, index) in contacts" :key="contact.local_id">
                        <!-- NAME -->
                        <CTableDataCell>
                            <CFormInput v-if="contact.isEditing" v-model="contact.name" placeholder="Name" />
                            <span v-else>{{ contact.name }}</span>
                        </CTableDataCell>

                        <!-- EMAIL -->
                        <CTableDataCell>
                            <CFormInput v-if="contact.isEditing" v-model="contact.email" type="email"
                                placeholder="Email" />
                            <span v-else>{{ contact.email }}</span>
                        </CTableDataCell>

                        <!-- CONTACT TYPE -->
                        <CTableDataCell>
                            <CFormSelect v-if="contact.isEditing" v-model="contact.contact_type" style="height: 41px">
                                <option v-for="type in contactTypes" :key="type" :value="type">
                                    {{ type }}
                                </option>
                            </CFormSelect>
                            <span v-else>{{ contact.contact_type }}</span>
                        </CTableDataCell>

                        <!-- PHONE -->
                        <CTableDataCell>
                            <CFormInput v-if="contact.isEditing" v-model="contact.phone"
                                placeholder="Phone" />
                            <span v-else>{{ contact.phone }}</span>
                        </CTableDataCell>

                        <!-- CAN SIGN -->
                        <CTableDataCell class="text-center">
                            <CFormCheck type="checkbox" v-model="contact.can_sign" :disabled="!contact.isEditing" />
                        </CTableDataCell>

                        <!-- ACTIONS -->
                        <CTableDataCell class="text-center">
                            <div class="d-flex gap-1">
                                <span class="badge bg-dark" v-if="contact.isEditing && contact.isNew" @click="saveContact(contact)">
                                    <CIcon icon="cil-save" /> Save
                                </span>
                                <span class="badge bg-dark" v-else-if="contact.isEditing" @click="saveContact(contact)">
                                    <CIcon icon="cil-save" /> Update
                                </span>
                                <span class="badge bg-dark" v-else @click="editContact(contact)">
                                    <CIcon icon="cil-pen" /> Edit
                                </span>
                                <span class="badge bg-danger" @click="deleteContact(contact)">
                                    <CIcon icon="cil-delete" /> Delete
                                </span>
                                <span class="badge bg-warning" v-if="contact.isEditing" @click="cancelEdit(contact)">
                                    <CIcon icon="cil-x" /> Cancel
                                </span>
                            </div>

                        </CTableDataCell>
                    </CTableRow>

                    <!-- ADD NEW ROW BUTTON -->
                    <CTableRow>
                        <CTableDataCell colspan="7" class="text-center py-3">
                            <CButton class="px-4 py-1 self-button mx-auto d-inline-block fs-8" @click="addNewRow">
                                + Add New Contact
                            </CButton>
                        </CTableDataCell>
                    </CTableRow>

                </CTableBody>
            </CTable>
        </div>
    </div>
</template>

<script setup>
    import { reactive, onBeforeMount  } from 'vue'
    import { useRoute } from 'vue-router'
    import { getReportContacts, addReportContact, updateReportContact, deleteReportContact } from '@/services/api'
    import { useApi } from '@/composables/useApi'
    import { toastNotifications } from '@/composables/toastNotifications'

    const contacts = reactive([])
    const route = useRoute()
    const reportId = route.params.id
    const { showToast } = toastNotifications()

    const contactTypes = [
        'landlord',
        'tenant',
        'co_tenant',
        'owner',
        'occupant',
        'property_manager',
        'letting_agent',
        'estate_agent',
        'contractor',
        'inspector',
        'witness',
        'legal_representative',
        'insurance_assessor',
        'company_representative',
        'emergency_contact',
        'other',
    ]

    const { data: contactsData, execute } = useApi(getReportContacts, false)
    const { execute: addReportContactExecute } = useApi(addReportContact, false)
    const { execute: updateReportContactExecute } = useApi(updateReportContact, false)
    const { execute: deleteReportContactExecute } = useApi(deleteReportContact, false)

    onBeforeMount(async () => {
        await execute({ pathParams: [reportId] })

        contactsData.value.forEach(c => {
            contacts.push({
                ...c,
                local_id: crypto.randomUUID(),
                isEditing: false,
                isNew: false,
                backup: {}
            })
        })
    })

    function addNewRow() {
        contacts.push({
            local_id: crypto.randomUUID(),
            name: "",
            email: "",
            phone: "",
            contact_type: "tenant",
            can_sign: false,
            isEditing: true,
            isNew: true,
            backup: {},
        })
    }

    function editContact(contact) {
        contact.backup = { ...contact }
        contact.isEditing = true
    }

    async function saveContact(contact) {
        try {
            // New Contact
            if (contact.isNew) {
                const response = await addReportContactExecute({ payload: {
                    report_id: reportId,
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    contact_type: contact.contact_type,
                    can_sign: contact.can_sign,
                } })

                if(response.success === true){
                    showToast('success', 'Contact saved successfully!')
                    contact.isNew = false
                    contact.isEditing = false
                    contact.backup = {}

                    return true
                }
            }

            // Existing Contact
            else {
                const payload = {
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    contact_type: contact.contact_type,
                    can_sign: contact.can_sign,
                }

                const response = await updateReportContactExecute({ payload: payload, pathParams: [reportId] })

                if(response.success === true){
                    showToast('success', 'Contact updated successfully!')
                    contact.isEditing = false
                    contact.backup = {}

                    return true
                }
            }

        } catch (err) {
            showToast('error', 'Failed to save contact.')
            return false
        }
    }

    function cancelEdit(contact) {
        if (contact.isNew) {
            const index = contacts.indexOf(contact)
            contacts.splice(index, 1)
            return
        }
        Object.assign(contact, contact.backup)
        contact.isEditing = false
    }

    async function deleteContact(contact) {
        // If it's a new unsaved row then just remove locally
        if (contact.isNew || !contact.id) {
            const index = contacts.findIndex(c => c.local_id === contact.local_id)
            if (index !== -1) contacts.splice(index, 1)
            return
        }

        // For saved contacts call API to delete
        try {
            const response = await deleteReportContactExecute({ pathParams: [contact.id] })

            if (response?.success) {
                const index = contacts.findIndex(c => c.local_id === contact.local_id)
                if (index !== -1) contacts.splice(index, 1)
                showToast('success', 'Report contact deleted successfully.')
            }

        } catch (err) {
            showToast('error', 'Failed to delete contact.')
        }
    }
</script>

<style scoped>

</style>