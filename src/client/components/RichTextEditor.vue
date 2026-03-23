<template>
  <div class="rich-editor-wrap">
    <div class="rich-editor-toolbar">
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: isBold }"
        title="Bold"
        @mousedown.prevent="execBold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        class="toolbar-btn toolbar-btn-italic"
        :class="{ active: isItalic }"
        title="Italic"
        @mousedown.prevent="execItalic"
      >
        <em>I</em>
      </button>
      <span class="toolbar-sep"></span>
      <button
        type="button"
        class="toolbar-btn"
        title="Link"
        @mousedown.prevent="openPopup('link')"
      >
        🔗
      </button>
      <button
        type="button"
        class="toolbar-btn"
        title="Google Maps"
        @mousedown.prevent="openPopup('map')"
      >
        📍
      </button>
      <button
        type="button"
        class="toolbar-btn"
        title="Phone"
        @mousedown.prevent="openPopup('phone')"
      >
        📞
      </button>
      <button
        type="button"
        class="toolbar-btn"
        title="Email"
        @mousedown.prevent="openPopup('email')"
      >
        ✉️
      </button>
    </div>

    <div
      v-if="popup.show"
      class="link-popup"
    >
      <div class="link-popup-inner">
        <label class="link-popup-label">{{ popupLabel }}</label>
        <input
          ref="popupInput"
          v-model="popup.value"
          type="text"
          :placeholder="popupPlaceholder"
          class="link-popup-input"
          @keydown.enter.prevent="insertLink"
          @keydown.escape.prevent="closePopup"
        />
        <div v-if="popup.type === 'link' || popup.type === 'map'" class="link-popup-text-row">
          <label class="link-popup-label">Text</label>
          <input
            v-model="popup.text"
            type="text"
            placeholder="Link text (optional)"
            class="link-popup-input"
            @keydown.enter.prevent="insertLink"
            @keydown.escape.prevent="closePopup"
          />
        </div>
        <div class="link-popup-actions">
          <button type="button" class="link-popup-btn link-popup-cancel" @click="closePopup">Cancel</button>
          <button type="button" class="link-popup-btn link-popup-insert" @click="insertLink">Insert</button>
        </div>
      </div>
    </div>

    <div
      ref="editorEl"
      class="rich-editor-content"
      contenteditable="true"
      :data-placeholder="placeholder"
      @input="onInput"
      @keyup="updateToolbarState"
      @mouseup="updateToolbarState"
      @focus="updateToolbarState"
      @paste="onPaste"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'a', 'br', 'p', 'span']

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorEl = ref<HTMLDivElement | null>(null)
const popupInput = ref<HTMLInputElement | null>(null)
const isBold = ref(false)
const isItalic = ref(false)
const savedSelection = ref<Range | null>(null)

const popup = ref({
  show: false,
  type: '' as 'link' | 'map' | 'phone' | 'email',
  value: '',
  text: '',
})

const popupLabel = computed(() => {
  switch (popup.value.type) {
    case 'link': return 'URL'
    case 'map': return 'Google Maps URL'
    case 'phone': return 'Phone number'
    case 'email': return 'Email address'
    default: return ''
  }
})

const popupPlaceholder = computed(() => {
  switch (popup.value.type) {
    case 'link': return 'https://example.com'
    case 'map': return 'https://maps.google.com/...'
    case 'phone': return '+1 234 567 890'
    case 'email': return 'name@example.com'
    default: return ''
  }
})

function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const clean = sanitizeNode(doc.body)
  const tmp = document.createElement('div')
  for (const child of Array.from(clean.childNodes)) {
    tmp.appendChild(child)
  }
  return tmp.innerHTML
}

function sanitizeNode(node: Node): DocumentFragment {
  const frag = document.createDocumentFragment()

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      frag.appendChild(document.createTextNode(child.textContent || ''))
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement
      const tag = el.tagName.toLowerCase()

      if (ALLOWED_TAGS.includes(tag)) {
        const newEl = document.createElement(tag)

        if (tag === 'a') {
          const href = el.getAttribute('href')
          if (href) {
            newEl.setAttribute('href', href)
            newEl.setAttribute('target', '_blank')
            newEl.setAttribute('rel', 'noopener noreferrer')
          }
        }

        const children = sanitizeNode(el)
        newEl.appendChild(children)
        frag.appendChild(newEl)
      } else {
        const children = sanitizeNode(el)
        frag.appendChild(children)
      }
    }
  }

  return frag
}

function saveSelection() {
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    savedSelection.value = sel.getRangeAt(0).cloneRange()
  }
}

function restoreSelection() {
  if (savedSelection.value) {
    const sel = window.getSelection()
    if (sel) {
      sel.removeAllRanges()
      sel.addRange(savedSelection.value)
    }
  }
}

