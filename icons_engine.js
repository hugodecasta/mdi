import fetch from 'node-fetch'
import fs from 'fs'

const icons_dir = './icons_data'
const per_icon_dir = icons_dir + '/icons'

if (!fs.existsSync(per_icon_dir)) fs.mkdirSync(per_icon_dir, { recursive: true })

const icons_data_promise = {}
const icons_data = {}
const icon_index = {}

fs.readdirSync(per_icon_dir).forEach(f => {
    const icon_id = f.replace('.json', '')
    icons_data[icon_id] = JSON.parse(fs.readFileSync(per_icon_dir + '/' + f))
})

/*
icon: {
    comments:[],
    data:SVG,
    date:String,
    description,
    id,
    isAuthor,
    name,
    tags,
    user: {name, twitter}
}
*/

async function get_icon_data(icon_id) {
    return await (await fetch('https://materialdesignicons.com/api/icon/' + icon_id)).json()
}

let count = 0
let i = 0
let end_cb = null
async function launch_icon_retrieval(icon) {
    return new Promise(ok => {
        const icon_id = icon.id
        const exists = icon_id in icons_data
        setTimeout(async () => {
            let ret_icon = null
            try {
                ret_icon = exists ? icons_data[icon_id] : { ...icon, ...await get_icon_data(icon_id) }
                // console.log(i++ / count)
                if (!exists) fs.writeFileSync(per_icon_dir + '/' + icon_id + '.json', JSON.stringify(ret_icon))
                i++
                if (i == count && end_cb) end_cb()
            } catch (e) {
                console.error('ERROR on icon ret', e)
                console.log('redoing')
                ret_icon(icon)
            }
            ok(ret_icon)
        }, exists ? 0 : (Math.random() * 60000))
    })
}

async function ret_icon(icon) {
    icons_data_promise[icon.id] = launch_icon_retrieval(icon)
    icons_data[icon.id] = await icons_data_promise[icon.id]
}

export function listen_to_load(cb) {
    end_cb = cb
    if (i > 0 && i == count && end_cb) {
        end_cb()
    }
}

export function loaded() {
    return { count, loaded: i }
}

async function generate_index() {
    await Promise.all(Object.entries(icons_data).map(async ([icon_id, icon]) => {
        const text_data = [
            icon.name,
            icon.aliases,
            Object.values(icon.user ?? {}),
            icon.tags?.map(t => t.text),
            icon.description
        ].flat(100).filter(e => e)
        const uni_text = text_data.join(' ').replace(/-|\./g, ' ')
        const words = uni_text.split(' ').filter(e => e).map(w => w.toLowerCase())
            .filter(e => !e.includes('http://') && !e.includes('https://'))
            .filter((e, i, s) => s.indexOf(e) == i)

        words.forEach(word => {
            if (!icon_index[word]) icon_index[word] = []
            icon_index[word].push(icon_id)
        })

    }))
}

export async function init() {
    const init_data = await (await fetch('https://materialdesignicons.com/api/init')).json()
    const p_id = init_data.packages[0].id
    console.log('loading package', p_id, '...')
    const icons = (await (await fetch('https://materialdesignicons.com/api/package/' + p_id)).json()).icons
    console.log('loading icon data retrieval...')
    count = icons.length
    icons.forEach(async icon => ret_icon(icon))
    await Promise.all(Object.values(icons_data_promise))
    console.log('launching index generation...')
    await generate_index()
    console.log(' - init done !')
}

export function search(text) {
    if (text.length < 3 || (i / count) < 1) return null

    const search_words = text.toLowerCase().replace(/-|\./g, ' ').split(' ').filter(e => e)
    const indexed_words = Object.keys(icon_index)

    function retrieve_word_icon_ids(word) {
        const is_include = !word.includes('!')
        word = word.replace('!', '')
        const words_ret = indexed_words.filter(index_word => index_word.includes(word))
        const all_icon_ids = words_ret.map(word => icon_index[word])
        const icon_ids = all_icon_ids.flat()
        return { is_include, bag: icon_ids.filter((e, i, s) => s.indexOf(e) == i) }
    }

    function intersect(bags) {
        let final_bag = Object.keys(icons_data)
        for (const { is_include, bag } of bags) {
            final_bag = final_bag.filter(id => is_include ? bag.includes(id) : !bag.includes(id))
        }
        return final_bag
    }

    const bags = search_words.map(retrieve_word_icon_ids)

    const final_icon_ids = intersect(bags)

    return final_icon_ids.map(icon_id => icons_data[icon_id])

}

export function random() {
    const all_ids = Object.keys(icons_data)
    const picked_ids = []
    function pick_random_icon_id() {
        const picked_id = all_ids[Math.floor(Math.random() * all_ids.length)]
        if (picked_ids.includes(picked_id)) return pick_random_icon_id()
        return picked_id
    }
    const nb = 48
    Array(nb).fill(0).forEach(() => picked_ids.push(pick_random_icon_id()))
    const all_icons = picked_ids.map(icon_id => icons_data[icon_id])
    return all_icons
}

export function clicked_on(icon_id) {
    icons_data[icon_id].clicked = (icons_data[icon_id].clicked ?? 0) + 1
    fs.writeFileSync(per_icon_dir + '/' + icon_id + '.json', JSON.stringify(icons_data[icon_id]))
}