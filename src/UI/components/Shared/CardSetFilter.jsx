const CardSetFilter = ({cardSets, setCardSetFilter, cardSetFilter}) => {
  return (
    <div>
      <details>
        <summary>Sets: {cardSetFilter.join(', ')}</summary>
        <div style={{marginTop: '0.5rem'}}>
          {cardSets.map(set => (
            <label key={set} style={{display: 'block', marginBottom: '0.25rem'}}>
              <input
                type="checkbox"
                checked={cardSetFilter.includes(set)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCardSetFilter([...cardSetFilter, set]);
                  } else {
                    setCardSetFilter(cardSetFilter.filter(s => s !== set));
                  }
                }}
              />
              {' '}{set}
            </label>
          ))}
        </div>
      </details>
    </div>
  )
} 

export default CardSetFilter