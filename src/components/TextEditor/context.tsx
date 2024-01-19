import { PropsWithChildren, createContext, useContext } from "react";
import { EditorApi, useEditor } from "./useEditor";

const TextEditorContext = createContext<EditorApi | undefined>(undefined)

export const useEditorApi = () => {
  const context = useContext(TextEditorContext)
  if(!context) {
    throw new Error('useEditorApi musst be used within TextEditorProvider')
  }
  return context
}

export const TextEditorProvider = ({ children }: PropsWithChildren) => {
  const editorApi = useEditor()

  return (
    <TextEditorContext.Provider value={editorApi}>
      {children}
    </TextEditorContext.Provider>
  )
}
