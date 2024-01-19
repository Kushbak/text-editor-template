import { ContentBlock, ContentState, DraftDecorator } from "draft-js";
import { EnitityType } from "../TextEditor/config";
import Link from "./Link";

/**
  @param contentBlock - Блок, в котором производилось последнее изменение
  @param callback - Функция, которая должна быть вызвана с индексами фрагмента текста
  @param contentState - Текущая карта контента 
*/
const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((char) => {
    const entityKey = char.getEntity()
    return (
      entityKey !== null && contentState.getEntity(entityKey).getType() === EnitityType.link
    )
  }, callback)
}

const decorator: DraftDecorator = {
  strategy: findLinkEntities,
  component: Link
}

export default decorator