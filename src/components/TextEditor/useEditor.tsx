import { CompositeDecorator, ContentState, DraftEditorCommand, DraftEntityMutability, EditorState, KeyBindingUtil, RichUtils, getDefaultKeyBinding } from "draft-js";
import { useCallback, useMemo, useState } from "react";
import { BlockType, EnitityType, InlineStyle, KeyCommand } from "./config";
import LinkDecorator from '../Link'
import { HTMLtoState, stateToHTML } from "./convert";

export type EditorApi = {
  state: EditorState,
  currentBlockType: BlockType
  onChange: (state: EditorState) => void
  toggleBlockType: (blockType: BlockType) => void
  toggleInlineStyle: (inlineStyle: InlineStyle) => void
  hasInlineStyle: (inlineStyle: InlineStyle) => boolean
  addLink: (url: string) => void
  setEntityData: (entityKey: string, data: Record<string, any>) => void
  handleKeyCommand: (command: DraftEditorCommand, editorState: EditorState) => 'handled' | 'not-handled'
  handleKeyBinding: (e: React.KeyboardEvent) => string | null
  toHTML: () => string
}

const decorator = new CompositeDecorator([LinkDecorator])

export const useEditor = (html?: string): EditorApi => {
  const [state, setState] = useState(() => html ? EditorState.createWithContent(HTMLtoState(html), decorator) : EditorState.createEmpty(decorator))

  const toggleBlockType = useCallback((blockType: BlockType) => {
    setState((currentState) => RichUtils.toggleBlockType(currentState, blockType))
  }, [])

  const currentBlockType = useMemo(() => {
    const selection = state.getSelection()
    const content = state.getCurrentContent()
    const block = content.getBlockForKey(selection.getStartKey())
    return block.getType() as BlockType
  }, [state])

  const toggleInlineStyle = useCallback((inlineStyle: InlineStyle) => {
    setState((currentState) => RichUtils.toggleInlineStyle(currentState, inlineStyle))
  }, [])

  const hasInlineStyle = useCallback((inlineStyle: InlineStyle) => {
    const currentStyle = state.getCurrentInlineStyle()
    return currentStyle.has(inlineStyle)
  }, [state])

  const addEntity = useCallback((entityType: EnitityType, data: Record<string, string>, mutability: DraftEntityMutability) => {
    setState(currentState => {
      const contentState = currentState.getCurrentContent()
      const contentStateWithEntity = contentState.createEntity(entityType, mutability, data)
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
      const newState = EditorState.set(currentState, { currentContent: contentStateWithEntity })

      return RichUtils.toggleLink(newState, newState.getSelection(), entityKey)
    })
  }, [])

  const addLink = useCallback((url: string) => {
    addEntity(EnitityType.link, { url }, 'MUTABLE')
  }, [addEntity])

  const setEntityData = useCallback((entityKey: string, data: Record<string, any>) => {
    setState(currentState => {
      const content = currentState.getCurrentContent()
      const contentStateUpdated = content.mergeEntityData(entityKey, data)

      return EditorState.push(currentState, contentStateUpdated, 'apply-entity')
    })
  }, [])

  const handleKeyCommand = useCallback((command: KeyCommand, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (command === 'accent') {
      toggleInlineStyle(InlineStyle.ACCENT)
      return 'handled'
    }

    if (newState) {
      setState(newState)
      return 'handled'
    }

    return 'not-handled'
  }, [])

  const handleKeyBinding = useCallback((e: React.KeyboardEvent) => {
    if (e.keyCode === 81 && KeyBindingUtil.hasCommandModifier(e)) {
      return 'accent'
    }

    return getDefaultKeyBinding(e)
  }, [])

  const toHTML = useCallback(() => {
    return stateToHTML(state.getCurrentContent())
  }, [state])

  return useMemo(() => ({
    state,
    onChange: setState,
    toggleBlockType,
    currentBlockType,
    toggleInlineStyle,
    hasInlineStyle,
    addLink,
    setEntityData,
    handleKeyCommand,
    handleKeyBinding,
    toHTML,
  }), [
    state,
    setState,
    toggleBlockType,
    currentBlockType,
    toggleInlineStyle,
    hasInlineStyle,
    addLink,
    setEntityData,
    handleKeyCommand,
    handleKeyBinding,
    toHTML,
  ])
} 