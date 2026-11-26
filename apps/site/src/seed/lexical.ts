// Petits utilitaires pour écrire du texte riche (format Lexical de Payload) depuis le code.

type Node = Record<string, unknown>

const text = (value: string, bold = false): Node => ({
  type: 'text',
  text: value,
  format: bold ? 1 : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const block = (type: string, children: Node[], extra: Node = {}): Node => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
})

const boldRuns = (value: string): Node[] =>
  // split avec groupe capturant : indices impairs = segments en gras
  value
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => ({ part, bold: i % 2 === 1 }))
    .filter(({ part }) => part.length > 0)
    .map(({ part, bold }) => text(part, bold))

const link = (label: string, url: string): Node => ({
  type: 'link',
  children: [text(label)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 3,
  fields: { url, newTab: false, linkType: 'custom' },
})

/** Paragraphe. `**gras**` et les liens `[texte](/adresse)` sont pris en charge. */
export const p = (value: string): Node => {
  const children: Node[] = []
  // split avec 2 groupes capturants : [texte, libellé, adresse, texte, libellé, adresse, …]
  const parts = value.split(/\[([^\]]+)\]\(([^)\s]+)\)/g)
  for (let i = 0; i < parts.length; i += 3) {
    children.push(...boldRuns(parts[i]))
    if (i + 2 < parts.length) children.push(link(parts[i + 1], parts[i + 2]))
  }
  return block('paragraph', children, { textFormat: 0, textStyle: '' })
}

export const h2 = (value: string): Node => block('heading', [text(value)], { tag: 'h2' })
export const h3 = (value: string): Node => block('heading', [text(value)], { tag: 'h3' })

export const ul = (items: string[]): Node =>
  block(
    'list',
    items.map((item, i) => block('listitem', p(item).children as Node[], { value: i + 1 })),
    { listType: 'bullet', start: 1, tag: 'ul' },
  )

export const doc = (...children: Node[]) => ({
  root: { type: 'root', children, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 },
})
