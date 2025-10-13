<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 font-bold">
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-2/3">
          <div class="flex flex-col md:flex-row bg-white rounded shadow overflow-hidden">
            <!-- Login Card -->
            <div class="w-full md:w-3/5 p-6">
              <form @submit.prevent="submitLoginUser">
                <h1 class="text-2xl font-bold mb-2">Login</h1>
                <p class="text-gray-600 mb-6">Sign In to your account</p>

                <!-- Email -->
                <div class="flex items-center border rounded px-3 py-2 mb-2 bg-white">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A4 4 0 0112 15h0a4 4 0 016.879 2.804M15 11a3 3 0 10-6 0 3 3 0 006 0z"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Email"
                    autocomplete="email"
                    class="w-full outline-none"
                    v-model="email"
                    @blur="emailMeta.touched = true; emailValidate()"
                  />
                </div>

                <div class="flex color-red form-input-error mb-4">
                  <span v-if="emailMeta.touched && emailError">* {{ emailError }}</span>
                </div>

                <!-- Password -->
                <div class="flex items-center border rounded px-3 py-2 mb-2 bg-white">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.104.896-2 2-2s2 .896 2 2v1H10v-1zM6 11v2a6 6 0 0012 0v-2a2 2 0 10-4 0v2a2 2 0 11-4 0v-2a2 2 0 10-4 0z"/>
                  </svg>
                  <input
                    type="password"
                    placeholder="Password"
                    autocomplete="current-password"
                    class="w-full outline-none"
                    v-model="password"
                    @blur="passwordMeta.touched = true; passwordValidate()"
                  />
                </div>

                <div class="flex color-red form-input-error mb-4">
                  <span v-if="passwordMeta.touched && passwordError">* {{ passwordError }}</span>
                </div>

                <div class="px-3 py-2 mb-4 text-red" v-if="loginError">
                  * {{ loginError }}
                </div>

                <!-- Buttons -->
                <div class="flex flex-wrap justify-between">
                  <button class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" type="submit" :disabled="loading">
                    <ButtonSpinner v-if="loading" size="small" bgColor="#000000" /> {{ loading ? 'Processing...' : 'Login' }}
                  </button>
                  <router-link class="text-blue-600 hover:underline mt-2 md:mt-0">
                    Forgot password?
                  </router-link>
                </div>

                <div v-if="error">{{ error.message }}</div>
              </form>
            </div>

            <!-- Signup Card -->
            <div class="w-full md:w-2/5 bg-blue-600 text-white flex items-center justify-center p-6">
              <div class="text-center">
                <h2 class="text-2xl font-bold mb-2">Sign up</h2>
                <p class="mb-4 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <router-link :to="{ name: 'realtor.signup' }" class="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition">
                  Register Now!
                </router-link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, readonly } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  import { toTypedSchema } from '@vee-validate/yup';
  import { loginUser } from '@/services/api'
  import { useApi } from '@/composables/useApi'
  import { ButtonSpinner } from '@/components/General/Spinner.vue';

  const role = ref('realtor');
  const userRole = readonly(role);
  const loginError = ref('');

  const {  loading, data, error, execute } = useApi(loginUser, false)

  const schema = toTypedSchema( yup.object({
    email: yup
          .string()
          .email('Invalid email')
          .required('Email required'),
    password: yup
          .string()
          .min(8, 'Min 8 characters')
          .required('Password is required'),
  }))

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema
  })

  const { 
    value: email, 
    errorMessage: emailError,
    validate: emailValidate,
    meta: emailMeta
  } = useField('email');

  const { 
    value: password, 
    errorMessage: passwordError,
    validate: passwordValidate,
    meta: passwordMeta
  } = useField('password');

  const submitLoginUser = handleSubmit(async (formData) => {
    execute(formData)
  })
</script>

<style lang="scss" scoped>
</style>