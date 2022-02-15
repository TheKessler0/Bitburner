import * as bitburner from './NetscriptDefinitions'

export { }

declare global {
    const _: typeof _

    type NS = bitburner.NS

    type AutocompleteConfig = [string, string | number | boolean | string[]][]

    interface AutocompleteData {
        servers: string[],
        txts: string[],
        scripts: string[],
        flags: (config: AutocompleteConfig) => any
    }

    interface INetscriptExtra extends NS {
        heart: {
            break(): number
        }
        exploit(): void
        bypass(doc: Document): void
        alterReality(): void
    }
}
