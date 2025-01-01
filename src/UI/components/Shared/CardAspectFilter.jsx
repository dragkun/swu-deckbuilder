  import React, { useState, useEffect } from "react";
  import _ from 'lodash';
  import Aspect from "./Aspect";

  import '../../styles/CardAspectFilter.scss'

  const aspects = ['Aggression','Command','Cunning','Heroism','Vigilance','Villainy']

  const CardAspectFilter = ({cardAspectFilter, setCardAspectFilter, deck}) => {
    const [aspectOptions, setAspectOptions] = useState([]);
    const [selectedAspects, setSelectedAspects] = useState();

    useEffect(() => {
      if (deck.type === 'premier') {
        if (deck.leader.aspects && deck.base.aspects) {
          const allAspects = [...new Set(
            [
              ...deck?.base?.aspects,
              ...deck?.leader?.aspects
            ]
          )].sort()
          
          let options = []
          options = _.map(allAspects, aspect => [aspect])
          options.push(allAspects)
          const remainingAspects = aspects.filter(aspect => !options.flat().includes(aspect));
          options.push(remainingAspects);
          setAspectOptions(options); 
          if (_.isEmpty(cardAspectFilter)) {
            handleAspectClick(options[options.length - 2])
          } else {
            const found = _.findIndex(options, option => _.isEqual(option, cardAspectFilter));
            if (found > -1) {
              handleAspectClick(options[found])
            }
          }
        } 
      } else {
        if (deck.leader.aspects && deck.base.aspects && deck.secondLeader.aspects) {
          const allAspects = [...new Set(
            [
              ...deck?.base?.aspects,
              ...deck?.leader?.aspects,
              ...deck?.secondLeader?.aspects || [],
            ]
          )].sort()
          
          let options = []
          options = _.map(allAspects, aspect => [aspect])
          options.push(allAspects)
          const remainingAspects = aspects.filter(aspect => !options.flat().includes(aspect));
          options.push(remainingAspects);
          setAspectOptions(options); 
          if (_.isEmpty(cardAspectFilter)) {
            handleAspectClick(options[options.length - 2])
          } else {
            const found = _.findIndex(options, option => _.isEqual(option, cardAspectFilter));
            if (found > -1) {
              handleAspectClick(options[found])
            }
          }
        } 
      }
    }, [deck])

    useEffect(() => {
      if (!selectedAspects || selectedAspects.length === 0) {
        setSelectedAspects(aspectOptions[aspectOptions.length - 2])
      }
    }, [aspectOptions])

    const handleAspectClick = (aspect) => {
      setSelectedAspects(aspect)
      setCardAspectFilter(aspect)
    }

    const aspectButtons = aspectOptions.map(option => {
      if (selectedAspects === option) {
        return <button className="secondary">
          <div className="card-aspect-filter">
            {option.map((a, index) => <Aspect key={index} aspect={a} />)}
          </div>
        </button>
      }
      return <button className="secondary outline" onClick={() => handleAspectClick(option)}>
        <div className="card-aspect-filter">
          {option.map((a, index) => <Aspect key={index} aspect={a} />)}
        </div>
      </button>
    })

    return (
      <div role="group" className="card-aspect-filter">
        {aspectButtons}
      </div>
    )
  }

  export default CardAspectFilter
