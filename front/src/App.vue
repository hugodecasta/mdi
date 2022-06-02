<template>
    <div
        class='pa-5 mt-10'
        style='max-width:800px;margin:auto'
    >
        <h1>Material Design Icons</h1>
        <v-text-field
            :outlined="true"
            v-model="search_text"
            label="search for icon"
        ></v-text-field>
        {{search_text}}
        <v-switch
            color="primary"
            v-model="copy_with_mdi"
            label='copy width "mdi" prefix'
        ></v-switch>
        <v-card-title>{{data_text}}</v-card-title>
        <v-progress-circular
            v-if="searching"
            indeterminate
        ></v-progress-circular>
        <icon
            v-for="icon in icons_to_disp"
            :key="icon.id"
            :copy_with_mdi="copy_with_mdi"
            :icon="icon"
        />
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive, computed, watch } from 'vue'
import api from './plugins/api'
import icon from './components/icon.vue'

const search_text = ref('')

const copy_with_mdi = ref(false)

const icons_to_disp = reactive([])

const is_searching = computed(() => search_text.value != "")
const needs_more = computed(() => is_searching.value && search_text.value.length < 3)

const searching = ref(false)

function set_icons(icons) {
    icons_to_disp.splice(0, 100000)
    icons_to_disp.push(...icons)
}

async function search() {
    searching.value = true
    const found = await api.api.search({ text: search_text.value })
    console.log(found)
    searching.value = false
    set_icons(found)
}

let to = null
watch(search_text, () => {
    clearTimeout(to)
    if (!is_searching.value || needs_more.value) {
        data_text.value = 'need a little more and we\'re good'
        return
    }
    to = setTimeout(search, 300)
})

onMounted(async () => {
    set_icons(await api.api.random())

})

</script>
