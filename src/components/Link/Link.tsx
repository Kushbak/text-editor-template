import { ContentState } from "draft-js"
import { PropsWithChildren } from "react"
import { useEditorApi } from "../TextEditor/context"

type LinkProps = {
  contentState: ContentState
  entityKey: string
}

const Link = ({ contentState, entityKey, children }: PropsWithChildren<LinkProps>) => {
  const { setEntityData } = useEditorApi()
  const { url } = contentState.getEntity(entityKey).getData()

  const handleClick = () => {
    const newUrl = prompt('URL: ', url)
    if (newUrl) {
      setEntityData(entityKey, { url: newUrl })
    }
  }

  return (
    <a href={url} onClick={handleClick}>
      {children}
    </a>
  )
}

export default Link