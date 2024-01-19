import classNames from "classnames"
import { useEditorApi } from "../TextEditor/context"
import { InlineStyle } from "../TextEditor/config"

type ToolPanelProps = {
  className?: string
}

const INLINE_STYLES_CODES = Object.values(InlineStyle)

const ToolPanel = ({ className }: ToolPanelProps) => {
  const { toggleInlineStyle, hasInlineStyle, addLink, toHTML } = useEditorApi()

  const handleAddLink = () => {
    const url = prompt('URL:')

    if(url) {
      addLink(url)
    }
  }
  
  return (
    <div className={classNames('tool-panel', className)}>
      {INLINE_STYLES_CODES.map(code => (
        <button
          key={code}
          className={classNames('tool-panel__item', hasInlineStyle(code) && 'tool-panel__item_active')}
          onMouseDown={e => {
            e.preventDefault()
            toggleInlineStyle(code)
          }}
        >
          {code}
        </button>
      )
      )}
      <button onClick={handleAddLink}>Добавить ссылку</button>
      <button onClick={() => console.log(toHTML())}>Print</button>
    </div>
  )
}

export default ToolPanel