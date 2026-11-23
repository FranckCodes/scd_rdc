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

/** Paragraphe. `**gras**` est pris en charge pour un segment en gras. */
export const p = (value: string): Node => {
  // split avec groupe capturant : indices impairs = segments en gras
  const parts = value
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => ({ part, bold: i % 2 === 1 }))
    .filter(({ part }) => part.length > 0)
  return block(
    'paragraph',
    parts.map(({ part, bold }) => text(part, bold)),
    { textFormat: 0, textStyle: '' },
  )
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
