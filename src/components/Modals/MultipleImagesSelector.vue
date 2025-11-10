<template>
    <CModal 
        alignment="center" 
        scrollable 
        :visible="visibility" 
        backdrop="static" 
        :keyboard="false"
        size="lg"
    >
        <CModalBody class="p-5">
            <div class="multiple-images-uploader-container">
                <h3 class="text-center fw-bold mb-1">Upload and Attach Multiple Images</h3>
                <p class="text-secondary text-center fs-7">Try to upload small size and good quality images for efficieny</p>

                <!-- Drag & Drop Zone -->
                <div 
                    class="image-uploader-drop-zone text-center mt-4"
                    @dragover.prevent="isDragging = true" 
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleImgDrop" 
                    :class="{ 'dragging': isDragging }"
                >
                    <CImage :src="uploadImgIcon" alt="Upload Image Icon" width="120" height="120" />
                    <div class="fs-7">
                        Drag & Drop images here <br> <span class="fw-bold">OR</span> <br>
                        <CButton @click="triggerImgInput" class="fs-8 btn-info text-white mt-2 px-3">Browse Files</CButton>
                        <p class="mt-3 fs- text-secondary"><b>File Formats:</b> jpg, jpeg, png, gif, webp <b>Max File Size:</b> 5MB</p>
                    </div>

                    <input 
                        ref="imgInput" 
                        type="file" 
                        accept="image/jpg, image/jpeg, image/png, image/gif, image/webp" 
                        class="d-none"
                        @change="handleImageSelect"
                        multiple 
                    />
                </div>

                <!-- Images Preview -->
                <div class="d-flex flex-wrap gap-2 mt-3" v-if="previewImages.length">
                    <div class="position-relative" v-for="(image, idx) in previewImages" :key="idx">
                        <CImage :src="image" alt="Image" width="100" height="100" class="preview-img" />
                        <button class="remove-selected-img bg-dark text-white border-0 position-absolute" @click="removeImg(idx)">×</button>
                    </div>
                </div>
            </div>
            <div class="d-flex mt-4 mb-3 gap-2 justify-content-center align-items-center">
                <CButton class="d-inline-block px-4 py-2 fs-7 self-button" @click="imageSelected"><CIcon icon="cil-cloud-upload" /> Select</CButton>
                <CButton color="dark" class="d-inline-block px-4 py-2 fs-7" @click="closeModal">Close</CButton>
            </div>
        </CModalBody>
    </CModal>
</template>

<script setup>
    import { ref, watch } from 'vue'
    import uploadImgIcon from '@/assets/images/icons/upload_img.png'
    import { toastNotifications } from '@/composables/toastNotifications'
    import imageCompression from 'browser-image-compression'

    const imgInput = ref(null)
    const isDragging = ref(false)
    const selectedImages = ref([])
    const previewImages = ref([])

    const { showToast } = toastNotifications()

    const props = defineProps({
        visibility: Boolean,
        resetImages: { 
            type: Number, 
            default: 0 
        },
        refItemId: {
            type: [String, Number],
            required: false
        }
    })

    const emit = defineEmits(['update:visibility', 'images-selected'])

    const allowedTypes = [
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ]

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024    // 5MB

    watch(() => props.resetImages, () => {
        selectedImages.value = []
        previewImages.value = []
    })

    function handleImageSelect(event) {
        const images = Array.from(event.target.files)

        const filteredImages = images.filter(image => {
            if (!allowedTypes.includes(image.type)) {
                return false
            }
            if (image.size > MAX_IMAGE_SIZE) {
                return false
            }
            return true
        })

        if (filteredImages.length !== images.length) {
            showToast('error', 'Some images not selected. Max 5MB size and image formats must be jpg, jpeg, png, gif, webp allowed.')
            return
        }

        addImages(images)
    }

    function handleImgDrop(event) {
        isDragging.value = false
        const images = Array.from(event.dataTransfer.files)

        const filteredImages = images.filter(image => {
            if (!allowedTypes.includes(image.type)) {
                return false
            }
            if (image.size > MAX_IMAGE_SIZE) {
                return false
            }
            return true
        })

        if (filteredImages.length !== images.length) {
            showToast('error', 'Some images not selected. Max 5MB size and image formats must be jpg, jpeg, png, gif, webp allowed.')
            return
        }

        addImages(images)
    }

    function triggerImgInput() {
        imgInput.value.click()
    }

    async function addImages(files) {
        const validImages = files.filter(f => f.type.startsWith('image/'))
        selectedImages.value.push(...validImages)
        
        // generate preview URLs
        const newPreviews = validImages.map(f => URL.createObjectURL(f))
        previewImages.value.push(...newPreviews)

        // Compress images sizes
        const compressedImages = await Promise.all(
            selectedImages.value.map(image => compressFile(image))
        )

        emit('images-selected', { refItemId: props.refItemId, images: compressedImages })
    }

    async function compressFile(file) {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024, 
            useWebWorker: true,
            initialQuality: 0.8,     // 0.8 = high quality
        }
        const compressedFile = await imageCompression(file, options)
        return compressedFile
    }

    function removeImg(index) {
        URL.revokeObjectURL(previewImages.value[index])
        previewImages.value.splice(index, 1)
        selectedImages.value.splice(index, 1)
        emit('images-selected', { refItemId: props.refItemId, images: selectedImages.value })
    }

    function imageSelected() {
        emit('update:visibility', false)
    }

    function closeModal() {
        selectedImages.value = []
        previewImages.value = []
        emit('update:visibility', false)
        emit('images-selected', { refItemId: props.refItemId, images: [] })
    }
</script>

<style scoped>
    .image-uploader-drop-zone {
        border: 2px dashed #a0dbff;
        border-radius: 10px;
        padding: 35px 0px;
        background: #fbfeff;
    }

    .image-uploader-drop-zone.dragging {
        border-color: #0262c9;
        background: #f8f8f8;
    }

    .preview-img {
        object-fit: cover;
        border-radius: 10px;
        border: 1px solid #ddd;
    }

    .remove-selected-img {
        top: 5px;
        right: 5px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        line-height: 14px;
        cursor: pointer;
    }
</style>