const CardButton = ({count, onClick, isSelected}) =>{
  return <div className={`${isSelected ? 'secondary' : 'contrast'} card-count-button`} onClick={onClick}>{count}</div>
}

export default CardButton