<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-20 brightness-[2]" /></router-link>
        <div class="flex items-center gap-4">
          <button
            @click="toggleLocale"
            class="text-sm text-gray-400 hover:text-gold-400 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold-400/30"
          >
            {{ $i18n.locale === 'en' ? 'ES' : 'EN' }}
          </button>
          <span class="text-sm text-gray-400">{{ $t('create.stepOf', { current: currentStep, total: 4 }) }}</span>
        </div>
      </div>
    </nav>

    <div class="pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-center gap-2 py-8">
          <template v-for="step in 4" :key="step">
            <button
              class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-500 cursor-pointer"
              :class="step <= currentStep
                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                : 'bg-gray-800 text-gray-500 border border-gray-700'"
              @click="step < currentStep ? currentStep = step : null"
            >
              <svg v-if="step < currentStep" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ step }}</span>
            </button>
            <div
              v-if="step < 4"
              class="w-16 md:w-24 h-0.5 transition-all duration-500"
              :class="step < currentStep ? 'bg-gold-500' : 'bg-gray-800'"
            ></div>
          </template>
        </div>

        <div class="flex gap-12 mt-8" :class="currentStep === 4 ? '' : 'lg:flex-row flex-col'">
          <div :class="currentStep === 4 ? 'w-full' : 'lg:w-[58%] w-full'">
            <transition name="slide" mode="out-in">
              <div v-if="currentStep === 1" key="step1">
                <h2 class="section-title text-white mb-2">{{ $t('create.namesDate') }}</h2>
                <p class="text-gray-400 mb-10">{{ $t('create.namesDateSubtitle') }}</p>

                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-4">{{ $t('create.websiteLanguage') }}</label>
                    <div class="flex gap-3">
                      <button
                        @click="form.language = 'en'"
                        class="flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-300"
                        :class="form.language === 'en'
                          ? 'border-gold-400 bg-gold-500/10 text-gold-400'
                          : 'border-white/10 text-gray-400 hover:border-white/20'"
                      >
                        🇬🇧 {{ $t('create.english') }}
                      </button>
                      <button
                        @click="form.language = 'es'"
                        class="flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-300"
                        :class="form.language === 'es'
                          ? 'border-gold-400 bg-gold-500/10 text-gold-400'
                          : 'border-white/10 text-gray-400 hover:border-white/20'"
                      >
                        🇪🇸 {{ $t('create.spanish') }}
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">{{ $t('create.websiteLanguageHelp') }}</p>
                  </div>

                  <div class="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('create.partner1') }}</label>
                      <input
                        v-model="form.partner1"
                        type="text"
                        :placeholder="$t('create.firstName')"
                        class="form-input-field"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('create.partner2') }}</label>
                      <input
                        v-model="form.partner2"
                        type="text"
                        :placeholder="$t('create.firstName')"
                        class="form-input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('create.weddingDate') }}</label>
                    <input
                      v-model="form.date"
                      type="date"
                      class="form-input-field"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('create.location') }}</label>
                    <input
                      v-model="form.location"
                      type="text"
                      :placeholder="$t('create.locationPlaceholder')"
                      class="form-input-field"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ $t('create.venueName') }}
                      <span class="text-gray-600 font-normal">{{ $t('create.venueNameOptional') }}</span>
                    </label>
                    <input
                      v-model="form.venue"
                      type="text"
                      :placeholder="$t('create.venuePlaceholder')"
                      class="form-input-field"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('create.email') }}</label>
                    <input
                      v-model="form.email"
                      type="email"
                      :placeholder="$t('create.emailPlaceholder')"
                      class="form-input-field"
                    />
                    <p class="text-xs text-gray-500 mt-2">{{ $t('create.emailHelp') }}</p>
                  </div>
                </div>
              </div>

              <div v-else-if="currentStep === 2" key="step2">
                <h2 class="section-title text-white mb-2">{{ $t('create.chooseStyle') }}</h2>
                <p class="text-gray-400 mb-10">{{ $t('create.chooseStyleSubtitle') }}</p>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-4">{{ $t('create.decorations') }}</label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      v-for="deco in decorationOptions"
                      :key="deco.id"
                      class="relative rounded-xl border-2 p-4 pt-6 pb-3 transition-all duration-300 text-center"
                      :class="form.template === deco.templateId
                        ? 'border-gold-400 bg-gold-400/5'
                        : 'border-white/10 hover:border-white/20 bg-transparent'"
                      @click="form.template = deco.templateId"
                    >
                      <div class="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center"
                           :style="{ background: selectedPaletteColors.bg }">
                        <svg v-if="deco.type === 'branches'" class="w-7 h-7 opacity-60" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2 C11 6 13 10 11 14 C9 18 13 20 12 22" :stroke="selectedPaletteColors.primary" stroke-width="1.5" fill="none"/>
                          <ellipse cx="8" cy="6" rx="4" ry="2" transform="rotate(-30 8 6)" :fill="selectedPaletteColors.primary" opacity="0.5"/>
                          <ellipse cx="16" cy="10" rx="4" ry="2" transform="rotate(30 16 10)" :fill="selectedPaletteColors.primary" opacity="0.5"/>
                          <ellipse cx="8" cy="14" rx="3.5" ry="1.8" transform="rotate(-25 8 14)" :fill="selectedPaletteColors.primary" opacity="0.4"/>
                        </svg>
                        <svg v-else-if="deco.type === 'hearts'" class="w-7 h-7 opacity-60" viewBox="0 0 24 24" fill="none">
                          <path d="M12 21 C7 16 2 11 2 7.5 C2 4 5 2 7.5 2 C9.5 2 11 3.5 12 5 C13 3.5 14.5 2 16.5 2 C19 2 22 4 22 7.5 C22 11 17 16 12 21Z" :fill="selectedPaletteColors.primary" opacity="0.5"/>
                        </svg>
                        <svg v-else-if="deco.type === 'geometric'" class="w-7 h-7 opacity-60" viewBox="0 0 24 24" fill="none">
                          <path d="M2 10 L2 2 L10 2" :stroke="selectedPaletteColors.accent" stroke-width="1.5" fill="none"/>
                          <path d="M22 14 L22 22 L14 22" :stroke="selectedPaletteColors.accent" stroke-width="1.5" fill="none"/>
                          <rect x="8" y="8" width="8" height="8" rx="1" :stroke="selectedPaletteColors.accent" stroke-width="0.8" fill="none" opacity="0.3"/>
                        </svg>
                        <svg v-else class="w-7 h-7 opacity-40" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="1.5" :fill="selectedPaletteColors.primary" opacity="0.4"/>
                        </svg>
                      </div>
                      <p class="text-sm text-white font-medium">{{ $t('create.' + deco.labelKey) }}</p>
                    </button>
                  </div>
                </div>

                <div class="mt-10">
                  <label class="block text-sm font-medium text-gray-300 mb-4">{{ $t('create.colorPalette') }}</label>
                  <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    <div
                      v-for="palette in palettes"
                      :key="palette.id"
                      class="cursor-pointer group"
                      @click="form.palette = palette.id"
                    >
                      <div
                        class="aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300"
                        :class="form.palette === palette.id
                          ? 'border-gold-400 scale-105 shadow-lg shadow-gold-500/10'
                          : 'border-white/5 hover:border-white/20'"
                      >
                        <div class="w-full h-full flex flex-col">
                          <div class="flex-1 flex items-center justify-center" :style="{ background: palette.bg }">
                            <span class="font-script text-sm" :style="{ color: palette.primary }">A & B</span>
                          </div>
                          <div class="h-1.5 flex">
                            <div class="flex-1" :style="{ background: palette.primary }"></div>
                            <div class="flex-1" :style="{ background: palette.accent }"></div>
                            <div class="flex-1" :style="{ background: palette.bg }"></div>
                          </div>
                        </div>
                      </div>
                      <p class="text-[11px] text-gray-400 text-center mt-2 group-hover:text-gray-300 transition-colors">{{ palette.name }}</p>
                    </div>
                  </div>
                </div>

              </div>

              <div v-else-if="currentStep === 3" key="step3">
                <h2 class="section-title text-white mb-2">{{ $t('create.yourContent') }}</h2>
                <p class="text-gray-400 mb-10">{{ $t('create.yourContentSubtitle') }}</p>

                <div class="space-y-8">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">{{ $t('create.yourStory') }}</label>
                    <textarea
                      v-model="form.story"
                      rows="4"
                      :placeholder="$t('create.yourStoryPlaceholder')"
                      class="form-input-field resize-none"
                      @focus="previewRef?.scrollToSection('story')"
                    ></textarea>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-300">{{ $t('create.photoGallery') }}</label>
                        <p class="text-xs text-gray-500 mt-1">{{ $t('create.photoGallerySubtitle') }}</p>
                      </div>
                      <button
                        @click="form.galleryEnabled = !form.galleryEnabled; if (form.galleryEnabled) nextTick(() => previewRef?.scrollToSection('rsvp'))"
                        class="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
                        :class="form.galleryEnabled ? 'bg-gold-400' : 'bg-gray-700'"
                      >
                        <span
                          class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300"
                          :class="form.galleryEnabled ? 'translate-x-5' : 'translate-x-0'"
                        ></span>
                      </button>
                    </div>

                    <div v-if="form.galleryEnabled" class="space-y-4 pl-0.5">
                      <p class="text-xs text-gray-500 italic flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 flex-shrink-0 text-gold-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ $t('create.photoGalleryDraftNotice') }}
                      </p>
                      <div v-if="form.galleryPreviews.length > 0" class="space-y-3">
                        <div v-for="(photo, idx) in form.galleryPreviews" :key="'gal-' + idx"
                             class="flex gap-3 items-start bg-gray-900/50 rounded-xl p-3 border border-white/5 group">
                          <img :src="photo.url" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                          <div class="flex-1 space-y-2">
                            <input
                              v-model="photo.label"
                              type="text"
                              :placeholder="$t('create.photoCaption')"
                              class="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm
                                     focus:outline-none focus:border-gold-400/50 transition-all"
                            />
                            <input
                              v-model="photo.year"
                              type="text"
                              :placeholder="$t('create.photoYear')"
                              class="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm
                                     focus:outline-none focus:border-gold-400/50 transition-all"
                            />
                          </div>
                          <button
                            @click="removeGalleryPhoto(idx)"
                            class="text-gray-600 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div
                        v-if="form.galleryPreviews.length < 10"
                        class="border-2 border-dashed border-white/10 rounded-xl p-6 text-center
                               hover:border-gold-400/30 transition-all cursor-pointer group"
                        @click="triggerGalleryInput"
                      >
                        <input ref="galleryInput" type="file" accept="image/*" multiple class="hidden" @change="handleGalleryUpload" />
                        <svg class="w-8 h-8 mx-auto text-gray-600 group-hover:text-gold-400/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-gray-500 mt-2 text-sm">{{ $t('create.uploadPhotos') }}</p>
                        <p class="text-gray-600 mt-1 text-xs">{{ form.galleryPreviews.length }} / 10</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-300">{{ $t('create.menuSection') }}</label>
                        <p class="text-xs text-gray-500 mt-1">{{ $t('create.menuSubtitle') }}</p>
                      </div>
                      <button
                        @click="form.menuEnabled = !form.menuEnabled; if (form.menuEnabled) nextTick(() => previewRef?.scrollToSection('program'))"
                        class="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
                        :class="form.menuEnabled ? 'bg-gold-400' : 'bg-gray-700'"
                      >
                        <span
                          class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300"
                          :class="form.menuEnabled ? 'translate-x-5' : 'translate-x-0'"
                        ></span>
                      </button>
                    </div>

                    <div v-if="form.menuEnabled" class="space-y-4">
                      <div
                        v-for="(menu, mIdx) in form.menus"
                        :key="'menu-' + mIdx"
                        class="rounded-xl border border-white/10 bg-gray-900/30 p-4 space-y-4"
                      >
                        <div class="flex items-center gap-3">
                          <input
                            v-model="menu.name"
                            type="text"
                            :placeholder="$t('create.menuNamePlaceholder')"
                            class="flex-1 bg-transparent border-b border-white/10 text-white text-sm font-medium
                                   pb-1 focus:outline-none focus:border-gold-400/50 transition-all"
                          />
                          <button
                            @click="removeMenu(mIdx)"
                            class="text-gray-600 hover:text-red-400 transition-colors p-1"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <draggable
                          v-model="menu.sections"
                          handle=".section-grip"
                          item-key="name"
                          :animation="200"
                          ghost-class="opacity-30"
                          class="space-y-3"
                        >
                          <template #item="{ element: section, index: sIdx }">
                            <div class="rounded-lg border border-white/5 bg-gray-900/40 p-3 space-y-3">
                              <div class="flex items-center gap-2">
                                <div class="section-grip cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 flex-shrink-0 px-0.5">
                                  <svg class="w-4 h-5" viewBox="0 0 16 20" fill="currentColor">
                                    <circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/>
                                    <circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/>
                                    <circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/>
                                    <circle cx="5" cy="18" r="1.5"/><circle cx="11" cy="18" r="1.5"/>
                                  </svg>
                                </div>
                                <input
                                  v-model="section.name"
                                  type="text"
                                  :placeholder="$t('create.sectionNamePlaceholder')"
                                  class="flex-1 bg-transparent border-b border-white/10 text-white text-xs uppercase tracking-wider
                                         pb-1 focus:outline-none focus:border-gold-400/50 transition-all"
                                />
                                <button
                                  @click="removeMenuSection(mIdx, sIdx)"
                                  class="text-gray-600 hover:text-red-400 transition-colors p-0.5"
                                >
                                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>

                              <draggable
                                v-model="section.items"
                                handle=".item-grip"
                                item-key="name"
                                :animation="200"
                                ghost-class="opacity-30"
                                class="space-y-1.5"
                              >
                                <template #item="{ element: item, index: iIdx }">
                                  <div class="flex items-center gap-2 group">
                                    <div class="item-grip cursor-grab active:cursor-grabbing text-gray-700 hover:text-gray-500 flex-shrink-0">
                                      <svg class="w-3 h-4" viewBox="0 0 12 16" fill="currentColor">
                                        <circle cx="3.5" cy="2.5" r="1.2"/><circle cx="8.5" cy="2.5" r="1.2"/>
                                        <circle cx="3.5" cy="6.5" r="1.2"/><circle cx="8.5" cy="6.5" r="1.2"/>
                                        <circle cx="3.5" cy="10.5" r="1.2"/><circle cx="8.5" cy="10.5" r="1.2"/>
                                        <circle cx="3.5" cy="14.5" r="1.2"/><circle cx="8.5" cy="14.5" r="1.2"/>
                                      </svg>
                                    </div>
                                    <input
                                      v-model="item.name"
                                      type="text"
                                      :placeholder="$t('create.dishPlaceholder')"
                                      class="flex-1 bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm
                                             focus:outline-none focus:border-gold-400/50 transition-all"
                                    />
                                    <button
                                      @click="removeDish(mIdx, sIdx, iIdx)"
                                      class="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
                                    >
                                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                </template>
                              </draggable>

                              <div class="flex items-center justify-between">
                                <button
                                  @click="addDish(mIdx, sIdx)"
                                  class="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1"
                                >
                                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                  </svg>
                                  {{ $t('create.addDish') }}
                                </button>
                                <label class="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    v-model="section.choose"
                                    class="w-3.5 h-3.5 accent-gold-400 rounded"
                                  />
                                  <span class="text-xs text-gray-400">{{ $t('create.chooseOption') }}</span>
                                </label>
                              </div>
                            </div>
                          </template>
                        </draggable>

                        <button
                          @click="addMenuSection(mIdx)"
                          class="w-full text-xs text-gray-400 hover:text-gold-400 transition-colors py-2 border border-dashed border-white/10 rounded-lg hover:border-gold-400/30 flex items-center justify-center gap-1"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          {{ $t('create.addSection') }}
                        </button>
                      </div>

                      <button
                        @click="addMenu"
                        class="w-full text-sm text-gold-400 hover:text-gold-300 transition-colors py-3 border-2 border-dashed border-white/10 rounded-xl hover:border-gold-400/30 flex items-center justify-center gap-2"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        {{ $t('create.addMenu') }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <label class="block text-sm font-medium text-gray-300">{{ $t('create.dayProgram') }}</label>
                      <button @click="addProgramEntry(); previewRef?.scrollToSection('program')" class="text-sm text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        {{ $t('create.addEntry') }}
                      </button>
                    </div>
                    <div class="space-y-3">
                      <transition-group name="list">
                        <div
                          v-for="(entry, index) in form.program"
                          :key="'prog-' + index"
                          class="flex gap-3 items-center group"
                        >
                          <div class="relative">
                            <input
                              v-model="entry.time"
                              type="time"
                              class="w-28 bg-gray-900 border border-white/10 rounded-xl px-3 py-3 text-white
                                     focus:outline-none focus:border-gold-400/50 transition-all text-sm"
                            />
                          </div>
                          <input
                            v-model="entry.description"
                            type="text"
                            :placeholder="$t('create.programPlaceholder')"
                            class="flex-1 form-input-field"
                          />
                          <button
                            @click="form.program.splice(index, 1)"
                            class="text-gray-700 hover:text-red-400 transition-colors px-1 opacity-0 group-hover:opacity-100"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </transition-group>
                      <div v-if="form.program.length === 0" class="text-center py-8 text-gray-600 text-sm">
                        {{ $t('create.noProgramEntries') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="currentStep === 4" key="step4">
                <h2 class="section-title text-white mb-2">{{ $t('create.previewPublish') }}</h2>
                <p class="text-gray-400 mb-6">{{ $t('create.previewPublishSubtitle') }}</p>

                <div class="mb-8">
                  <WeddingPreview :form="form" :full-width="true" />
                </div>

                <div class="max-w-xl mx-auto space-y-6">
                  <div class="p-6 rounded-2xl bg-gray-900/50 border border-white/5">
                    <h3 class="font-serif text-xl text-white mb-4">{{ $t('create.summary') }}</h3>
                    <dl class="space-y-3 text-sm">
                      <div class="flex justify-between">
                        <dt class="text-gray-400">{{ $t('create.couple') }}</dt>
                        <dd class="text-white">{{ form.partner1 }} & {{ form.partner2 }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-400">{{ $t('create.date') }}</dt>
                        <dd class="text-white">{{ formattedDate }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-400">{{ $t('create.locationLabel') }}</dt>
                        <dd class="text-white">{{ form.location }}</dd>
                      </div>
                      <div v-if="form.venue" class="flex justify-between">
                        <dt class="text-gray-400">{{ $t('create.venue') }}</dt>
                        <dd class="text-white">{{ form.venue }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-400">{{ $t('create.style') }}</dt>
                        <dd class="text-white">
                          {{ TEMPLATES.find(t => t.id === form.template)?.name }}
                          &middot;
                          {{ palettes.find(p => p.id === form.palette)?.name }}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <button
                    @click="publish"
                    class="w-full btn-primary text-lg py-4"
                    :disabled="isPublishing"
                  >
                    <span v-if="isPublishing" class="flex items-center justify-center gap-3">
                      <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      {{ $t('create.publishing') }}
                    </span>
                    <span v-else>
                      {{ $t('create.publishFor') }}
                      <svg class="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>

                  <button
                    @click="sharePreview"
                    class="w-full btn-secondary py-3"
                  >
                    {{ $t('create.sharePreviewLink') }}
                  </button>
                </div>
              </div>
            </transition>

            <div v-if="currentStep < 4" class="flex justify-between mt-12">
              <button
                v-if="currentStep > 1"
                @click="goBack"
                class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                {{ $t('create.back') }}
              </button>
              <div v-else></div>

              <button
                @click="nextStep"
                class="btn-primary"
                :disabled="!canProceed"
              >
                <span v-if="isSaving" class="flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {{ $t('create.saving') }}
                </span>
                <span v-else class="flex items-center gap-2">
                  {{ $t('create.continue') }}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div v-if="currentStep < 4" class="hidden lg:block lg:w-[42%]">
            <div class="sticky top-28">
              <p class="text-sm text-gray-500 mb-4 text-center font-sans tracking-wide">{{ $t('create.livePreview') }}</p>
              <WeddingPreview ref="previewRef" :form="form" />
            </div>
          </div>
        </div>

        <div v-if="currentStep < 4" class="lg:hidden mt-12">
          <p class="text-sm text-gray-500 mb-4 text-center">{{ $t('create.preview') }}</p>
          <WeddingPreview :form="form" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'
import { TEMPLATES, PALETTES, getDefaultPaletteForTemplate, getPaletteColors } from '@/config/templates'
import WeddingPreview from '@/components/WeddingPreview.vue'
import draggable from 'vuedraggable'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const currentStep = ref(1)
const isPublishing = ref(false)
const isSaving = ref(false)
const weddingId = ref<string | null>(null)
const secretToken = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const galleryInput = ref<HTMLInputElement | null>(null)
const previewRef = ref<InstanceType<typeof WeddingPreview> | null>(null)

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}

const form = ref({
  partner1: '',
  partner2: '',
  date: '',
  location: '',
  venue: '',
  email: '',
  template: 'classic-garden',
  palette: 'sage-cream',
  photo: null as File | null,
  photoPreview: '',
  galleryEnabled: false,
  galleryFiles: [] as File[],
  galleryPreviews: [] as { url: string; year: string; label: string }[],
  story: '',
  language: 'es',
  menuEnabled: false,
  menus: [] as { name: string; sections: { name: string; items: { name: string }[]; choose: boolean }[] }[],
  program: [
    { time: '15:00', description: 'Ceremony' },
    { time: '16:00', description: 'Cocktail Hour' },
    { time: '18:00', description: 'Dinner & Celebration' },
  ],
})

const palettes = PALETTES

if (route.query.template) {
  const tpl = route.query.template as string
  form.value.template = tpl
  form.value.palette = getDefaultPaletteForTemplate(tpl)
}

function addMenu() {
  form.value.menus.push({
    name: form.value.menus.length === 0 ? 'Menú' : '',
    sections: [
      { name: '', items: [{ name: '' }], choose: false },
    ],
  })
  setTimeout(() => previewRef.value?.scrollToSection('menu'), 300)
}

function removeMenu(idx: number) {
  form.value.menus.splice(idx, 1)
}

function addMenuSection(menuIdx: number) {
  form.value.menus[menuIdx].sections.push({ name: '', items: [{ name: '' }], choose: false })
}

function removeMenuSection(menuIdx: number, secIdx: number) {
  form.value.menus[menuIdx].sections.splice(secIdx, 1)
}

function moveMenuSection(menuIdx: number, secIdx: number, dir: -1 | 1) {
  const sections = form.value.menus[menuIdx].sections
  const target = secIdx + dir
  if (target < 0 || target >= sections.length) return
  const tmp = sections[secIdx]
  sections[secIdx] = sections[target]
  sections[target] = tmp
}

function addDish(menuIdx: number, secIdx: number) {
  form.value.menus[menuIdx].sections[secIdx].items.push({ name: '' })
}

function removeDish(menuIdx: number, secIdx: number, itemIdx: number) {
  form.value.menus[menuIdx].sections[secIdx].items.splice(itemIdx, 1)
}

const decorationOptions = [
  { id: 'none', type: 'none', templateId: 'minimal-white', labelKey: 'decoNone' },
  { id: 'branches', type: 'branches', templateId: 'classic-garden', labelKey: 'decoBranches' },
  { id: 'hearts', type: 'hearts', templateId: 'romantic-blush', labelKey: 'decoHearts' },
  { id: 'geometric', type: 'geometric', templateId: 'modern-dark', labelKey: 'decoGeometric' },
]

const selectedPaletteColors = computed(() => getPaletteColors(form.value.palette))

let storyScrolledOnce = false
watch(() => form.value.story, (val) => {
  if (!storyScrolledOnce && val && val.length > 5) {
    storyScrolledOnce = true
    setTimeout(() => previewRef.value?.scrollToSection('story'), 200)
  }
})

let menuScrolledOnce = false
watch(() => form.value.menus, () => {
  if (!menuScrolledOnce && form.value.menuEnabled && form.value.menus.some(m => m.sections.some(s => s.items.some(i => i.name)))) {
    menuScrolledOnce = true
    setTimeout(() => previewRef.value?.scrollToSection('menu'), 200)
  }
}, { deep: true })

const dateLocale = computed(() => locale.value === 'es' ? 'es-ES' : 'en-US')

const formattedDate = computed(() => {
  if (!form.value.date) return t('create.yourWeddingDate')
  return new Date(form.value.date + 'T00:00:00').toLocaleDateString(dateLocale.value, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return form.value.partner1 && form.value.partner2 && form.value.date && form.value.email
  }
  return true
})

let saveTimeout: ReturnType<typeof setTimeout> | null = null

watch(form, () => {
  if (!weddingId.value) return
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => saveWedding(), 2000)
}, { deep: true })

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  form.value.photo = file
  form.value.photoPreview = URL.createObjectURL(file)

  if (weddingId.value) {
    const fd = new FormData()
    fd.append('photo', file)
    const tp = secretToken.value ? `?token=${secretToken.value}` : ''
    try {
      await fetch(`/api/weddings/${weddingId.value}/photo${tp}`, {
        method: 'POST',
        body: fd,
      })
    } catch {
      //
    }
  }
}

function triggerGalleryInput() {
  galleryInput.value?.click()
}

function handleGalleryUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files) return

  const remaining = 10 - form.value.galleryPreviews.length
  const filesToAdd = Array.from(files).slice(0, remaining)

  for (const file of filesToAdd) {
    form.value.galleryFiles.push(file)
    form.value.galleryPreviews.push({
      url: URL.createObjectURL(file),
      year: '',
      label: '',
    })
  }

  target.value = ''
}

function removeGalleryPhoto(index: number) {
  form.value.galleryFiles.splice(index, 1)
  form.value.galleryPreviews.splice(index, 1)
}

function addProgramEntry() {
  form.value.program.push({ time: '', description: '' })
}

function goBack() {
  currentStep.value--
}

async function nextStep() {
  if (currentStep.value === 1 && !weddingId.value) {
    isSaving.value = true
    await saveWedding()
    isSaving.value = false
  } else if (weddingId.value) {
    await saveWedding()
  }
  currentStep.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function saveWedding() {
  try {
    const photosMetadata = form.value.galleryPreviews
      .filter((p: { url: string }) => !p.url.startsWith('blob:'))
      .map((p: { url: string; year: string; label: string }) => ({
        url: p.url,
        year: p.year || '',
        label: p.label || '',
      }))

    const body = {
      partner1_name: form.value.partner1,
      partner2_name: form.value.partner2,
      date: form.value.date,
      location: form.value.location,
      venue: form.value.venue,
      email: form.value.email,
      template: form.value.template,
      palette: form.value.palette,
      story: form.value.story,
      language: form.value.language,
      menu: form.value.menuEnabled && form.value.menus.length > 0 ? form.value.menus : undefined,
      program: form.value.program,
      photos: photosMetadata.length > 0 ? photosMetadata : undefined,
    }

    const method = weddingId.value ? 'PUT' : 'POST'
    const tokenParam = secretToken.value ? `?token=${secretToken.value}` : ''
    const url = weddingId.value ? `/api/weddings/${weddingId.value}${tokenParam}` : '/api/weddings'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    const isNew = !weddingId.value
    if (isNew) {
      weddingId.value = data.id
      if (data.secret_token) {
        secretToken.value = data.secret_token
      }
    }

    if (form.value.photo && isNew) {
      const fd = new FormData()
      fd.append('photo', form.value.photo)
      await fetch(`/api/weddings/${data.id}/photo`, {
        method: 'POST',
        body: fd,
      })
    }

  } catch {
    //
  }
}

async function uploadPendingPhotos() {
  const pendingFiles = form.value.galleryFiles.filter((_, i) =>
    form.value.galleryPreviews[i]?.url.startsWith('blob:')
  )
  if (pendingFiles.length === 0 || !weddingId.value) return

  const fd = new FormData()
  for (const file of pendingFiles) {
    fd.append('photos', file)
  }
  const tp = secretToken.value ? `?token=${secretToken.value}` : ''
  try {
    const res = await fetch(`/api/weddings/${weddingId.value}/gallery${tp}`, {
      method: 'POST',
      body: fd,
    })
    const data = await res.json()
    if (data.photos) {
      form.value.galleryPreviews = data.photos.map((p: { url: string; year: string; label: string }) => ({
        url: p.url,
        year: p.year || '',
        label: p.label || '',
      }))
      form.value.galleryFiles = []
    }
  } catch {
    //
  }
}

async function publish() {
  isPublishing.value = true
  await saveWedding()
  await uploadPendingPhotos()

  try {
    const res = await fetch(`/api/weddings/${weddingId.value}/publish`, {
      method: 'POST',
    })
    const data = await res.json()

    if (data.url && data.url.startsWith('http')) {
      window.location.href = data.url
    } else if (data.slug) {
      router.push(`/dashboard/${weddingId.value}?token=${secretToken.value}`)
    }
  } catch {
    //
  } finally {
    isPublishing.value = false
  }
}

async function sharePreview() {
  await saveWedding()
  if (weddingId.value) {
    const url = `${window.location.origin}/preview/${weddingId.value}`
    await navigator.clipboard.writeText(url)
    alert('Preview link copied to clipboard!')
  }
}

onMounted(async () => {
  const id = route.query.id as string
  const token = route.query.token as string
  if (!id) return

  try {
    const tp = token ? `?token=${token}` : ''
    const res = await fetch(`/api/weddings/${id}${tp}`)
    if (!res.ok) return
    const data = await res.json()

    weddingId.value = data.id
    secretToken.value = data.secret_token || token || null

    form.value.partner1 = data.partner1_name || ''
    form.value.partner2 = data.partner2_name || ''
    form.value.date = data.date || ''
    form.value.location = data.location || ''
    form.value.venue = data.venue || ''
    form.value.email = data.email || ''
    form.value.template = data.template || 'classic-garden'
    form.value.story = data.story || ''
    form.value.language = data.language || 'es'
    form.value.photoPreview = data.photo_url || ''

    if (data.colors) {
      try {
        const colors = typeof data.colors === 'string' ? JSON.parse(data.colors) : data.colors
        const palMap: Record<string, string> = {
          '#7A8B5E': 'sage-cream',
          '#D4A0A0': 'blush-gold',
          '#333333': 'mono',
          '#1B3A5C': 'navy-gold',
          '#8B4513': 'terracotta',
          '#6B4C7A': 'lavender',
        }
        form.value.palette = palMap[colors.primary] || getDefaultPaletteForTemplate(data.template)
      } catch {
        form.value.palette = getDefaultPaletteForTemplate(data.template)
      }
    }

    if (data.menu) {
      try {
        const menuData = typeof data.menu === 'string' ? JSON.parse(data.menu) : data.menu
        if (Array.isArray(menuData) && menuData.length > 0) {
          if ('sections' in menuData[0]) {
            form.value.menus = menuData
          } else {
            form.value.menus = [{
              name: 'Menú',
              sections: menuData.map((s: { title?: string; items?: string[]; phases?: { name: string; items: string[]; choose?: boolean }[] }) => ({
                name: s.title || '',
                items: (s.phases ? s.phases.flatMap((p: { items: string[] }) => p.items) : s.items || []).map((i: string) => ({ name: i })),
                choose: s.phases?.some((p: { choose?: boolean }) => p.choose) || false,
              })),
            }]
          }
          form.value.menuEnabled = true
        }
      } catch { /* keep default */ }
    }

    if (data.program) {
      try {
        form.value.program = typeof data.program === 'string' ? JSON.parse(data.program) : data.program
      } catch { /* keep default */ }
    }

    if (data.photos) {
      try {
        const photos = typeof data.photos === 'string' ? JSON.parse(data.photos) : data.photos
        form.value.galleryPreviews = photos.map((p: { url: string; year: string; label: string }) => ({
          url: p.url,
          year: p.year || '',
          label: p.label || '',
        }))
      } catch { /* keep default */ }
    }
  } catch {
    //
  }
})
</script>

<style scoped>
.form-input-field {
  width: 100%;
  background: rgb(17 24 39);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  transition: all 0.2s ease;
}

.form-input-field::placeholder {
  color: rgb(75 85 99);
}

.form-input-field:focus {
  outline: none;
  border-color: rgba(212, 168, 83, 0.5);
  box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.1);
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
