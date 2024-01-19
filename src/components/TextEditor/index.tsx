import { useEditorApi } from "./context"
import classNames from "classnames"
import { Editor } from "draft-js"
import { BLOCK_RENDER_MAP, CUSTOM_STYLE_MAP } from "./config"

export type TextEditorProps = {
  className?: string
}

const TextEditor = ({ className }: TextEditorProps) => {
  const { state, onChange, handleKeyCommand } = useEditorApi()

  return (
    <div className={classNames('text-editor', className)} >
      <Editor
        handleKeyCommand={handleKeyCommand}
        placeholder="Type here"
        editorState={state}
        onChange={onChange}
        blockRenderMap={BLOCK_RENDER_MAP}
        customStyleMap={CUSTOM_STYLE_MAP}
      />
    </div >
  )
}

export default TextEditor