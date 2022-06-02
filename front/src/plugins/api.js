// ----------------------------------------------------- MAIN API CLASS

class APIS {

    constructor() {
        this.credentials = null
    }

    // ----------------- INSTALLER

    install() {
        const apis = this
        Vue.mixin({
            beforeCreate() {
                this.$api = apis
            },
        })
    }


    // ----------------- UTILS

    __get_cookie(key) {
        return Object.fromEntries(document.cookie.split('; ').map(cd => cd.split('=')))[key]
    }

    // ----------------- INNER API CALLERS


    async __api_api(endpoint, method, data, headers, data_format = 'json') {
        headers = headers ?? {}
        const options = { method, headers }
        if (data) {
            headers['Content-type'] = {
                'json': 'application/json',
                'text': 'text/plain'
            }[data_format] ?? data_format
            options.body = data_format == 'json' ? JSON.stringify(data) : data
        }
        const url = ["/api", endpoint].join('/')
        const resp = await fetch(url, options)
        if (!resp.ok) throw new Error(await resp.text())
        if (resp.headers.get('content-type').includes('application/json')) return await resp.json()
        return await resp.text()
    }
    // ----------------- EXTERNAL CALLERS

    api = {
        random: () => {
            const headers = null
            return this.__api_api("random", "get", null, headers, null)
        },
        search: (data = null) => {
            const headers = null
            return this.__api_api("search", "post", data, headers, "json")
        },

    }
}

// ----------------------------------------------------- VUE INSTALL

export default new APIS()