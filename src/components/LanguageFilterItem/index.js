// Write your code here
const LanguageFilterItem = props => {
  const {details, setActiveId} = props
  const {id, language} = details

  const onClickButton = () => {
    setActiveId(id)
  }

  return (
    <li>
      <button type="button" onClick={onClickButton}>
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