function updateToolbarState() {
  isBold.value = document.queryCommandState('bold')
  isItalic.value = document.queryCommandState('italic')
}

function execBold() {
  editorEl.value?.focus()
  document.execCommand('bold')
  updateToolbarState()
  emitValue()
}

function execItalic() {
  editorEl.value?.focus()
  document.execCommand('italic')
  updateToolbarState()
  emitValue()
}

function openPopup(type: 'link' | 'map' | 'phone' | 'email') {
  saveSelection()
  const sel = window.getSelection()
  const selectedText = sel?.toString() || ''

  popup.value = {
    show: true,
    type,
    value: '',
    text: selectedText,
  }

  nextTick(() => {
    popupInput.value?.focus()
  })
}

function closePopup() {
  popup.value.show = false
  popup.value.value = ''
  popup.value.text = ''
  editorEl.value?.focus()
  restoreSelection()
}

function insertLink() {
  const { type, value, text } = popup.value
  if (!value.trim()) {
    closePopup()
    return
  }

  let href = value.trim()
  let displayText = text.trim() || href

  switch (type) {
    case 'phone':
      href = `tel:${href.replace(/\s/g, '')}`
      displayText = text.trim() || value.trim()
      break
    case 'email':
      href = `mailto:${href}`
      displayText = text.trim() || value.trim()
      break
    case 'map':
      if (!href.startsWith('http')) {
        href = `https://${href}`
      }
      displayText = text.trim() || 'View on Maps'
      break
    case 'link':
      if (!href.startsWith('http') && !href.startsWith('//')) {
        href = `https://${href}`
      }
      break
  }

  restoreSelection()

  const linkHtml = `<a href="${href}" target="_blank" rel="noopener noreferrer">${displayText}</a>`
  document.execCommand('insertHTML', false, linkHtml)

  popup.value.show = false
  popup.value.value = ''
  popup.value.text = ''

  emitValue()
}

function onInput() {
  emitValue()
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}

function emitValue() {
  if (!editorEl.value) return
  const raw = editorEl.value.innerHTML
  const sanitized = sanitizeHtml(raw)
  emit('update:modelValue', sanitized)
}

function setContent(html: string) {
  if (editorEl.value && editorEl.value.innerHTML !== html) {
    editorEl.value.innerHTML = html
  }
}

onMounted(() => {
  if (props.modelValue) {
    setContent(props.modelValue)
  }
})

watch(() => props.modelValue, (newVal) => {
  if (!editorEl.value) return
  if (document.activeElement === editorEl.value) return
  setContent(newVal)
})
</script>

<style scoped>
.rich-editor-wrap {
  position: relative;
}

.rich-editor-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  background: rgb(17 24 39);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  border-radius: 0.75rem 0.75rem 0 0;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: rgb(156 163 175);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s ease;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.toolbar-btn.active {
  background: rgba(212, 168, 83, 0.15);
  color: rgb(212, 168, 83);
}

.toolbar-btn-italic {
  font-family: Georgia, serif;
}

.toolbar-sep {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 4px;
}

.rich-editor-content {
  width: 100%;
  min-height: 120px;
  background: rgb(17 24 39);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 0.75rem 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  overflow-y: auto;
}

.rich-editor-content:focus {
  border-color: rgba(212, 168, 83, 0.5);
  box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.1);
}

.rich-editor-content:empty::before {
  content: attr(data-placeholder);
  color: rgb(75 85 99);
  pointer-events: none;
}

.rich-editor-content :deep(a) {
  color: rgb(212, 168, 83);
  text-decoration: none;
  border-bottom: 1px solid rgba(212, 168, 83, 0.3);
}

.rich-editor-content :deep(a:hover) {
  border-bottom-color: rgb(212, 168, 83);
}

.link-popup {
  position: absolute;
  top: 42px;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 0 8px;
}

.link-popup-inner {
  background: rgb(31 41 55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.link-popup-label {
  display: block;
  font-size: 11px;
  color: rgb(156 163 175);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.link-popup-input {
  width: 100%;
  background: rgb(17 24 39);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 6px 10px;
  color: white;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s ease;
}

.link-popup-input:focus {
  border-color: rgba(212, 168, 83, 0.5);
}

.link-popup-text-row {
  margin-top: 8px;
}

.link-popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.link-popup-btn {
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.link-popup-cancel {
  background: transparent;
  color: rgb(156 163 175);
}

.link-popup-cancel:hover {
  color: white;
}

.link-popup-insert {
  background: rgb(212, 168, 83);
  color: rgb(17 24 39);
}

.link-popup-insert:hover {
  background: rgb(196, 155, 70);
}
</style>
