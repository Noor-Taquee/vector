
export function createElement<K extends keyof HTMLElementTagNameMap>(
  name: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  nodes: Node[] = []
) {
  const el = document.createElement(name);
  Object.assign(el, props);
  el.append(...nodes);
  return el;
}
