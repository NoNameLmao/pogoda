import { enable } from 'colors'
enable()

export const logger = new class Logger {
    file = ''
    useWebhook = false
    error(data: JSONResolvable) {
        console.log(`${formatDate()} - ${' err'.red}:`, data)
    }
    warn(data: JSONResolvable) {
        console.log(`${formatDate()} - ${'warn'.yellow}:`, data)
    }
    info(data: JSONResolvable) {
        console.log(`${formatDate()} - ${'info'.cyan}:`, data)
    }
    ok(data: JSONResolvable) {
        console.log(`${formatDate()} - ${'  ok'.green}:`, data)
    }
}
export function formatDate() {
    return `${new Date().toLocaleDateString().replace(/\//g, '.')}-${new Date().toLocaleTimeString().replace(/:/g, '.')}`
}

type JSONResolvable = string | number | boolean | {[key: string]: JSONResolvable} | {[key: string]: JSONResolvable}[] | null