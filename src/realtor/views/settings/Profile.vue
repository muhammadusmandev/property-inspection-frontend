<template>
  <div>
    <!-- Profile -->
    <CForm class="settings-profile" @submit.prevent="submitUpdateProfile">
        <!-- Name -->
        <div class="form-group">
            <label>Name</label>

            <CInputGroup class="input-wrapper">
                <CInputGroupText class="input-prefix">
                    <CIcon icon="cil-user" class="text-info" />
                </CInputGroupText>
                <CFormInput
                    v-model="name"
                    placeholder="Enter your name"
                    aria-label="readonly" 
                    readonly
                />
            </CInputGroup>
        </div>

        <!-- Email -->
        <div class="form-group">
            <label>Email</label>

            <CInputGroup class="input-wrapper">
                <CInputGroupText class="input-prefix">
                    <CIcon icon="cil-at" class="text-info" />
                </CInputGroupText>
                <CFormInput
                    v-model="email"
                    placeholder="Enter your email address"
                    aria-label="readonly" 
                    readonly
                />
            </CInputGroup>
        </div>

        <!-- Phone Number -->
        <div class="form-group">
            <label>Phone Number</label>

            <CInputGroup class="input-wrapper">
                <CInputGroupText class="input-prefix">
                    <CIcon icon="cil-screen-smartphone" class="text-info" />
                </CInputGroupText>
                <CFormInput
                    v-model="phone_number"
                    placeholder="Enter your Phone number"
                    aria-label="readonly" 
                    readonly
                />
            </CInputGroup>
        </div>

        <!-- Gender -->
        <div class="form-group">
            <label>Gender</label>

            <CInputGroup class="input-wrapper">
                <CInputGroupText class="input-prefix">
                    <CIcon icon="cil-user" class="text-info" />
                </CInputGroupText>
                <CFormInput
                    v-model="gender"
                    class="text-capitalize"
                    aria-label="readonly" 
                    readonly
                />
            </CInputGroup>
        </div>

        <!-- Date of Birth -->
        <div class="form-group">
            <label>Date of Birth</label>

            <CInputGroup class="input-wrapper">
                <CInputGroupText class="input-prefix">
                    <CIcon icon="cil-calendar" class="text-info" />
                </CInputGroupText>
                <CFormInput
                    v-model="dob"
                    aria-label="readonly" 
                    readonly
                />
            </CInputGroup>
        </div>

        <!-- Photo -->
        <div class="form-group">
            <label>Your Photo</label>
            <p class="form-description">This will be displayed on your profile.</p>

            <div class="photo-upload">
                <img  
                    :src="authStore?.user?.avatar_url ? createServerImageURL(authStore?.user?.avatar_url) : (authStore?.user?.gender === 'female' ? femaleAvatar : maleAvatar)" 
                    alt="Profile" 
                    class="avatar" 
                />
                <input
                    type="file"
                    ref="photoInput"
                    accept="image/*"
                    class="d-none"
                    @change="handlePhotoChange"
                />

                <div class="photo-actions">
                    <CButton color="light" class="btn-delete bg-danger text-white" v-if="authStore?.user.avatar_url" @click="handleDeleteProfilePhoto">Remove</CButton>
                    <CButton color="primary" variant="outline" class="btn-update" @click="openPhotoSelector" :disabled="photoSelected">
                        {{ photoSelected ? 'Profile Photo Selected' : 'Select Photo' }}
                    </CButton>
                </div>
            </div>
        </div>

        <!-- Bio -->
        <div class="form-group">
            <label>Your Bio</label>
            <p class="form-description">Write a short introduction.</p>

            <textarea 
                v-model="bio" 
                class="bio-editor"
                @blur="bioMeta.touched = true; bioValidate()"
                maxlength="500"
            ></textarea>

            <div :class="['char-count', charCountLimit]">
                500/{{ 500 - (bio ? bio.length : 0) }} characters left
            </div>
        </div>
        <div class="form-field-error d-inline-block mt-0 mx-2 w-auto" v-if="bioMeta.touched && bioError">
            <span>* {{ bioError }}</span>
        </div>

        <!-- Save Button -->
        <div class="form-actions">
            <CButton class="px-4 self-button create-account-btn mx-auto fs-8 btn-save" type="submit" :disabled="btnLoading"> <CIcon icon="cil-user" v-if="!btnLoading" /> <ButtonSpinner v-if="btnLoading" size="small" bgColor="#000000" /> {{ btnLoading ? 'Saving...' : 'Save Changes' }} </CButton>
        </div>
    </CForm>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, computed } from "vue"
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup'
  import femaleAvatar from '@/assets/images/avatars/female.png'
  import maleAvatar from '@/assets/images/avatars/male.png'
  import { useAuthStore } from '@/stores/auth'
  import { getProfileData, updateProfileData, deleteProfilePhoto } from '@/services/api'
  import { ButtonSpinner } from '@/components/General/Spinner.vue'
  import { toastNotifications } from '@/composables/toastNotifications'
  import { useApi } from '@/composables/useApi'
  import { localeAwareLongDateFormat } from '@/utils/datetimeFormatter'

  const authStore = useAuthStore()
  const name = ref('')
  const email = ref('')
  const phone_number = ref('')
  const gender = ref('')
  const dob = ref('')
  const photo = ref(null)
  const photoSelected = ref(false)
  const photoInput = ref(null)
  const { showToast } = toastNotifications()

  const { data: profileData, execute } = useApi(getProfileData, false)
  const { loading: btnLoading, data: updatedData, execute: updateProfileExecute } = useApi(updateProfileData, false)
  const { execute: deleteProfilePhotoExecute } = useApi(deleteProfilePhoto, false)
  
  onBeforeMount(async () => {
    await execute()
    
    // Set fields
    name.value = profileData.value.name
    email.value = profileData.value.email
    phone_number.value = profileData.value.phone_number
    gender.value = profileData.value.gender
    dob.value = localeAwareLongDateFormat(profileData.value.date_of_birth)
    bio.value = profileData.value.bio
  })

  const schema = toTypedSchema( yup.object({
    bio: yup
        .string()
  }))

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema
  })

  const { 
    value: bio, 
    errorMessage: bioError,
    validate: bioValidate,
    meta: bioMeta
  } = useField('bio')

  const openPhotoSelector = () => {
    photoInput.value.click()
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        const previewImage = URL.createObjectURL(file)
        photo.value = file
        photoSelected.value = true
    }
    e.target.value = null
  }

  const charCountLimit = computed(() => {
    if (bio && bio.value?.length >= 500) return 'text-danger'
    return ''
  })

  const submitUpdateProfile = handleSubmit(async (values) => {
    const formData = new FormData()

    for (let key in values) {
        formData.append(key, values[key])
    }

    if(photo.value){
        formData.append("photo", photo.value)
    }
    
    const response = await updateProfileExecute({ payload: formData, config: { isMultipart: true } })

    if(response.success === true){
      showToast('success', 'Changes saved successfully!')
      const mergedUser = {
        ...authStore.user,
        avatar_url: updatedData.value.avatar_url
      }

      authStore.setUserData(mergedUser)
      photo.value = null
      photoInput.value = null
      photoSelected.value = false
    }
  })

  async function handleDeleteProfilePhoto(){
    const response = await deleteProfilePhotoExecute()

    if(response.success === true){
      showToast('success', 'Photo deleted successfully!')

      const mergedUser = {
        ...authStore.user,
        avatar_url: null
      }
      authStore.setUserData(mergedUser)
    }
  }

  // Todo: create global helper method
  function createServerImageURL(path){
    return `http://127.0.0.1:8000/storage/` + path;
  }
