<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @mousedown.self="$emit('cancel')">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div class="relative bg-gray-900 rounded-2xl border border-white/10 w-full max-w-sm shadow-2xl p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" :class="variant === 'danger' ? 'bg-red-400/10' : 'bg-gold-400/10'">
            <svg v-if="variant === 'danger'" class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <svg v-else class="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h3 class="font-serif text-lg text-white mb-2">{{ title }}</h3>
          <p class="text-gray-400 text-sm mb-6">{{ message }}</p>

          <div class="flex gap-3">
            <button
              @click="$emit('cancel')"
              class="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
            >
              {{ cancelText }}
            </button>
            <button
              @click="$emit('confirm')"
              class="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-all"
              :class="variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-gold-500 hover:bg-gold-600'"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning'
}>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'danger',
})

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
