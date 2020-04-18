import { hasOwn } from "./index.js"
export function isVNode(node) {
    return node != null && typeof node === 'object' && hasOwn(node, 'componentOptions')
}