</script>

<style scoped>
  .settings-profile{
    border: none !important;
  }

  /* Form */
  .settings-profile .form-group {
    margin-bottom: 30px;
  }

  .settings-profile .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1a1a1a;
  }

  .settings-profile .form-description {
    font-size: 13px;
    color: #999;
    margin-bottom: 12px;
  }

  /* Input Fields */
  .settings-profile .input-wrapper {
    display: flex;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
  }

  .settings-profile .input-prefix {
    background-color: #f5f5f5;
    padding: 12px 16px;
    font-size: 14px;
    color: #999;
    border-right: 1px solid #ddd;
    white-space: nowrap;
  }

  .settings-profile .input-wrapper input {
    flex: 1;
    padding: 12px 16px;
    border: none;
    font-size: 14px;
  }

  .settings-profile .input-wrapper input:focus {
    outline: none;
    background-color: #fafafa;
  }

  .settings-profile .form-group input[type="text"] {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }

  .settings-profile .form-group input[type="text"]:focus {
    outline: none;
    border-color: #5e5ce6;
  }

  /* Photo Upload */
  .settings-profile .photo-upload {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .settings-profile .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .settings-profile .photo-actions {
    display: flex;
    gap: 10px;
  }

  .settings-profile .btn-delete,
  .settings-profile .btn-update {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #ddd;
    background: white;
    transition: all 0.2s;
  }

  .settings-profile .btn-delete:hover {
    background-color: #f5f5f5;
  }

  .settings-profile .btn-update {
    color: #02aad3;
    border-color: #02aad3;
  }

  .settings-profile .btn-update:hover {
    background-color: #f0f0ff;
  }

  .settings-profile .bio-editor {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    min-height: 120px;
  }

  .settings-profile .bio-editor:focus {
    outline: none;
    border-color: #5e5ce6;
  }

  .settings-profile .char-count {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
    text-align: right;
  }

  /* Form Actions */
  .settings-profile .form-actions {
    padding-top: 20px;
    border-top: 1px solid #ddd;
    margin-top: 30px;
  }

  .settings-profile .btn-save:hover {
    background-color: #4c4acc;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .settings-profile .photo-upload {
      flex-direction: column;
      align-items: flex-start;
    }
  }

</style>