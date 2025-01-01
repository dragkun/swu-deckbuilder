const CardSwitch = ({onClick, isSelected}) =>{
    return <div className={`${isSelected ? 'secondary' : 'contrast'} card-count-switch`} onClick={onClick}>
        <fieldset>
            <label>
                <input type="checkbox" checked={isSelected} onChange={onClick} role="switch" className={isSelected ? 'selected' : ''} />
            </label>
        </fieldset>
    </div>
  }
  
  export default CardSwitch